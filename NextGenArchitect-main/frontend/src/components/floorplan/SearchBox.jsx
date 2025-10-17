import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";



export default function SearchBox(props) {
  //this function will run only when the component is loaded

  const Options = props.options;
  const label= props.label
  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={Options}
      sx={{ width: "100%" }}
      onChange={(event, newValue) => {
        if (newValue !== null){
        props.onChange(newValue)}
      }}
      inputValue={props.inputValue}
      onInputChange={(event, newInputValue) => {
        if (newInputValue !== null){
        props.onChange(newInputValue)}
      }}
      renderInput={(params) => (
        <TextField {...params} label={props.label}   />
      )}
    />
  );
}