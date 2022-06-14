import nextConnect from "next-connect";
import { escalationCollectionName } from "../../../../../firebase/dbCollectionNames";
import getAuthHandler, { NextApiRequestExtended } from "../../../../../mongodb/authHandler";
import middleware from "../../../../../mongodb/database";
import { userRoles } from "../../../../../types";

const handler = nextConnect();

handler.use(middleware);

export default getAuthHandler().get(async (req: NextApiRequestExtended, res) => {
  const { userData } = req;
  if (userData.userRole.includes(userRoles.Admin)) {
    const doc = await req.db
      .collection(escalationCollectionName)
      .find()
      .toArray();
    res.json(doc);
  } else {
    res.status(401).json({ msg: "user access denied!" });
  }
})


// handler.get(async (req: any, res: any) => {
  // const doc = await req.db
  //   .collection(escalationCollectionName)
  //   .find()
  //   .toArray();
  // res.json(doc);
// });

// handler.post(async (req: any, res: any) => {
//   const doc = await req.db
//     .collection(escalationCollectionName)
//     .find(req.body.query)
//     .toArray();
//   res.json(doc);
// });

// export default handler;
