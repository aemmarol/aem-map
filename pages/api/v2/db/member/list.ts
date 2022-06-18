import {DeleteResult, InsertManyResult} from "mongodb";
import {memberCollectionName} from "../../../../../firebase/dbCollectionNames";
import getAuthHandler, {
  NextApiRequestExtended,
} from "../../../../../mongodb/authHandler";
import {userRoles} from "../../../../../types";

export default getAuthHandler()
  .get(async (req: NextApiRequestExtended, res) => {
    const {userData} = req;
    if (userData.userRole.includes(userRoles.Admin)) {
      const doc = await req.db
        .collection(memberCollectionName)
        .find()
        .toArray();
      res.json(doc);
    } else {
      res.status(401).json({msg: "user access denied!"});
    }
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
