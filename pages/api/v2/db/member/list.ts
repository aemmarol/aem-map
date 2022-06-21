import {DeleteResult, InsertManyResult} from "mongodb";
import getAuthHandler, {
  NextApiRequestExtended,
} from "../../../../../mongodb/authHandler";
import {memberCollectionName} from "../../../../../mongodb/dbCollectionNames";
import {userRoles} from "../../../../../types";

export default getAuthHandler()
  .get(async (req: NextApiRequestExtended, res) => {
    const {hofId} = req.query;
    const doc = await req.db
      .collection(memberCollectionName)
      .find({hof_id: hofId.toString()})
      .toArray();
    res.json(doc);
  })
  .post(async (req: NextApiRequestExtended, res) => {
    const {userData} = req;
    if (userData.userRole.includes(userRoles.Admin)) {
      const doc: InsertManyResult = await req.db
        .collection(memberCollectionName)
        .insertMany(JSON.parse(req.body));
      res.json(doc);
    } else {
      res.status(401).json({msg: "user access denied!"});
    }
  })
  .delete(async (req: NextApiRequestExtended, res) => {
    const {userData} = req;
    if (userData.userRole.includes(userRoles.Admin)) {
      const doc: DeleteResult = await req.db
        .collection(memberCollectionName)
        .remove({});
      res.json(doc);
    } else {
      res.status(401).json({msg: "user access denied!"});
    }
  });
