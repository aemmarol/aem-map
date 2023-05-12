import {InsertOneResult} from "mongodb";
import getAuthHandler, {
  NextApiRequestExtended,
} from "../../../../../mongodb/authHandler";
import {fileCollectionName} from "../../../../../mongodb/dbCollectionNames";
import {userRoles} from "../../../../../types";

export default getAuthHandler()
  .get(async (req: NextApiRequestExtended, res) => {
    const {fieldName, value} = req.query;
    if (!fieldName || !value) {
      res.status(400).json({msg: "invalid request!"});
    } else {
      const key: string = fieldName as string;
      const qValue: string = value as string;
      const doc = await req.db
        .collection(fileCollectionName)
        .findOne({[key]: key === "tanzeem_file_no" ? Number(qValue) : qValue});
      res.json(doc);
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
