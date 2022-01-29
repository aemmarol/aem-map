// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from "next";
import Joi from "joi";

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
    // console.log(loginSchema.validate(req.body));
    const {error, value} = loginSchema.validate(req.body);
    if (error) {
      res.status(400).json({msg: error.details[0].message});
    } else {
      res.status(200).json({msg: "success", data: value});
    }
  } else {
    res.status(404).json({msg: "api not found"});
  }
}
