import {databaseMumeneenFieldData} from "../../../../interfaces";
import {addDoc, collection, deleteDoc, doc, getDocs} from "firebase/firestore";
import {firestore} from "../../../../firebase/firebaseConfig";
import {
  fileDetailsFieldCollectionName,
  mumeneenDetailsFieldCollectionName,
} from "../../../../firebase/dbCollectionNames";

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
  const querySnapshot = await getDocs(mumeneenDetailsFieldCollection);
  querySnapshot.forEach((docs) => {
    const {name, version, created_at} = docs.data();

    resultArr.push({
      name,
      version,
      created_at,
      id: docs.id,
    });
  });

  return resultArr.filter(
    (data) => data.version === process.env.NEXT_PUBLIC_DATABASE_VERSION
  );
};

export const getFileDataFields = async (): Promise<
  databaseMumeneenFieldData[]
> => {
  const resultArr: databaseMumeneenFieldData[] = [];
  const querySnapshot = await getDocs(fileDetailsFieldCollection);
  querySnapshot.forEach((docs) => {
    const {name, version, created_at} = docs.data();
    resultArr.push({
      name,
      version,
      created_at,
      id: docs.id,
    });
  });

  return resultArr.filter(
    (data) => data.version === process.env.NEXT_PUBLIC_DATABASE_VERSION
  );
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
