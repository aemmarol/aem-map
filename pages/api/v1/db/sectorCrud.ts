import {
  arrayRemove,
  arrayUnion,
  doc,
  updateDoc,
} from "firebase/firestore";
import {firestore} from "../../../../firebase/firebaseConfig";
import {sectorCollectionName} from "../../../../firebase/dbCollectionNames";
import moment from "moment";

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

