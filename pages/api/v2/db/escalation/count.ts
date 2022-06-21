import getAuthHandler, {
  NextApiRequestExtended,
} from "../../../../../mongodb/authHandler";
import {escalationCollectionName} from "../../../../../mongodb/dbCollectionNames";
import {userRoles} from "../../../../../types";
import {filterTypes} from "../../../../../types/escalation";

// get is used for admin dashboard
// post is used for filter and rest pages

export default getAuthHandler()
  .get(async (req: NextApiRequestExtended, res) => {
    const {userData} = req;
    const {status, type} = req.query;
    const matchObj = !status ? {} : {status: status};
    const groupby =
      type === filterTypes.Sector
        ? "$file_details.sub_sector.sector.name"
        : type === filterTypes.Umoor
        ? "$type.value"
        : type === filterTypes.SubSector
        ? "$file_details.sub_sector.name"
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
          {$sort: {_id: 1}},
        ])
        .toArray();
      res.json(doc);
    } else {
      res.status(401).json({msg: "user access denied!"});
    }
  })
  .post(async (req: NextApiRequestExtended, res) => {
    const {status, type, filterName, filterValue} = req.query;
    const filterBy: string =
      filterName === filterTypes.Sector
        ? "file_details.sub_sector.sector.name"
        : filterName === filterTypes.SubSector
        ? "file_details.sub_sector.name"
        : filterName === filterTypes.Umoor
        ? "type.value"
        : "";
    const matchObj = !status
      ? {[filterBy]: filterValue}
      : {status: status, [filterBy]: filterValue};
    const groupby =
      type === filterTypes.Sector
        ? "$file_details.sub_sector.sector.name"
        : type === filterTypes.Umoor
        ? "$type.value"
        : type === filterTypes.SubSector
        ? "$file_details.sub_sector.name"
        : "";
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
  });
