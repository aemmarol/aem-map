import {userCollectionName} from "../../../../../firebase/dbCollectionNames";
import {NextApiRequestExtended} from "../../../../../mongodb/authHandler";
import getNoAuthHandler from "../../../../../mongodb/noAuthHandler";

export default getNoAuthHandler().get(
  async (req: NextApiRequestExtended, res) => {
    const {itsId} = req.query;
    console.log("hitting", itsId);

    const doc = await req.db
      .collection(userCollectionName)
      .findOne({itsId: Number(itsId)});
    res.json(doc);
  }
);
