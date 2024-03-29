import {DeleteResult, InsertManyResult} from "mongodb";
import getAuthHandler, {
  NextApiRequestExtended,
} from "../../../../../mongodb/authHandler";
import {fileCollectionName} from "../../../../../mongodb/dbCollectionNames";
import {userRoles} from "../../../../../types";

export default getAuthHandler()
  .post(async (req: NextApiRequestExtended, res) => {
    const {userData} = req;
    if (userData.userRole.includes(userRoles.Admin)) {
      const doc: InsertManyResult = await req.db
        .collection(fileCollectionName)
        .insertMany(JSON.parse(req.body));
      res.json(doc);
    } else {
      res.status(401).json({msg: "user access denied!"});
    }
  })
  .get(async (req: NextApiRequestExtended, res) => {
    const {queryName, queryValue} = req.query;
    if (queryName && queryValue) {
      const queryObj =
        queryName === "sector"
          ? {"sub_sector.sector.name": queryValue}
          : queryName === "subsector"
          ? {"sub_sector.name": queryValue}
          : {};
      const doc = await req.db
        .collection(fileCollectionName)
        .find(queryObj)
        .sort({tanzeem_file_no: 1})
        .toArray();
      res.json(doc);
    } else {
      const doc = await req.db
        .collection(fileCollectionName)
        .find()
        .sort({tanzeem_file_no: 1})
        .toArray();
      res.json(doc);
    }
  })
  .delete(async (req: NextApiRequestExtended, res) => {
    const {userData} = req;
    if (userData.userRole.includes(userRoles.Admin)) {
      const doc: DeleteResult = await req.db
        .collection(fileCollectionName)
        .deleteMany({});
      res.json(doc);
    } else {
      res.status(401).json({msg: "user access denied!"});
    }
  });
