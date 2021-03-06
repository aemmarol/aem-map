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
  _id?: string;
  itsId: string;
  name: string;
  contact: string;
  email?: string;
  password?: string;
  userRole: Array<userRoles>;
  assignedArea: Array<string>;
  assignedUmoor: Array<string>;
}

export enum userRoles {
  Masool = "Masool",
  Masoola = "Masoola",
  Musaid = "Musaid",
  Musaida = "Musaida",
  Umoor = "Umoor",
  Admin = "Admin",
}
