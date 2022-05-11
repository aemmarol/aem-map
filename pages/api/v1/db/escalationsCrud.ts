import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  WhereFilterOp,
} from "firebase/firestore";
import {escalationCollectionName} from "../../../../firebase/dbCollectionNames";
import {firestore} from "../../../../firebase/firebaseConfig";
import {escalationData} from "../../../../types";
import {defaultDatabaseFields} from "../../../../utils";

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
          "Issue Reported": 0,
          "Resolution In Process": 0,
          Resolved: 0,
        },
      };
    }
    const counterName = getFieldValue(escalation, counterField);
    // if (!groups[groupName]["stats"].hasOwnProperty(counterName)) {
    //   groups[groupName]["stats"][counterName] = 0;
    // }
    groups[groupName].data.push(escalation);
    groups[groupName]["stats"][counterName]++;
    groups[groupName]["stats"].total++;
  });
  return Object.keys(groups)
    .sort()
    .map((groupName) => groups[groupName]);
};

const getFieldValue = (obj: any, field: string) => {
  const fieldpath = field.split(".");
  for (const key of fieldpath) {
    obj = obj[key];
  }
  return obj;
};

export const getEscalationListByCriteria = async (
  criteria: Criteria[]
): Promise<any> => {
  const resultArr: any[] = [];
  const q = query(
    dataCollection,
    where("version", "==", defaultDatabaseFields.version),
    ...criteria.map((c: Criteria) => {
      return where(c.field, c.operator, c.value);
    })
    // where("file_details.sub_sector.name", "==", sector)
  );
  // console.log(q);
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

export const addEscalationData = async (
  data: escalationData
): Promise<boolean> => {
  try {
    await addDoc(dataCollection, data);
    return true;
  } catch {
    return false;
  }
};

export const deleteFileData = async (id: string): Promise<boolean> => {
  await deleteDoc(doc(firestore, escalationCollectionName, id));
  return true;
};
