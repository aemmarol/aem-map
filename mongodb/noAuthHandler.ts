import {NextApiRequest, NextApiResponse} from "next";
import nextConnect from "next-connect";
import middleware from "./database";

export default function getNoAuthHandler() {
  return nextConnect<NextApiRequest, NextApiResponse>({
    onError(error, req, res) {
      res.status(500).json({
        error: `Sorry something Happened! ${error.message}`,
      });
    },
    onNoMatch(req, res) {
      res.status(404).json({error: `Method ${req.method} Not Allowed`});
    },
  }).use(middleware);
}
