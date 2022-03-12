import {subSectorData} from "../../../../types";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {firestore} from "../../../../firebase/firebaseConfig";
import {subsectorCollectionName} from "../../../../firebase/dbCollectionNames";
import {defaultDatabaseFields} from "../../../../utils";
import moment from "moment";

const subSectorCollection = collection(firestore, subsectorCollectionName);

export const getSubSectorList = async (): Promise<subSectorData[]> => {
  const resultArr: subSectorData[] = [];
  const q = query(
    subSectorCollection,
    where("version", "==", defaultDatabaseFields.version),
    orderBy("name", "asc")
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((docs) => {
    const subSector: subSectorData = {
      id: docs.id.toString(),
      ...docs.data(),
    } as subSectorData;

    resultArr.push(subSector);
  });

  return resultArr;
};

export const getSubSectorData = async (id: string): Promise<subSectorData> => {
  const docRef = doc(firestore, subsectorCollectionName, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return {...docSnap.data(), id: docSnap.id} as subSectorData;
  }
  return {} as subSectorData;
};

export const addSubSectorData = async (
  data: subSectorData
): Promise<string> => {
  const result = await addDoc(subSectorCollection, data);
  if (result.id) {
    return result.id;
  }
  return "";
};

export const updateSubSectorData = async (
  id: string,
  data: Partial<subSectorData>
): Promise<boolean> => {
  const dataCollection = doc(firestore, subsectorCollectionName, id);
  await updateDoc(dataCollection, {
    ...data,
    updated_at: moment(new Date()).format("DD-MM-YYYY HH:mm:ss"),
  });
  return true;
};
