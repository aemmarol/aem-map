import {databaseMumeneenFieldData} from "../../../../types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import {firestore} from "../../../../firebase/firebaseConfig";
import {
  fileDetailsFieldCollectionName,
  mumeneenDetailsFieldCollectionName,
} from "../../../../firebase/dbCollectionNames";
import {defaultDatabaseFields} from "../../../../utils";

const mumeneenDetailsFieldCollection = collection(
  firestore,
  mumeneenDetailsFieldCollectionName
);

const fileDetailsFieldCollection = collection(
  firestore,
  fileDetailsFieldCollectionName
);

export const getMumeneenDataFields = async (): Promise<
  databaseMumeneenFieldData[]
> => {
  const resultArr: databaseMumeneenFieldData[] = [];
  const q = query(
    mumeneenDetailsFieldCollection,
    where("version", "==", defaultDatabaseFields.version),
    orderBy("name", "asc")
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((docs) => {
    const {name, version, created_at, updated_at} = docs.data();

    resultArr.push({
      name,
      version,
      created_at,
      updated_at,
      id: docs.id,
    });
  });

  return resultArr;
};

export const getFileDataFields = async (): Promise<
  databaseMumeneenFieldData[]
> => {
  const resultArr: databaseMumeneenFieldData[] = [];
  const q = query(
    fileDetailsFieldCollection,
    where("version", "==", defaultDatabaseFields.version),
    orderBy("name", "asc")
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((docs) => {
    const {name, version, created_at, updated_at} = docs.data();
    resultArr.push({
      name,
      version,
      created_at,
      id: docs.id,
      updated_at,
    });
  });

  return resultArr;
};

export const addDataField = async (
  collectionName: string,
  data: databaseMumeneenFieldData
): Promise<boolean> => {
  const dataCollection = collection(firestore, collectionName);
  const result = await addDoc(dataCollection, data);
  if (result.id) return true;
  return false;
};

export const deleteDataField = async (
  collectionName: string,
  id: databaseMumeneenFieldData
) => {
  const document = doc(firestore, `${collectionName}/${id}`);
  await deleteDoc(document);
};
