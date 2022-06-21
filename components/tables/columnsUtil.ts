import {userRoles} from "../../types";

export const getFileTableUserColumns = (userRole: userRoles) => {
  switch (userRole) {
    case userRoles.Masool:
    case userRoles.Masoola:
    case userRoles.Musaid:
    case userRoles.Musaida:
    case userRoles.Umoor:
      return ["tanzeem_file_no", "_id", "hof_name", "address"];

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
      return ["_id", "full_name", "age", "gender", "mobile"];

    case userRoles.Admin:
      return [];
  }
};
