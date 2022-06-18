import {InsertOneResult} from "mongodb";
import {fileCollectionName} from "../../../../../firebase/dbCollectionNames";
import getAuthHandler, {
  NextApiRequestExtended,
} from "../../../../../mongodb/authHandler";
import {userRoles} from "../../../../../types";

export default getAuthHandler()
  .get(async (req: NextApiRequestExtended, res) => {
    const {userData} = req;
    const {fieldName, value} = req.query;
    if (userData.userRole.includes(userRoles.Admin)) {
      if (!fieldName || !value) {
        res.status(400).json({msg: "invalid request!"});
      } else {
        const key: string = fieldName as string;
        const qValue: string = value as string;
        const doc = await req.db
          .collection(fileCollectionName)
          .findOne({[key]: qValue});
        res.json(doc);
      }
    } else {
      res.status(401).json({msg: "user access denied!"});
    }
  })
  .post(async (req: NextApiRequestExtended, res) => {
    const {userData} = req;
    if (userData.userRole.includes(userRoles.Admin)) {
      const doc: InsertOneResult = await req.db
        .collection(fileCollectionName)
        .insertOne(JSON.parse(req.body));
      res.json(doc);
    } else {
      res.status(401).json({msg: "user access denied!"});
    }
  });
//   .put(async (req: NextApiRequestExtended, res) => {
//     const {userData} = req;

//     const updateData = JSON.parse(req.body);
//     const project_id = updateData.id;
//     delete updateData.id;

//     if (userData.userRole.includes(userRoles.Admin)) {
//       if (!project_id) {
//         res.status(400).json({msg: "invalid request!"});
//       } else {
//         const doc: UpdateResult = await req.db
//           .collection(sectorCollectionName)
//           .updateOne({_id: new ObjectId(project_id)}, {$set: updateData});
//         res.json(doc);
//       }
//     } else {
//       res.status(401).json({msg: "user access denied!"});
//     }
//   });
