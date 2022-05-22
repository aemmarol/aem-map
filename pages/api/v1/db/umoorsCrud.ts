import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";
import {umoorListCollectionName} from "../../../../firebase/dbCollectionNames";
import {firestore} from "../../../../firebase/firebaseConfig";

const dataCollection = collection(firestore, umoorListCollectionName);

export const getUmoorList = async (): Promise<any[]> => {
  const resultArr: any[] = [];
  const q = query(dataCollection);
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((docs) => {
    const file: any = {
      ...docs.data(),
    };
    resultArr.push(file);
  });

  return resultArr;
};

export const addUmoor = async (id: string, data: any): Promise<boolean> => {
  await setDoc(doc(firestore, umoorListCollectionName, id), data);
  return true;
};

export const deleteUmoor = async (id: string): Promise<boolean> => {
  await deleteDoc(doc(firestore, umoorListCollectionName, id));
  return true;
};
