import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  WhereFilterOp,
} from "firebase/firestore";
import {escalationCollectionName} from "../../../../firebase/dbCollectionNames";
import {firestore} from "../../../../firebase/firebaseConfig";
import {escalationData, escalationStatus} from "../../../../types";
import {defaultDatabaseFields} from "../../../../utils";
import moment from "moment";
import {getUmoorListWithCoordinators} from "./umoorsCrud";
import {getSectorList} from "./sectorCrud";
import {getSubSectorList} from "./subSectorCrud";

const dataCollection = collection(firestore, escalationCollectionName);

export enum escalationDBFields {
  subsectorName = "file_details.sub_sector.name",
  sectorName = "file_details.sub_sector.sector.name",
  umoorName = "type.value",
}

export interface Criteria {
  field: string;
  value: any;
  operator: WhereFilterOp;
}

let escalationList: escalationData[] | null;

export const getEscalationList = async () => {
  if (escalationList) {
    console.log("USING CACHE FOR ESCALATION LIST");
    return escalationList;
  }
  const resultArr: any[] = [];
  const q = query(
    dataCollection,
    where("version", "==", defaultDatabaseFields.version)
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((docs) => {
    const file: any = {
      id: docs.id.toString(),
      ...docs.data(),
    };
    resultArr.push(file);
  });
  escalationList = resultArr;
  return escalationList;
};

export const getEscalationListBySubSector = async (
  sector: string
): Promise<any> => {
  const resultArr: any[] = [];
  const q = query(
    dataCollection,
    where("version", "==", defaultDatabaseFields.version),
    where("file_details.sub_sector.name", "==", sector)
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((docs) => {
    const file: any = {
      id: docs.id.toString(),
      ...docs.data(),
    };
    resultArr.push(file);
  });

  return resultArr;
};

export const groupEscalationListBy = (
  escalations: escalationData[],
  groupByField: string,
  counterField = "status"
) => {
  const groups: any = {};
  escalations.forEach((escalation: any) => {
    const groupName = getFieldValue(escalation, groupByField);
    if (!groups.hasOwnProperty(groupName)) {
      groups[groupName] = {
        groupName,
        data: [],
        stats: {
          total: 0,
        },
      };
      for (const escStatus of Object.values(escalationStatus)) {
        groups[groupName]["stats"][escStatus] = 0;
      }
    }
    const counterName = getFieldValue(escalation, counterField);
    // if (!groups[groupName]["stats"].hasOwnProperty(counterName)) {
    //   groups[groupName]["stats"][counterName] = 0;
    // }
    groups[groupName].data.push(escalation);
    groups[groupName]["stats"][counterName]++;
    groups[groupName]["stats"].total++;
  });

  // return Object.keys(groups)
  //   .sort()
  //   .map((groupName) => groups[groupName]);
  return groups;
};

export const getEscalationData = async (
  id: string
): Promise<escalationData> => {
  const docRef = doc(firestore, escalationCollectionName, id);
  const docSnap = await getDoc(docRef);
  escalationList = null;
  if (docSnap.exists()) {
    return {...docSnap.data(), id: docSnap.id} as escalationData;
  }
  return {} as escalationData;
};

const getFieldValue = (obj: any, field: string) => {
  const fieldpath = field.split(".");
  for (const key of fieldpath) {
    obj = obj[key];
  }
  return obj;
};

// export const getEscalationListByCriteria = async (
//   criteria: Criteria[]
// ): Promise<any> => {
//   const resultArr: any[] = [];
//   const q = query(
//     dataCollection,
//     where("version", "==", defaultDatabaseFields.version),
//     ...criteria.map((c: Criteria) => {
//       return where(c.field, c.operator, c.value);
//     })
//     // where("file_details.sub_sector.name", "==", sector)
//   );
//   const querySnapshot = await getDocs(q);
//   querySnapshot.forEach((docs) => {
//     const file: any = {
//       id: docs.id.toString(),
//       ...docs.data(),
//     };
//     resultArr.push(file);
//   });

//   return resultArr;
// };

export const getEscalationListByCriteriaClientSide = async (
  criterias: Criteria[]
): Promise<any> => {
  let filteredArr = await getEscalationList();
  criterias.forEach((criteria) => {
    if (criteria.operator == "==") {
      filteredArr = filteredArr.filter(
        (val) => getFieldValue(val, criteria.field) == criteria.value
      );
    } else if (criteria.operator == "in") {
      filteredArr = filteredArr.filter((val) =>
        criteria.value.includes(getFieldValue(val, criteria.field))
      );
    }
  });
  return filteredArr;
};

export const addExtraDetails = async (escalations: escalationData[]) => {
  const sectorList = await getSectorList();
  const subSectorList = await getSubSectorList();
  const umoorList = await getUmoorListWithCoordinators();
  escalations.forEach((escalation) => {
    if (
      escalation.file_details.sub_sector &&
      escalation.file_details.sub_sector.name
    ) {
      escalation.file_details.sub_sector =
        subSectorList.find(
          (subsector) =>
            subsector.name == escalation.file_details.sub_sector.name
        ) || escalation.file_details.sub_sector;
    }
    if (
      escalation.file_details.sub_sector.sector &&
      escalation.file_details.sub_sector.sector.name
    ) {
      escalation.file_details.sub_sector.sector =
        sectorList.find(
          (sector) =>
            sector.name == escalation.file_details.sub_sector.sector?.name
        ) || escalation.file_details.sub_sector.sector;
    }
    if (escalation.type) {
      escalation.type = umoorList.find(
        (umoor) => umoor.value == escalation.type?.value
      );
    }
  });

  return escalations;
};

export const addEscalationData = async (
  data: escalationData
): Promise<boolean> => {
  try {
    await addDoc(dataCollection, data);
    escalationList = null;
    return true;
  } catch {
    return false;
  }
};

export const updateEscalationData = async (
  id: string,
  data: Partial<escalationData>
): Promise<boolean> => {
  const dataCollection = doc(firestore, escalationCollectionName, id);
  await updateDoc(dataCollection, {
    ...data,
    updated_at: moment(new Date()).format("DD-MM-YYYY HH:mm:ss"),
  });
  escalationList = null;
  return true;
};

export const deleteFileData = async (id: string): Promise<boolean> => {
  await deleteDoc(doc(firestore, escalationCollectionName, id));
  return true;
};
