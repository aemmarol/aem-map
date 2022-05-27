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
import {umoorData} from "../../../../types";
import {userListFromDB} from "./usersCrud";

const dataCollection = collection(firestore, umoorListCollectionName);

let umoorList: umoorData[];

export const getUmoorList = async (): Promise<umoorData[]> => {
  if (umoorList) {
    return umoorList;
  }
  const resultArr: umoorData[] = [];
  const q = query(dataCollection);
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((docs) => {
    const file: any = {
      ...docs.data(),
    };
    resultArr.push(file);
  });
  umoorList = resultArr;
  return umoorList;
};

export const getUmoorListWithCoordinators = async (): Promise<umoorData[]> => {
  const umoorList = await getUmoorList();
  const usersList = await userListFromDB();

  umoorList.forEach((umoor) => {
    umoor.coordinators = [];
    usersList.forEach((user) => {
      // console.log(user.assignedUmoor, umoor.value);
      if (user.assignedUmoor && user.assignedUmoor.includes(umoor.value)) {
        umoor.coordinators.push(user);
      }
    });
    // console.log(umoor, umoor.label);
  });
  return umoorList;
};

export const addUmoor = async (id: string, data: any): Promise<boolean> => {
  await setDoc(doc(firestore, umoorListCollectionName, id), data);
  return true;
};

export const deleteUmoor = async (id: string): Promise<boolean> => {
  await deleteDoc(doc(firestore, umoorListCollectionName, id));
  return true;
};
