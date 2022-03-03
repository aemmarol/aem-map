import {defaultFields} from "..";

export interface databaseMumeneenFieldData extends defaultFields {
  name: string;
  id?: string;
}

export interface sectorFieldData extends defaultFields {
  name: string;
  id: string;
  sub_sector_id: string;
  color_code: string;
  masool_name: string;
  masool_its: string;
  masool_contact_number: string;
  masoola_name: string;
  masoola_its: string;
  masoola_contact_number: string;
}
