import React, { useState } from "react";

import { Typography, Card, Grid, Box, Button, Modal, TextField } from "@mui/material";
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import Avatar from "@mui/material/Avatar";
import SendIcon from "@mui/icons-material/Send";
import Input from "./Input";
import { useForm } from "../../hooks/form-hook";
import { VALIDATOR_MAX, VALIDATOR_MIN, VALIDATOR_MINLENGTH } from "../../utils/validators"
// import { theme } from "../../Themes/Default-theme"; // Theme removed for now


const ConstraintsForm = (props) => {
  const [open, setOpen] = React.useState(false);
  const handleModalOpen = () => {
    setOpen(true);
  };
  const handleModalClose = () => {
    setOpen(false);
  };
  
    
  const [formState, InputHandler] = useForm(
    {
      bedrooms: {
        value: 0,
        isValid: false,
      },
      bathrooms: {
        value: 0,
        isValid: false,
      },
      livingrooms: {
        value: 0,
        isValid: false,
      },
      kitchens: {
        value: 0,
        isValid: false,
      },
      carporch: {
        value: 0,
        isValid: false,
      },
      drawingrooms: {
        value: 0,
        isValid: false,
      },
      coveredarea: {
        value: 0,
        isValid: false,
      },
      gardens: {
        value: 0,
        isValid: false,
      },
      plot_Y_Dimension: {
        value: 0,
        isValid: false,
      },
      plot_X_Dimension: {
        value: 0,
        isValid: false,
      },
    },
    false
  );

  const [formStateGA, InputHandlerGA] = useForm(
    {
      bedrooms: {
        value: 0,
        isValid: false,
      },
      bathrooms: {
        value: 0,
        isValid: false,
      },
      livingrooms: {
        value: 0,
        isValid: false,
      },
      kitchens: {
        value: 0,
        isValid: false,
      },
      carporch: {
        value: 0,
        isValid: false,
      },
      drawingrooms: {
        value: 0,
        isValid: false,
      },
      coveredarea: {
        value: 0,
        isValid: false,
      },
      gardens: {
        value: 0,
        isValid: false,
      },
      plot_Y_Dimension: {
        value: 0,
        isValid: false,
      },
      plot_X_Dimension: {
        value: 0,
        isValid: false,
      },
    },
  );


  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Text 1: ", text1);
    console.log("Text 2: ", text2);
    props.onClose();
  };

  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");



  return (
    <Grid justifyContent="center" display="flex" flex-direction="row">
      <Card sx={{ width: "100%", height:"800px", maxWidth: "300px", }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: '4px 4px',
            backgroundColor: "#F57663",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "#FFA546",
                      },
          }}
        >
          <Avatar sx={{ mr: 2 }}>
            <SquareFootIcon />
          </Avatar>
          <Typography variant="h6">Map Constraints</Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            flexWrap: "wrap",
            alignItems: "center",
    
          }}
        >
          <Input
            sx={{

            }}
            id="plot_X_Dimension"
            label="Plot X Dimension in feet"
            variant="standard"
            onInput={InputHandler}
            validators={[VALIDATOR_MIN(10)]}
            errorText="Must be over 10 feet"
          />
          <Input
            sx={{

            }}
            id="plot_Y_Dimension"
            label="Plot Y Dimension in feet"
            variant="standard"
            onInput={InputHandler}
            validators={[VALIDATOR_MIN(10)]}
            errorText="Must be over 10 feet"
          />
          <Input
             sx={{

            }}
            id="bedrooms"
            label="Bedroom Count"
            variant="standard"
            onInput={InputHandler}
            validators={[VALIDATOR_MINLENGTH(1)]}
            errorText="Bedroom Count is a required field"
          />
          <Input
            sx={{
  
            }}
            id="bathrooms"
            label="Bathroom Count"
            variant="standard"
            onInput={InputHandler}
            validators={[VALIDATOR_MINLENGTH(1)]}
            errorText="Bathroom Count is a required field"
          />
          <Input
             sx={{
    
            }}
            id="livingrooms"
            label="Living Rooms"
            variant="standard"
            onInput={InputHandler}
            validators={[VALIDATOR_MINLENGTH(1)]}
            errorText="Living Rooms is a required field"
          />
          <Input
             sx={{
   
            }}
            id="kitchens"
            label="Kitchens"
            variant="standard"
            onInput={InputHandler}
            validators={[VALIDATOR_MINLENGTH(1)]}
            errorText="Kitchens is a required field"
          />
          <Input
             sx={{
     
            }}
            id="carporch"
            label="Car Porch"
            variant="standard"
            onInput={InputHandler}
            validators={[VALIDATOR_MINLENGTH(1)]}
            errorText="Car Porch is a required field"
          />
          <Input
             sx={{
 
            }}
            id="drawingrooms"
            label="Drawing Rooms"
            variant="standard"
            onInput={InputHandler}
            validators={[VALIDATOR_MINLENGTH(1)]}
            errorText="Drawing rooms is a required field"
          />
          <Input
             sx={{
 
            }}
            id="coveredarea"
            label="Covered Area %"
            variant="standard"
            onInput={InputHandler}
            validators={[VALIDATOR_MINLENGTH(1),VALIDATOR_MIN(50), VALIDATOR_MAX(100) ]}
            errorText="Area should be in range 50-100"
          />
