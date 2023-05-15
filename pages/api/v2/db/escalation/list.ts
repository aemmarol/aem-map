import {InsertManyResult} from "mongodb";
import getAuthHandler, {
  NextApiRequestExtended,
} from "../../../../../mongodb/authHandler";
import {escalationCollectionName} from "../../../../../mongodb/dbCollectionNames";

export default getAuthHandler()
  .post(async (req: NextApiRequestExtended, res) => {
    const filterObj = JSON.parse(req.body);
    const doc = await req.db
      .collection(escalationCollectionName)
      .find(filterObj.findFilter)
      .toArray();
    res.json(doc);
  })
  .put(async (req: NextApiRequestExtended, res) => {
    console.log("Api hit");
    const doc: InsertManyResult = await req.db
      .collection(escalationCollectionName)
      .insertMany(JSON.parse(req.body));
    res.json(doc);
  });
