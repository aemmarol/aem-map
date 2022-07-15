import getAuthHandler, {
  NextApiRequestExtended,
} from "../../../../../mongodb/authHandler";
import {userCollectionName} from "../../../../../mongodb/dbCollectionNames";

export default getAuthHandler().get(
  async (req: NextApiRequestExtended, res) => {
    const findQuery = req.query.role
      ? {userRole: {$all: [req.query.role]}}
      : {};
    const doc = await req.db
      .collection(userCollectionName)
      .find(findQuery)
      .toArray();
    res.json(doc);
  }
);
