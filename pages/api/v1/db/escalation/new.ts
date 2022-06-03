import nextConnect from "next-connect";
import {escalationCollectionName} from "../../../../../firebase/dbCollectionNames";
import middleware from "../../../../../mongodb/database";

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req: any, res: any) => {
  let doc = await req.db.collection(escalationCollectionName).insert(req.body);
  res.json(doc);
});

export default handler;
