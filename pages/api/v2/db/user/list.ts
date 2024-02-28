import {DeleteResult, InsertManyResult} from "mongodb";
import getAuthHandler, {
  NextApiRequestExtended,
} from "../../../../../mongodb/authHandler";
import {userCollectionName} from "../../../../../mongodb/dbCollectionNames";
import {userRoles} from "../../../../../types";

export default getAuthHandler()
  .get(async (req: NextApiRequestExtended, res) => {
    const findQuery = req.query.role
      ? {userRole: {$all: [req.query.role]}}
      : {};
    const doc = await req.db
      .collection(userCollectionName)
      .find(findQuery)
      .toArray();
    res.json(doc);
  })
  .put(async (req: NextApiRequestExtended, res) => {
    const {userData} = req;
    if (userData.userRole.includes(userRoles.Admin)) {
      try {
        await req.db.collection(userCollectionName).deleteMany({});

        const doc: InsertManyResult = await req.db
          .collection(userCollectionName)
          .insertMany(JSON.parse(req.body));

        return res.json(doc);
      } catch (error: any) {
        return res.status(500).json({msg: error.message});
      }
    } else {
      return res.status(401).json({msg: "user access denied!"});
    }
  });
