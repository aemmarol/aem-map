import {ObjectId, UpdateResult} from "mongodb";
import {sectorCollectionName} from "../../../../../firebase/dbCollectionNames";
import getAuthHandler, {
  NextApiRequestExtended,
} from "../../../../../mongodb/authHandler";
import {userRoles} from "../../../../../types";

export default getAuthHandler().put(
  async (req: NextApiRequestExtended, res) => {
    const {userData} = req;
    const updateData = JSON.parse(req.body);
    const fileObj = {files: updateData.files};
    const statsObj = {
      no_of_females: updateData.no_of_females,
      no_of_males: updateData.no_of_males,
    };
    const project_id = updateData.id;
    delete updateData.id;

    if (userData.userRole.includes(userRoles.Admin)) {
      if (!project_id) {
        res.status(400).json({msg: "invalid request!"});
      } else {
        const doc: UpdateResult = await req.db
          .collection(sectorCollectionName)
          .updateOne(
            {_id: new ObjectId(project_id)},
            {$set: {updated_at: updateData.updated_at}},
            {$push: fileObj},
            {$inc: statsObj}
          );
        res.json(doc);
      }
    } else {
      res.status(401).json({msg: "user access denied!"});
    }
  }
);
