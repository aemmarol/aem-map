import {DeleteResult, InsertOneResult, ObjectId} from "mongodb";
import {
  fileDetailsFieldCollectionName,
  mumeneenDetailsFieldCollectionName,
} from "../../../../../firebase/dbCollectionNames";
import getAuthHandler, {
  NextApiRequestExtended,
} from "../../../../../mongodb/authHandler";
import {databaseMumeneenFieldData, userRoles} from "../../../../../types";

export default getAuthHandler()
  .get(async (req: NextApiRequestExtended, res) => {
    const {userData} = req;
    if (userData.userRole.includes(userRoles.Admin)) {
      const {collection} = req.query;
      const collectionName =
        collection === "file"
          ? fileDetailsFieldCollectionName
          : collection === "mumeneen"
          ? mumeneenDetailsFieldCollectionName
          : "";

      if (!collection || collectionName === "") {
        res.status(400).json({msg: "invalid request!"});
      } else {
        const doc: databaseMumeneenFieldData[] = await req.db
          .collection(collectionName)
          .find()
          .toArray();
        res.json(doc);
      }
    } else {
      res.status(401).json({msg: "user access denied!"});
    }
  })
  .post(async (req: NextApiRequestExtended, res) => {
    const {userData} = req;
    if (userData.userRole.includes(userRoles.Admin)) {
      const {collectionName} = req.query;
      if (!collectionName) {
        res.status(400).json({msg: "invalid request!"});
      } else {
        const doc: InsertOneResult = await req.db
          .collection(collectionName)
          .insert(JSON.parse(req.body));
        res.json(doc);
      }
    } else {
      res.status(401).json({msg: "user access denied!"});
    }
  })
  .delete(async (req: NextApiRequestExtended, res) => {
    const {userData} = req;
    if (userData.userRole.includes(userRoles.Admin)) {
      const {collectionName} = req.query;
      if (!collectionName) {
        res.status(400).json({msg: "invalid request!"});
      } else {
        const {id} = JSON.parse(req.body);
        const doc: DeleteResult = await req.db
          .collection(collectionName)
          .remove({_id: new ObjectId(id)});
        res.json(doc);
      }
    } else {
      res.status(401).json({msg: "user access denied!"});
    }
  });
