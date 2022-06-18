import {subsectorCollectionName} from "../../../../../firebase/dbCollectionNames";
import getAuthHandler, {
  NextApiRequestExtended,
} from "../../../../../mongodb/authHandler";
import {userRoles} from "../../../../../types";

export default getAuthHandler().get(
  async (req: NextApiRequestExtended, res) => {
    const {userData} = req;
    if (userData.userRole.includes(userRoles.Admin)) {
      const doc = await req.db
        .collection(subsectorCollectionName)
        .find()
        .sort({name: 1})
        .toArray();
      res.json(doc);
    } else {
      res.status(401).json({msg: "user access denied!"});
    }
  }
);
