import getAuthHandler, {
  NextApiRequestExtended,
} from "../../../../../mongodb/authHandler";
import {sectorCollectionName} from "../../../../../mongodb/dbCollectionNames";

export default getAuthHandler().get(
  async (req: NextApiRequestExtended, res) => {
    const doc = await req.db
      .collection(sectorCollectionName)
      .find()
      .sort({name: 1})
      .toArray();
    res.json(doc);
  }
);
