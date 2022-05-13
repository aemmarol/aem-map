import {userRoles} from "../../types";

export const getFileTableUserColumns = (userRole: userRoles) => {
  switch (userRole) {
    case userRoles.Masool:
    case userRoles.Masoola:
    case userRoles.Musaid:
    case userRoles.Musaida:
    case userRoles.Umoor:
      return ["id", "tanzeem_file_no", "hof_name", "address"];

    case userRoles.Admin:
      return [];
  }
};

export const getMumineenTableUserColumns = (userRole: userRoles) => {
  switch (userRole) {
    case userRoles.Masool:
    case userRoles.Masoola:
    case userRoles.Musaid:
    case userRoles.Musaida:
    case userRoles.Umoor:
      return ["id", "age", "gender", "mobile", "fullname"];

    case userRoles.Admin:
      return [];
  }
};
