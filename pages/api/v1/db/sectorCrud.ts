import {databaseMumeneenFieldData, sectorData} from "../../../../types";
import {addDoc, collection, getDocs, query, where} from "firebase/firestore";
import {firestore} from "../../../../firebase/firebaseConfig";
import {sectorCollectionName} from "../../../../firebase/dbCollectionNames";
import {defaultDatabaseFields} from "../../../../utils";

const mumeneenDetailsFieldCollection = collection(
  firestore,
  sectorCollectionName
);

export const getSectorData = async (): Promise<sectorData[]> => {
  const resultArr: sectorData[] = [];
  const q = query(
    mumeneenDetailsFieldCollection,
    where("version", "==", defaultDatabaseFields.version)
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
      masool_contact_number,
      masool_its,
      masool_name,
      masoola_contact_number,
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
      masool_contact_number,
      masoola_name,
      masoola_its,
      masoola_contact_number,
    });
  });

  return resultArr;
};

export const addSectorData = async (
  collectionName: string,
  data: sectorData
): Promise<boolean> => {
  const dataCollection = collection(firestore, collectionName);
  const result = await addDoc(dataCollection, data);
  if (result.id) return true;
  return false;
};
