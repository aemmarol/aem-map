import getAuthHandler, {
  NextApiRequestExtended,
} from "../../../../../mongodb/authHandler";
import { userCollectionName } from "../../../../../mongodb/dbCollectionNames";

export default getAuthHandler().get(
  async (req: NextApiRequestExtended, res) => {
    const doc = await req.db.collection(userCollectionName).find().toArray();
    res.json(doc);
  }
);
