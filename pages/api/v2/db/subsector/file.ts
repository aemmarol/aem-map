import {ObjectId, UpdateResult} from "mongodb";
import getAuthHandler, {
  NextApiRequestExtended,
} from "../../../../../mongodb/authHandler";
import {subsectorCollectionName} from "../../../../../mongodb/dbCollectionNames";

export default getAuthHandler().put(
  async (req: NextApiRequestExtended, res) => {
    const updateData = JSON.parse(req.body);
    const statsObj = {
      no_of_females: updateData.no_of_females,
      no_of_males: updateData.no_of_males,
    };
    const project_id = updateData.id;
    delete updateData.id;

    if (!project_id) {
      res.status(400).json({msg: "invalid request!"});
    } else {
      const doc: UpdateResult = await req.db
        .collection(subsectorCollectionName)
        .updateOne(
          {_id: new ObjectId(project_id)},
          {
            $set: {updated_at: updateData.updated_at,files:updateData.files},
            $inc: statsObj,
          }
        );
      res.json(doc);
    }
  }
);
