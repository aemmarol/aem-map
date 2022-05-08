import {doc, getDoc, setDoc, updateDoc} from "firebase/firestore";
import {settingsCollectionName} from "../../../firebase/dbCollectionNames";
import {firestore} from "../../../firebase/firebaseConfig";
import {defaultDatabaseFields} from "../../../utils";

// const settingsCollection = collection(
//     firestore,
//     settingsCollectionName
// );

export const createDbSettings = async () => {
  await setDoc(doc(firestore, settingsCollectionName, "adminSettings"), {
    ...defaultDatabaseFields,
    escalation_auto_number: 1,
  });
};

export const getDbSettings = async (): Promise<any> => {
  const docRef = doc(firestore, settingsCollectionName, "adminSettings");
  const docSnap = await getDoc(docRef);
  return {...docSnap.data()};
};

export const incrementEscalationAutoNumber = async (newNum: number) => {
  const dataCollection = doc(
    firestore,
    settingsCollectionName,
    "adminSettings"
  );
  await updateDoc(dataCollection, {
    escalation_auto_number: newNum,
  });
};
