import getAuthHandler, {
  NextApiRequestExtended,
} from "../../../../../mongodb/authHandler";
import {userCollectionName} from "../../../../../mongodb/dbCollectionNames";
import {userRoles} from "../../../../../types";

export default getAuthHandler().get(
  async (req: NextApiRequestExtended, res) => {
    const {userData} = req;
    if (userData.userRole.includes(userRoles.Admin)) {
      const doc = await req.db.collection(userCollectionName).find().toArray();
      res.json(doc);
    } else {
      res.status(401).json({msg: "user access denied!"});
    }
  }
);
