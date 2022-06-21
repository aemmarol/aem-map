import {ObjectId, UpdateResult} from "mongodb";
import getAuthHandler, {
  NextApiRequestExtended,
} from "../../../../../mongodb/authHandler";
import {escalationCollectionName} from "../../../../../mongodb/dbCollectionNames";
import {userRoles} from "../../../../../types";

export default getAuthHandler()
  .get(async (req: NextApiRequestExtended, res) => {
    const {userData} = req;
    const {escId} = req.query;
    if (userData.userRole.includes(userRoles.Admin)) {
      const qValue: string = escId as string;
      const doc = await req.db
        .collection(escalationCollectionName)
        .findOne({_id: new ObjectId(qValue)});
      res.json(doc);
    } else {
      res.status(401).json({msg: "user access denied!"});
    }
  })
  .put(async (req: NextApiRequestExtended, res) => {
    const {userData} = req;
    const {escId} = req.query;
    const qValue: string = escId as string;

    const updateData = JSON.parse(req.body);

    const updateEsc = async () => {
      if (!escId) {
        res.status(400).json({msg: "invalid request!"});
      } else {
        const setData = {
          ...updateData,
        };
        delete setData.comments;

        const commentsData = {
          comments: updateData.comments,
        };

        const doc: UpdateResult = await req.db
          .collection(escalationCollectionName)
          .updateOne(
            {_id: new ObjectId(qValue)},
            {$set: setData, $push: commentsData}
          );
        res.json(doc);
      }
    };

    if (userData.userRole.includes(userRoles.Admin)) {
      const checkArr = ["updated_at", "comments", "type", "status"];
      const keys = Object.keys(updateData);
      if (keys.every((val) => checkArr.includes(val))) {
        await updateEsc();
      } else {
        res.status(401).json({msg: "user access denied!"});
      }
    } else if (userData.userRole.includes(userRoles.Umoor)) {
      const checkArr = ["updated_at", "comments", "status"];
      const keys = Object.keys(updateData);
      if (keys.every((val) => checkArr.includes(val))) {
        // await updateEsc()
      } else {
        res.status(401).json({msg: "user access denied!"});
      }
    } else {
      res.status(401).json({msg: "user access denied!"});
    }
  });
