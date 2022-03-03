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
