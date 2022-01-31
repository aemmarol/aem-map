// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from "next";
import Joi from "joi";
import {getAuth, signInWithCustomToken} from "firebase/auth";
import "../../../firebase/firebaseConfig";

interface Data {
  name?: string;
  data?: object;
  msg: string;
}

const loginSchema = Joi.object({
  itsId: Joi.string().required(),
  password: Joi.string().required(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const auth = getAuth();

    const {error} = loginSchema.validate(req.body);
    const {itsId, password} = req.body;

    if (error) {
      return res.status(400).json({msg: error.details[0].message});
    } else {
      await fetch(
        process.env.NEXT_PUBLIC_AEM_AUTH_API_DOMAIN + "/api/authentication",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({itsId, password}),
        }
      )
        .then((result) => {
          if (result.ok) {
            result.json().then((tokenData) => {
              signInWithCustomToken(auth, tokenData.data).then((finalToken) => {
                return res
                  .status(200)
                  .json({msg: "login Successful", data: finalToken});
              });
            });
          } else {
            return res.status(400).json({msg: "user not found"});
          }
        })
        .catch((error) => {
          console.log(error);
          return res.status(400).json({msg: "user not found"});
        });
    }
  } else {
    return res.status(404).json({msg: "api not found"});
  }
}
