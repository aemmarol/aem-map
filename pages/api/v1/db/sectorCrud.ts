import {sectorData} from "../../../../types";
import {
  addDoc,
  collection,
  doc,
  getDocs,
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

export const getSectorData = async (): Promise<sectorData[]> => {
  const resultArr: sectorData[] = [];
  const q = query(
    sectorCollection,
    where("version", "==", defaultDatabaseFields.version),
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
    } = docs.data();

    resultArr.push({
      name,
      sub_sector_id,
      version,
      created_at,
      updated_at,
      id: docs.id,
      primary_color,
      secondary_color,
      masool_name,
      masool_its,
      masool_contact,
      masoola_name,
      masoola_its,
      masoola_contact,
    });
  });

  return resultArr.sort((a,b)=>{
    if(a.name>b.name)return 1;
    if(a.name<b.name)return -1;
    return 0
  });
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
  await updateDoc(dataCollection, {...data,updated_at:moment(new Date()).format("DD-MM-YYYY HH:mm:ss")});
  return true;
};
