import React, {FC} from "react";
import {Checkbox} from "antd";
import { EscalationFilterType } from "../../../types/escalation";
import { useEscalationContext } from "../../../context/EscalationContext";


export const EscalationFilter: FC<EscalationFilterType> = ({
  title,
  options,
  disabled,
  filterKey,
}) => {
  const {selectedfilterItems, setSelectedFilterItems} = useEscalationContext()
  const handleChange = (value: any) => {
    const tempProps={...selectedfilterItems};
    tempProps[filterKey]=value;
    setSelectedFilterItems(tempProps)
  };

  return (
    <div>
      <h4>{title}:</h4>
      <Checkbox.Group
        options={options}
        value={selectedfilterItems[filterKey]}
        onChange={handleChange}
        disabled={disabled}
        style={{display: "flex", flexDirection: "column", marginLeft: "1em"}}
      />
    </div>
  );
};
