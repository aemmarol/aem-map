import {escalationCollectionName} from "../../../../../firebase/dbCollectionNames";
import getAuthHandler, {
  NextApiRequestExtended,
} from "../../../../../mongodb/authHandler";
import {userRoles} from "../../../../../types";

export default getAuthHandler().get(
  async (req: NextApiRequestExtended, res) => {
    const {userData} = req;
    const {status, type} = req.query;
    const matchObj = !status ? {} : {status: status};
    const groupby =
      type === "sector"
        ? "$file_details.sub_sector.sector.name"
        : type === "umoor"
        ? "$type.value"
        : "";
    if (userData.userRole.includes(userRoles.Admin)) {
      const doc = await req.db
        .collection(escalationCollectionName)
        .aggregate([
          {$match: matchObj},
          {
            $group: {
              _id: groupby,
              count: {$sum: 1},
            },
          },
        ])
        .toArray();
      res.json(doc);
    } else {
      res.status(401).json({msg: "user access denied!"});
    }
  }
);
