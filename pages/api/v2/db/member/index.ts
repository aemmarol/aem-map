import getAuthHandler, {
  NextApiRequestExtended,
} from "../../../../../mongodb/authHandler";
import { memberCollectionName } from "../../../../../mongodb/dbCollectionNames";

export default getAuthHandler().get(
  async (req: NextApiRequestExtended, res) => {
    const { itsId } = req.query;
    if (!itsId) {
      res.status(400).json({ msg: "invalid request!" });
    } else {
      const qValue: string = itsId as string;
      const doc = await req.db
        .collection(memberCollectionName)
        .findOne({ _id: qValue });
      res.json(doc);
    }

  }
);
