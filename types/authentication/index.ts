export interface authenticationProps {
  itsId: string;
  password: string;
}

export interface loginResponseData {
  name?: string;
  data?: object;
  msg: string;
  success: boolean;
}

export interface authUser {
  itsId: string;
  name: string;
  contact: string;
  userRole: Array<string>;
  assignedArea: Array<string>;
  assignedUmoor: Array<string>;
}
