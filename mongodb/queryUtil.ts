import {Criteria} from "../pages/api/v1/db/escalationsCrud";

export const createQuery = (criterias: Criteria[]) => {
  const query: any = {};
  criterias.forEach((criteria: Criteria) => {
    if (criteria.operator == "==") {
      query[criteria.field] = criteria.value;
    } else if (criteria.operator == "in") {
      query[criteria.field] = {$in: criteria.value};
    }
  });
  return query;
};
