// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Joi from "joi";
import {sign, verify} from "jsonwebtoken";
import {authenticationProps, authUser, loginResponseData} from "../../../types";
import {isEmpty} from "lodash";
import {API} from "../../../utils/api";

export interface verifiedToken {
  iat: number;
  data: object;
  exp: number;
}

const loginSchema = Joi.object({
  itsId: Joi.string().required(),
  password: Joi.string().required(),
});

export const login = async (
  props: authenticationProps
): Promise<loginResponseData | Error> => {
  const {error} = loginSchema.validate(props);
  const {itsId, password} = props;

  if (error) {
    throw new Error("invalid credentials!");
  } else {
    const data = await (await fetch(API.user + "/" + itsId)).json();

    if (isEmpty(data)) {
      throw new Error("user not found!");
    } else {
      const {
        name,
        itsId,
        assignedArea,
        userRole,
        assignedUmoor,
        contact,
        email,
      } = data;
      if (data.password !== password) {
        throw new Error("invalid credentials!!");
      }
      const userTokenData = {
        name,
        itsId,
        assignedArea,
        userRole,
        assignedUmoor,
        contact,
        email,
      };
      const accessToken: string = sign(
        {exp: Math.floor(Date.now() / 1000) + 60 * 60 * 6, data: userTokenData},
        process.env.NEXT_PUBLIC_ACCESS_TOKEN_SALT as string
      );
      return {
        success: true,
        data: {
          accessToken,
        },
        msg: "user logged in successfully!",
      };
    }
  }
};

export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("escFilter");
};

export const verifyUser = (): authUser | string => {
  try {
    const accessToken = localStorage.getItem("user");
    const userData = verify(
      accessToken as string,
      process.env.NEXT_PUBLIC_ACCESS_TOKEN_SALT as string
    ) as verifiedToken;
    return userData.data as authUser;
  } catch (error) {
    return "User not verified!";
  }
};
