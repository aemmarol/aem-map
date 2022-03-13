import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import {memberCollectionName} from "../../../../firebase/dbCollectionNames";
import {firestore} from "../../../../firebase/firebaseConfig";
import {defaultDatabaseFields} from "../../../../utils";

const dataCollection = collection(firestore, memberCollectionName);

export const getMemberDataList = async (): Promise<any[]> => {
  const resultArr: any[] = [];
  const q = query(
    dataCollection,
    where("version", "==", defaultDatabaseFields.version)
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((docs) => {
    const file: any = {
      id: docs.id.toString(),
      ...docs.data(),
    };
    resultArr.push(file);
  });

  return resultArr;
};

export const addMemberData = async (
  id: string,
  data: any
): Promise<boolean> => {
  await setDoc(doc(firestore, memberCollectionName, id), data);
  return true;
};

export const deleteMemberData = async (id: string): Promise<boolean> => {
  await deleteDoc(doc(firestore, memberCollectionName, id));
  return true;
};
