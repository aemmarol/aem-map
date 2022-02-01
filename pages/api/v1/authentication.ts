// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Joi from "joi";
import "../../../firebase/firebaseConfig";
import {authenticationProps} from "../../../types/authentication";
import Airtable from "airtable";

const airtableBase = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
}).base("app7V1cg4ibiooxcn");

const userTable = airtableBase("userList");
const refreshTokenTable = airtableBase("refreshtokens");

interface Data {
  name?: string;
  data?: object;
  msg: string;
  success: boolean;
}

const loginSchema = Joi.object({
  itsId: Joi.string().required(),
  password: Joi.string().required(),
});

export const login = async (props: authenticationProps): Promise<Data> => {
  const {error} = loginSchema.validate(props);
  const {itsId, password} = props;

  if (error) {
    return {success: false, msg: "invalid credentials!"};
  } else {
    const userData = await userTable
      .select({
        view: "Grid view",
        filterByFormula: `({ITS ID} = '${itsId}')`,
      })
      .firstPage();
    if (!userData.length) {
      return {success: false, msg: "user not found!"};
    } else {
      let data = userData[0].fields;
      if (data["password"] !== password) {
        return {success: false, msg: "invalid credentials"};
      }
      return {success: true, msg: "user logged in successfully!"};
    }
  }
};
