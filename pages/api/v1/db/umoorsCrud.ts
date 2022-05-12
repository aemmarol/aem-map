import Airtable from "airtable";

const airtableBase = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
}).base("app7V1cg4ibiooxcn");

const umoorTable = airtableBase("umoorList");
export const getUmoorList = async () => {
  const temp: any = [];
  await umoorTable
    .select({
      view: "Grid view",
    })
    .eachPage(
      function page(records, fetchNextPage) {
        records.forEach(function (record) {
          temp.push(record.fields);
        });
        fetchNextPage();
      },
      function done(err) {
        if (err) {
          console.error(err);
          return;
        }
        return temp;
      }
    );
  return temp;
};
