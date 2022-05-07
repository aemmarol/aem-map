import {doc, setDoc} from "firebase/firestore";
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
