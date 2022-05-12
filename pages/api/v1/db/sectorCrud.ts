import {sectorData} from "../../../../types";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {firestore} from "../../../../firebase/firebaseConfig";
import {sectorCollectionName} from "../../../../firebase/dbCollectionNames";
import {defaultDatabaseFields} from "../../../../utils";
import moment from "moment";

const sectorCollection = collection(firestore, sectorCollectionName);
let sectorList: sectorData[];

export const getSectorList = async (): Promise<sectorData[]> => {
  if (sectorList) {
    console.log("USING SECTOR LIST FROM CACHE");
    return sectorList;
  }
  const resultArr: sectorData[] = [];
  const q = query(
    sectorCollection,
    where("version", "==", defaultDatabaseFields.version),
    orderBy("name", "asc")
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((docs) => {
    const {
      name,
      version,
      created_at,
      updated_at,
      sub_sector_id,
      primary_color,
      secondary_color,
      masool_contact,
      masool_its,
      masool_name,
      masoola_contact,
      masoola_its,
      masoola_name,
      bounds,
    } = docs.data();

    resultArr.push({
      id: docs.id,
      name,
      sub_sector_id,
      version,
      created_at,
      updated_at,
      primary_color,
      secondary_color,
      masool_name,
      masool_its,
      masool_contact,
      masoola_name,
      masoola_its,
      masoola_contact,
      bounds,
    });
  });
  sectorList = resultArr;
  return sectorList;
};

export const getSectorData = async (id: string): Promise<sectorData> => {
  const docRef = doc(firestore, sectorCollectionName, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return {...docSnap.data(), id: docSnap.id} as sectorData;
  }
  return {} as sectorData;
};

export const getSectorDataByName = async (
  name: string
): Promise<sectorData> => {
  let sectorInfo: sectorData = {} as sectorData;
  const q = query(
    sectorCollection,
    where("version", "==", defaultDatabaseFields.version),
    where("name", "==", name),
    limit(1)
  );
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((docs) => {
    sectorInfo = {
      ...docs.data(),
      id: docs.id,
    } as sectorData;
  });
  return sectorInfo;
};

export const addSectorData = async (data: sectorData): Promise<boolean> => {
  const dataCollection = collection(firestore, sectorCollectionName);
  const result = await addDoc(dataCollection, data);
  if (result.id) return true;
  return false;
};

export const updateSectorData = async (
  id: string,
  data: Partial<sectorData>
): Promise<boolean> => {
  const dataCollection = doc(firestore, sectorCollectionName, id);
  await updateDoc(dataCollection, {
    ...data,
    updated_at: moment(new Date()).format("DD-MM-YYYY HH:mm:ss"),
  });
  return true;
};

export const addSubSectorIds = async (
  id: string,
  subSectorId: string
): Promise<boolean> => {
  const dataCollection = doc(firestore, sectorCollectionName, id);
  await updateDoc(dataCollection, {
    sub_sector_id: arrayUnion(subSectorId),
    updated_at: moment(new Date()).format("DD-MM-YYYY HH:mm:ss"),
  });
  return true;
};

export const removeSubSectorIds = async (
  id: string,
  subSectorId: string
): Promise<boolean> => {
  const dataCollection = doc(firestore, sectorCollectionName, id);
  await updateDoc(dataCollection, {
    sub_sector_id: arrayRemove(subSectorId),
    updated_at: moment(new Date()).format("DD-MM-YYYY HH:mm:ss"),
  });
  return true;
};

export const deleteSectorData = async (id: string): Promise<boolean> => {
  await deleteDoc(doc(firestore, sectorCollectionName, id));
  return true;
};
