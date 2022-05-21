// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Joi from "joi";
import {sign, verify} from "jsonwebtoken";
import "../../../firebase/firebaseConfig";
import {authenticationProps, authUser, loginResponseData} from "../../../types";
import {firestore} from "../../../firebase/firebaseConfig";
import {userCollectionName} from "../../../firebase/dbCollectionNames";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import {defaultDatabaseFields} from "../../../utils";
import {isEmpty} from "lodash";

const dataCollection = collection(firestore, userCollectionName);

interface verifiedToken {
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
    const data = await getUser(itsId.toString());

    if (isEmpty(data)) {
      throw new Error("user not found!");
    } else {
      const {name, itsId, assignedArea, userRole, assignedUmoor, contact} =
        data;
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
      };
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

export const getUserList = async (): Promise<authUser[]> => {
  const resultArr: authUser[] = [];
  const q = query(
    dataCollection,
    where("version", "==", defaultDatabaseFields.version)
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((docs) => {
    const file: any = {
      ...docs.data(),
    };
    resultArr.push(file);
  });

  return resultArr;
};

export const getUser = async (id: string): Promise<authUser> => {
  const docRef = doc(firestore, userCollectionName, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return {...docSnap.data()} as authUser;
  }
  return {} as authUser;
};

export const addUser = async (id: string, data: authUser): Promise<boolean> => {
  await setDoc(doc(firestore, userCollectionName, id), data);
  return true;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  await deleteDoc(doc(firestore, userCollectionName, id));
  return true;
};
