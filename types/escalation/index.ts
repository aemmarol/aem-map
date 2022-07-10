export interface EscStatType {
  label: string;
  value: string;
  type?: string;
  tagColor?: string;
}

export interface selectedFilterItemsType {
  [filterTypes.Sector]?: string[];
  [filterTypes.Umoor]?: string[];
  [filterTypes.SubSector]?: string[];
}

export interface EscalationFilterType {
  title?: string;
  filterKey: filterTypes.Sector | filterTypes.Umoor;
  options?: filterOption[];
  disabled: boolean;
}

export interface filterOption {
  label: string;
  value: string;
}

export enum filterTypes {
  Umoor = "umoor",
  Sector = "sector",
  SubSector = "subsector",
}
