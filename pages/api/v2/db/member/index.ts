import {memberCollectionName} from "../../../../../firebase/dbCollectionNames";
import getAuthHandler, {
  NextApiRequestExtended,
} from "../../../../../mongodb/authHandler";
import {userRoles} from "../../../../../types";

export default getAuthHandler()
    .get(async (req: NextApiRequestExtended, res) => {
      const {userData} = req;
      const { itsId} = req.query;
      if (userData.userRole.includes(userRoles.Admin)) {
        if (!itsId) {
          res.status(400).json({msg: "invalid request!"});
        } else {
          const qValue: string = itsId as string;
          const doc = await req.db
            .collection(memberCollectionName)
            .findOne({_id: qValue});
          res.json(doc);
        }
      } else {
        res.status(401).json({msg: "user access denied!"});
      }
    })

