import React, {FC, useEffect, useState} from "react";
import {filterOption} from "../../../types/escalation";
import {Checkbox} from "antd";
export interface EscalationFilterType {
  title: string;
  options: filterOption[];
  selectedOptions: filterOption[];
  disabled?: boolean;
  onChange: any;
}

export const EscalationFilter: FC<EscalationFilterType> = ({
  title,
  options,
  selectedOptions,
  disabled = false,
  onChange,
}) => {
  const [selectedValue, setSelectedValue] = useState(selectedOptions);
  useEffect(() => {
    setSelectedValue(selectedOptions);
  }, [selectedOptions]);
  return (
    <div>
      <h4>{title}:</h4>
      <Checkbox.Group
        options={options}
        defaultValue={selectedValue.map((option) => option.value)}
        onChange={onChange}
        disabled={disabled}
        style={{display: "flex", flexDirection: "column", marginLeft: "1em"}}
      />
    </div>
  );
};
