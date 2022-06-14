import {InsertOneResult, ObjectId, DeleteResult} from "mongodb";
import {umoorListCollectionName} from "../../../../../firebase/dbCollectionNames";
import getAuthHandler, {
  NextApiRequestExtended,
} from "../../../../../mongodb/authHandler";
import {userRoles} from "../../../../../types";

export default getAuthHandler()
  .get(async (req: NextApiRequestExtended, res) => {
    const {userData} = req;
    if (userData.userRole.includes(userRoles.Admin)) {
      const doc = await req.db
        .collection(umoorListCollectionName)
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
      const doc: InsertOneResult = await req.db
        .collection(umoorListCollectionName)
        .insert(JSON.parse(req.body));
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
        .collection(umoorListCollectionName)
        .remove({_id: new ObjectId(id)});
      res.json(doc);
    } else {
      res.status(401).json({msg: "user access denied!"});
    }
  });
