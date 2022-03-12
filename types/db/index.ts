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

export interface sectorDetailsForSubSector {
  name: string;
  id?: string;
  primary_color: string;
  secondary_color: string;
}

export interface subSectorData extends defaultFields {
  name: string;
  id?: string;
  sector: Partial<sectorDetailsForSubSector>;
  musaid_name: string;
  musaid_its: string;
  musaid_contact: string;
  musaida_name: string;
  musaida_its: string;
  musaida_contact: string;
  no_of_males?: number;
  no_of_females?: number;
  no_of_files?: number;
}
