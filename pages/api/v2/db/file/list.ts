import {DeleteResult} from "mongodb";
import {fileCollectionName} from "../../../../../firebase/dbCollectionNames";
import getAuthHandler, {
  NextApiRequestExtended,
} from "../../../../../mongodb/authHandler";
import {userRoles} from "../../../../../types";

export default getAuthHandler()
  .get(async (req: NextApiRequestExtended, res) => {
    const {userData} = req;
    if (userData.userRole.includes(userRoles.Admin)) {
      const doc = await req.db
        .collection(fileCollectionName)
        .find()
        .sort({tanzeem_file_no: 1})
        .toArray();
      res.json(doc);
    } else {
      res.status(401).json({msg: "user access denied!"});
    }
  })
  .delete(async (req: NextApiRequestExtended, res) => {
    const {userData} = req;
    if (userData.userRole.includes(userRoles.Admin)) {
      const doc: DeleteResult = await req.db
        .collection(fileCollectionName)
        .remove({});
      res.json(doc);
    } else {
      res.status(401).json({msg: "user access denied!"});
    }
  });
