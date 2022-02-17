import {NextApiHandler, NextApiRequest, NextApiResponse} from "next";
import formidable from "formidable";
import XLSX from "xlsx";

type Fields = {
  name: string;
  message: string;
  email: string;
};

type FormidablePromise = {
  fields: Fields;
  files?: any;
};

function formidablePromise(req: any, opts: any): Promise<FormidablePromise> {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm(opts);

    form.parse(req, (error: Error, fields: any, files: any) => {
      if (error) {
        return reject(error);
      }
      resolve({fields, files});
    });
  });
}

const handler: NextApiHandler<NextApiResponse> = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  // const form = new formidable.IncomingForm();
  if (req.method === "POST") {
    try {
      const {files} = await formidablePromise(req, {});
      const sampleData = XLSX.readFile(files.file.filepath);
      const data: any = [];

      const sheets = sampleData.SheetNames;

      for (let i = 0; i < sheets.length; i++) {
        const temp = XLSX.utils.sheet_to_json(
          sampleData.Sheets[sampleData.SheetNames[i]]
        );
        temp.forEach((response: any) => {
          data.push(response);
        });
      }
      res.status(200).json({data});
    } catch (error) {
      res.status(500).json({error: error});
    }
  } else {
    res.status(404).json({msg: "api not found"});
  }
};

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
