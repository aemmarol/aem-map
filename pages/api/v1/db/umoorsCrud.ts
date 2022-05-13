import Airtable, {FieldSet, Records} from "airtable";

const airtableBase = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
}).base("app7V1cg4ibiooxcn");

const umoorTable = airtableBase("umoorList");

let umoorList: any = null;
export const getUmoorList = async () => {
  if (umoorList) {
    console.log("USING UMOOR LIST FROM CACHE");
    return umoorList;
  }
  const temp = await umoorTable._selectRecords();
  const records: Records<FieldSet> = await temp.all();

  umoorList = records.map((record) => record.fields);
  return umoorList;
};
