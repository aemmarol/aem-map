import {defaultFields} from "..";

export interface databaseMumeneenFieldData extends defaultFields {
  name: string;
  label?: string;
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
  bounds?: any[];
  latlng?: number[];
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
  files?: string[];
  latlng?: number[];
  image?: string;
}

export type adminDetails = {
  name: string;
  its_number: string;
  contact_number: string;
  userRole: string;
};

export type comment = {
  msg: string;
  name: string;
  contact_number: string;
  userRole: string;
  time: string;
};

export type fileDetails = {
  tanzeem_file_no: string;
  address: string;
  sub_sector: Partial<subSectorData>;
  hof_name: string;
  hof_contact: string;
  hof_its: string;
};

export interface escalationData extends defaultFields {
  id?: string;
  escalation_id: string;
  created_by: adminDetails;
  file_details: fileDetails;
  status: escalationStatus;
  issue: string;
  comments: comment[];
  type: string;
  issueRaisedFor: number;
}

export enum escalationStatus {
  ISSUE_REPORTED = "Issue Reported",
  IN_PROGRESS = "Resolution In Process",
  RESOLVED = "Resolved",
  CLOSED = "Closed",
}