<Input
   sx={{

  }}
  id="gardens"
  label="Garden"
  variant="standard"
  onInput={InputHandler}
  validators={[VALIDATOR_MINLENGTH(1)]}
  errorText="Gardens is a required field"
/>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              alignItems: "center",
              width: "100%",
             
            }}
          >
          </Box>
          <Grid container display="flex" justifyContent= "center">

          </Grid>
          


          <Grid container  justifyContent="center" >
            <Modal open={open} onClose={handleModalClose} style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>

          <Box
          sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#fff",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          maxWidth: 400,
          width: "100%",
        }}
      >
        <div style={{ backgroundColor: 'white', padding: '20px' }}>
        <Typography variant="h5" align="center">
          Adjust the Floorplan Ratios
        </Typography>
        <Typography variant="body1" align="center">
          Default values are already provided.
        </Typography>
      </div>
        <Input
             sx={{
 
            }}
            id="drawingrooms"
            label="Drawing Rooms"
            variant="standard"
            onInput={InputHandlerGA}
            validators={[VALIDATOR_MINLENGTH(1)]}
            errorText="Drawing rooms is a required field"
          />
          <Input
             sx={{
 
            }}
            id="drawingrooms"
            label="Drawing Rooms"
            variant="standard"
            onInput={InputHandlerGA}
            validators={[VALIDATOR_MINLENGTH(1)]}
            errorText="Drawing rooms is a required field"
          />
          <Input
             sx={{
 
            }}
            id="drawingrooms"
            label="Drawing Rooms"
            variant="standard"
            onInput={InputHandlerGA}
            validators={[VALIDATOR_MINLENGTH(1)]}
            errorText="Drawing rooms is a required field"
          />
          <Input
             sx={{
 
            }}
            id="drawingrooms"
            label="Drawing Rooms"
            variant="standard"
            onInput={InputHandlerGA}
            validators={[VALIDATOR_MINLENGTH(1)]}
            errorText="Drawing rooms is a required field"
          />
          <Input
             sx={{
 
            }}
            id="drawingrooms"
            label="Drawing Rooms"
            variant="standard"
            onInput={InputHandlerGA}
            validators={[VALIDATOR_MINLENGTH(1)]}
            errorText="Drawing rooms is a required field"
          />
          <Input
             sx={{
 
            }}
            id="drawingrooms"
            label="Drawing Rooms"
            variant="standard"
            onInput={InputHandlerGA}
            validators={[VALIDATOR_MINLENGTH(1)]}
            errorText="Drawing rooms is a required field"
          />
          <Input
             sx={{
 
            }}
            id="drawingrooms"
            label="Drawing Rooms"
            variant="standard"
            onInput={InputHandlerGA}
            validators={[VALIDATOR_MINLENGTH(1)]}
            errorText="Drawing rooms is a required field"
          />
          <Input
             sx={{
 
            }}
            id="drawingrooms"
            label="Drawing Rooms"
            variant="standard"
            onInput={InputHandlerGA}
            validators={[VALIDATOR_MINLENGTH(1)]}
            errorText="Drawing rooms is a required field"
          />
          <Input
             sx={{
 
            }}
            id="drawingrooms"
            label="Drawing Rooms"
            variant="standard"
            onInput={InputHandlerGA}
            validators={[VALIDATOR_MINLENGTH(1)]}
            errorText="Drawing rooms is a required field"
          />
          <Input
             sx={{
 
            }}
            id="drawingrooms"
            label="Drawing Rooms"
            variant="standard"
            onInput={InputHandlerGA}
            validators={[VALIDATOR_MINLENGTH(1)]}
            errorText="Drawing rooms is a required field"
          />
      </Box>
      </Modal >
            <Button 
              onClick={()=>props.onSubmit(formState.inputs)}
              variant="contained"
              endIcon={<SendIcon />}
              sx={{ mt: 1, justifyContent: "center",
              alignItems: "center",  backgroundColor: "#F57663",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#FFA546",
              }, }}
              disabled={!formState.isValid || props.submitClicked}
            >
              Draw Nodes
            </Button>
          </Grid>
        </Box>
      </Card>
    </Grid>
  );
};

export default ConstraintsForm;
