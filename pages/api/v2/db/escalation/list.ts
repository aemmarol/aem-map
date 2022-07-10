import getAuthHandler, {
  NextApiRequestExtended,
} from "../../../../../mongodb/authHandler";
import {escalationCollectionName} from "../../../../../mongodb/dbCollectionNames";

export default getAuthHandler().post(
  async (req: NextApiRequestExtended, res) => {
    const filterObj = JSON.parse(req.body);
    const doc = await req.db
      .collection(escalationCollectionName)
      .find(filterObj.findFilter)
      .toArray();
    res.json(doc);
  }
);
