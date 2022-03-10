import {defaultFields} from "..";

export interface databaseMumeneenFieldData extends defaultFields {
  name: string;
  id?: string;
}

export interface sectorData extends defaultFields {
  name: string;
  id?: string;
  sub_sector_id?: string[];
  primary_color: string;
  secondary_color: string;
  masool_name: string;
  masool_its: string;
  masool_contact: string;
  masoola_name: string;
  masoola_its: string;
  masoola_contact: string;
}
