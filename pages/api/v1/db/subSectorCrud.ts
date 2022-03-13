import {subSectorData} from "../../../../types";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
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

export const getSubSectorDataByName = async (
  name: string
): Promise<subSectorData> => {
  let subsectorInfo: subSectorData = {} as subSectorData;
  const q = query(
    subSectorCollection,
    where("version", "==", defaultDatabaseFields.version),
    where("name", "==", name.toUpperCase()),
    limit(1)
  );
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((docs) => {
    subsectorInfo = {
      ...docs.data(),
      id: docs.id,
    } as subSectorData;
  });
  return subsectorInfo;
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

export const updateSubSectorFilesData = async (
  id: string,
  fileId: string,
  noOfMales: number,
  noOfFemales: number
): Promise<boolean> => {
  const dataCollection = doc(firestore, subsectorCollectionName, id);
  await updateDoc(dataCollection, {
    files: arrayUnion(fileId),
    no_of_females: increment(noOfFemales),
    no_of_males: increment(noOfMales),
    updated_at: moment(new Date()).format("DD-MM-YYYY HH:mm:ss"),
  });
  return true;
};

export const resetSubSectorFilesData = async (id: string): Promise<boolean> => {
  const dataCollection = doc(firestore, subsectorCollectionName, id);
  await updateDoc(dataCollection, {
    files: [],
    no_of_females: 0,
    no_of_males: 0,
    updated_at: moment(new Date()).format("DD-MM-YYYY HH:mm:ss"),
  });
  return true;
};
