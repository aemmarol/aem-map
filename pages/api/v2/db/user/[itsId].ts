import {NextApiRequestExtended} from "../../../../../mongodb/authHandler";
import {userCollectionName} from "../../../../../mongodb/dbCollectionNames";
import getNoAuthHandler from "../../../../../mongodb/noAuthHandler";

export default getNoAuthHandler().get(
  async (req: NextApiRequestExtended, res) => {
    const {itsId} = req.query;

    const doc = await req.db
      .collection(userCollectionName)
      .findOne({itsId: Number(itsId)});
    res.json(doc);
  }
);
