import {InsertOneResult, ObjectId, DeleteResult} from "mongodb";
import getAuthHandler, {
  NextApiRequestExtended,
} from "../../../../../mongodb/authHandler";
import {userCollectionName} from "../../../../../mongodb/dbCollectionNames";
import {userRoles} from "../../../../../types";

export default getAuthHandler()
  .post(async (req: NextApiRequestExtended, res) => {
    const {userData} = req;
    if (userData.userRole.includes(userRoles.Admin)) {
      const doc: InsertOneResult = await req.db
        .collection(userCollectionName)
        .insertOne(JSON.parse(req.body));
      res.json(doc);
    } else {
      res.status(401).json({msg: "user access denied!"});
    }
  })
  .delete(async (req: NextApiRequestExtended, res) => {
    const {userData} = req;
    if (userData.userRole.includes(userRoles.Admin)) {
      const {id} = JSON.parse(req.body);
      const doc: DeleteResult = await req.db
        .collection(userCollectionName)
        .deleteOne({_id: new ObjectId(id)});
      res.json(doc);
    } else {
      res.status(401).json({msg: "user access denied!"});
    }
  });
