import {InsertOneResult, ObjectId, DeleteResult, UpdateResult} from "mongodb";
import getAuthHandler, {
  NextApiRequestExtended,
} from "../../../../../mongodb/authHandler";
import {umoorListCollectionName} from "../../../../../mongodb/dbCollectionNames";
import {userRoles} from "../../../../../types";

export default getAuthHandler()
  .get(async (req: NextApiRequestExtended, res) => {
    const doc = await req.db
      .collection(umoorListCollectionName)
      .find()
      .sort({value: 1})
      .toArray();
    res.json(doc);
  })
  .post(async (req: NextApiRequestExtended, res) => {
    const {userData} = req;
    if (userData.userRole.includes(userRoles.Admin)) {
      const doc: InsertOneResult = await req.db
        .collection(umoorListCollectionName)
        .insertOne(JSON.parse(req.body));
      res.json(doc);
    } else {
      res.status(401).json({msg: "user access denied!"});
    }
  })
  .put(async (req: NextApiRequestExtended, res) => {
    const {userData} = req;
    if (userData.userRole.includes(userRoles.Admin)) {
      const {id,data:updateData} = JSON.parse(req.body);
      const doc:UpdateResult  = await req.db
        .collection(umoorListCollectionName)
        .updateOne({_id:new ObjectId(id)}, {$set: updateData});
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
        .deleteOne({_id: new ObjectId(id)});
      res.json(doc);
    } else {
      res.status(401).json({msg: "user access denied!"});
    }
  });
