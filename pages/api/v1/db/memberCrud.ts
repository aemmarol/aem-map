import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {memberCollectionName} from "../../../../firebase/dbCollectionNames";
import {firestore} from "../../../../firebase/firebaseConfig";
import {defaultDatabaseFields} from "../../../../utils";

const dataCollection = collection(firestore, memberCollectionName);

export const getMemberDataById = async (itsId: string): Promise<any> => {
  const docRef = doc(firestore, memberCollectionName, itsId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return {...docSnap.data(), id: docSnap.id};
  }
  return {};
};

export const getMemberListByHofId = async (hofId: string): Promise<any[]> => {
  const resultArr: any[] = [];
  const q = query(
    dataCollection,
    where("version", "==", defaultDatabaseFields.version),
    where("hof_id", "==", hofId)
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
