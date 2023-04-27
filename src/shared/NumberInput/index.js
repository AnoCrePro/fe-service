import React, {useState} from "react";
import { TextField, InputAdornment, Typography, MenuItem } from "@mui/material";

export default function NumberInput({ value, setValue, unitText, disabled }) {
  // const [inputValue, setInputValue] = useState(value)
  const handleInputChange = (ev) => {
    const regex = /^(?!-0(\.0+)?$)-?(0|[1-9]\d*)(\.\d+)?$/;
    let val = ev.target.value;
    if (regex.test(val) || regex.test(`${val}0`)) {
      // accept value in format: xxx | xxx. | xxx.xx (ex: 333 | 1232. | 12.213)
      setValue(val);
    }
  };

  return (
    <TextField
      sx={{
        width: "90%",
        margin: "0 auto",
        // boxShadow: "inset 0px 1px 2px 0px rgba(0, 0, 0, 0.3);",
        // borderRadius: "15px",
        padding: "0 5%"
      }}
      type="text"
      value={value}
      onChange={handleInputChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <Typography variant="subtitle2">{unitText}</Typography>
          </InputAdornment>
        ),
      }}
      disabled={disabled}
    />
  );
}
