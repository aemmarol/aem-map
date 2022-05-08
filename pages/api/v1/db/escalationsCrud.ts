import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {escalationCollectionName} from "../../../../firebase/dbCollectionNames";
import {firestore} from "../../../../firebase/firebaseConfig";
import {escalationData} from "../../../../types";
import {defaultDatabaseFields} from "../../../../utils";

const dataCollection = collection(firestore, escalationCollectionName);

export const getEscalationListBySubSector = async (
  sector: string
): Promise<any> => {
  const resultArr: any[] = [];
  const q = query(
    dataCollection,
    where("version", "==", defaultDatabaseFields.version),
    where("file_details.sub_sector.name", "==", sector)
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

export const addEscalationData = async (
  data: escalationData
): Promise<boolean> => {
  try {
    await addDoc(dataCollection, data);
    return true;
  } catch {
    return false;
  }
};

export const deleteFileData = async (id: string): Promise<boolean> => {
  await deleteDoc(doc(firestore, escalationCollectionName, id));
  return true;
};
