import {verify} from "jsonwebtoken";
import {NextApiRequest, NextApiResponse} from "next";
import nextConnect from "next-connect";
import {verifiedToken} from "../pages/api/v1/authentication";
import middleware from "./database";

export interface NextApiRequestExtended extends NextApiRequest {
  db: any;
  userData: any;
  new: any;
}

export default function getAuthHandler() {
  return nextConnect<NextApiRequest, NextApiResponse>({
    onError(error, req, res) {
      res.status(500).json({
        error: `Sorry something Happened! ${error.message}`,
      });
    },
    onNoMatch(req, res) {
      res.status(404).json({error: `Method ${req.method} Not Allowed`});
    },
  })
    .use(middleware)
    .use((req: NextApiRequestExtended, res, next) => {
      const {authorization} = req.headers;
      if (!authorization) {
        res.status(401).json({msg: "user not authorized"});
      } else {
        try {
          const userData = verify(
            authorization as string,
            process.env.NEXT_PUBLIC_ACCESS_TOKEN_SALT as string
          ) as verifiedToken;
          req.userData = userData.data;
          next();
        } catch (error: any) {
          res.status(401).json({msg: "invalid Token"});
        }
      }
    });
}
