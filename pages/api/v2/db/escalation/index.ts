import {InsertOneResult} from "mongodb";
import nextConnect from "next-connect";
import getAuthHandler, {
  NextApiRequestExtended,
} from "../../../../../mongodb/authHandler";
import middleware from "../../../../../mongodb/database";
import {escalationCollectionName} from "../../../../../mongodb/dbCollectionNames";

const handler = nextConnect();

handler.use(middleware);

export default getAuthHandler().post(
  async (req: NextApiRequestExtended, res) => {
    const doc: InsertOneResult = await req.db
      .collection(escalationCollectionName)
      .insertOne(JSON.parse(req.body));
    res.json(doc);
  }
);
