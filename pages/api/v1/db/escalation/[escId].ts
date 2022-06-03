import nextConnect from "next-connect";
import {escalationCollectionName} from "../../../../../firebase/dbCollectionNames";
import middleware from "../../../../../mongodb/database";

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req: any, res: any) => {
  console.log(req.query.escId, "REQUEST");
  let doc = await req.db
    .collection(escalationCollectionName)
    .findOne({id: req.query.escId});

  res.json(doc);
});

export default handler;
