import getAuthHandler, {
  NextApiRequestExtended,
} from "../../../../../mongodb/authHandler";
import {subsectorCollectionName} from "../../../../../mongodb/dbCollectionNames";
import {userRoles} from "../../../../../types";

export default getAuthHandler().get(
  async (req: NextApiRequestExtended, res) => {
    const {userData} = req;
    if (
      userData.userRole.includes(userRoles.Admin) ||
      userData.userRole.includes(userRoles.Masool) ||
      userData.userRole.includes(userRoles.Masoola)
    ) {
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
