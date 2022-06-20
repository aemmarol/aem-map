import { UpdateResult } from "mongodb";
import { settingsCollectionName } from "../../../../../firebase/dbCollectionNames";
import getAuthHandler, {
    NextApiRequestExtended,
} from "../../../../../mongodb/authHandler";

export default getAuthHandler()
    .get(async (req: NextApiRequestExtended, res) => {
        const doc = await req.db
            .collection(settingsCollectionName)
            .findOne({ "_id": "adminSettings" });
        res.json(doc);
    })
    .put(async (req: NextApiRequestExtended, res) => {
        const doc: UpdateResult = await req.db
            .collection(settingsCollectionName)
            .updateOne({ _id: "adminSettings" }, { $inc: { "escalation_auto_number": 1 } });
        res.json(doc);

    });
