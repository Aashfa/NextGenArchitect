import { TextField } from "@mui/material";
import React from "react";
import { validate } from "../../utils/validators";


const inputReducer = (state, action) => {
    switch(action.type){
        case 'CHANGE':
            return{
                ...state,
                value: action.val,
                isValid: validate(action.val, action.validators)
            };
        case 'TOUCH':
            return{
                ...state, 
                isTouched: true
            }
        default:
            return state;
    }
};


const Input = (props) => {
    const [inputState, dispatch] = React.useReducer(inputReducer, {
        value: props.initialValue || "",
        isTouched: false,
        isValid: props.initialValid || false,
      });
   
      const {id, onInput} = props;
      const {value, isValid} = inputState;
      React.useEffect(() => {
          onInput(id, value, isValid);
      }, [id, value, isValid, onInput]); 
  
      const changeHandler = (event) =>{
          dispatch({
            type: "CHANGE",
            val: event.target.value,
            validators: props.validators
          });
      };
  
      const touchHandler = () => {
          dispatch({
              type: 'TOUCH'
          });
      };

  return (
    <TextField
      sx={props.sx}
      id={props.id}
      label={props.label}
      typeof= {props.type}
      variant={props.variant}
      onChange={changeHandler}
      onBlur={touchHandler}
      error = {! inputState.isValid && inputState.isTouched ? true: false}
      helperText = {! inputState.isValid && inputState.isTouched ? props.errorText: ""}
      value = {inputState.value}
    />
  );
};


export default Input;