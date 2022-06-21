import {ObjectId, UpdateResult} from "mongodb";
import getAuthHandler, {
  NextApiRequestExtended,
} from "../../../../../mongodb/authHandler";
import {sectorCollectionName} from "../../../../../mongodb/dbCollectionNames";
import {userRoles} from "../../../../../types";

export default getAuthHandler().put(
  async (req: NextApiRequestExtended, res) => {
    const {userData} = req;
    const updateData = JSON.parse(req.body);
    const project_id = updateData.id;
    delete updateData.id;

    if (userData.userRole.includes(userRoles.Admin)) {
      if (!project_id) {
        res.status(400).json({msg: "invalid request!"});
      } else {
        const doc: UpdateResult = await req.db
          .collection(sectorCollectionName)
          .updateOne({_id: new ObjectId(project_id)}, {$push: updateData});
        res.json(doc);
      }
    } else {
      res.status(401).json({msg: "user access denied!"});
    }
  }
);
