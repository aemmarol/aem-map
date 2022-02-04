// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Joi from "joi";
import Airtable from "airtable";
import {sign, verify} from "jsonwebtoken";
import "../../../firebase/firebaseConfig";

const airtableBase = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
}).base("app7V1cg4ibiooxcn");

const userTable = airtableBase("userList");

export type authenticationProps = {
  itsId: string;
  password: string;
};

interface authUser {
  itsId: string;
  name: string;
  userRole: Array<string>;
  assignedArea: Array<string>;
}

interface verifiedToken {
  iat: number;
  data: object;
  exp: number;
}

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
    const data = await userTable
      .select({
        view: "Grid view",
        filterByFormula: `({itsId} = '${itsId}')`,
      })
      .firstPage();

    if (!data.length) {
      return {success: false, msg: "user not found!"};
    } else {
      const userData = {...data[0].fields};
      const {name, itsId, assignedArea, userRole} = userData;
      if (userData.password !== password) {
        return {success: false, msg: "invalid credentials"};
      }
      const userTokenData = {name, itsId, assignedArea, userRole};
      const accessToken: string = sign(
        {exp: Math.floor(Date.now() / 1000) + 60 * 60 * 6, data: userTokenData},
        process.env.NEXT_PUBLIC_ACCESS_TOKEN_SALT as string
      );
      localStorage.setItem("user", accessToken);
      return {success: true, msg: "user logged in successfully!"};
    }
  }
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const verifyUser = (): authUser | Data => {
  try {
    const accessToken = localStorage.getItem("user");
    const userData = verify(
      accessToken as string,
      process.env.NEXT_PUBLIC_ACCESS_TOKEN_SALT as string
    ) as verifiedToken;
    return userData.data as authUser;
  } catch (error) {
    return {success: false, msg: "User not verified!!"};
  }
};
