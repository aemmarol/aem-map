import { DeleteResult, InsertManyResult } from "mongodb";
import getAuthHandler, {
  NextApiRequestExtended,
} from "../../../../../mongodb/authHandler";
import { memberCollectionName } from "../../../../../mongodb/dbCollectionNames";
import { userRoles } from "../../../../../types";

export default getAuthHandler()
  .get(async (req: NextApiRequestExtended, res) => {
    const hofId: string = req.query.hofId as string;
    const doc = await req.db
      .collection(memberCollectionName)
      .find({ hof_id: Number(hofId) })
      .toArray();
    res.json(doc);
  })
  .post(async (req: NextApiRequestExtended, res) => {
    const { userData } = req;
    if (userData.userRole.includes(userRoles.Admin)) {
      const doc: InsertManyResult = await req.db
        .collection(memberCollectionName)
        .insertMany(JSON.parse(req.body));
      res.json(doc);
    } else {
      res.status(401).json({ msg: "user access denied!" });
    }
  })
  .delete(async (req: NextApiRequestExtended, res) => {
    const { userData } = req;
    if (userData.userRole.includes(userRoles.Admin)) {
      const doc: DeleteResult = await req.db
        .collection(memberCollectionName)
        .deleteMany({});
      res.json(doc);
    } else {
      res.status(401).json({ msg: "user access denied!" });
    }
  });


export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb"
    }
  }
};