import React, { useContext } from 'react';
import LinearScaleIcon from '@mui/icons-material/LinearScale';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import WindowOutlinedIcon from '@mui/icons-material/WindowOutlined';
import StairsIcon from '@mui/icons-material/Stairs';
import { Button, Card, Stack, Tooltip, Typography, Box } from '@mui/material';
import { DrawingBoardContext } from "../../context/DrawingBoardContext";
import {initial_menuItems} from "../data/MenuItems.js";
//import { theme } from "../Themes/Default-theme";


export const DrawingToolBox = () => {
    const dbContext = useContext(DrawingBoardContext);

    const handleToolButton = (e) => {
        if (dbContext.selectedTool == e.currentTarget.value) {
            dbContext.setSelectedTool('')
        }
        else {

            dbContext.setSelectedTool(e.currentTarget.value)
            console.log(e.currentTarget.value)
            if (e.currentTarget.value == "Wall") {
                dbContext.setSelectedAsset(initial_menuItems[0]);
                dbContext.setSelectedSource(initial_menuItems[0].url);

                console.log(dbContext.selectedAsset)
            }
            else if (e.currentTarget.value == "Door") {
                dbContext.setSelectedAsset(initial_menuItems[1]);
                dbContext.setSelectedSource(initial_menuItems[1].url);

            }
            else if (e.currentTarget.value == "Window") {
                dbContext.setSelectedAsset(initial_menuItems[2]);
                dbContext.setSelectedSource(initial_menuItems[2].url);

            }
            else if (e.currentTarget.value == "Stairs") {
                dbContext.setSelectedAsset(initial_menuItems[3]);
                dbContext.setSelectedSource(initial_menuItems[3].url);

            }

        }
    }
    return (
        <Card sx={{mr:1 , backgroundColor: "#fff",
        color: "#fff",
        }} >
            <Box sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
            <Typography sx={{ fontSize: 20, fontWeight : "bold"}} color = "black" variant="h7" padding={2} align="center">Entities</Typography>
            </Box>
            <Stack spacing={2} padding={2}  >
                <Tooltip title="Wall Tool" enterDelay={500} placement="right" >

                    <Button
                        variant={(
                            dbContext.selectedTool == 'Wall' ? "contained" : "text"
                        )}
                        value="Wall"
                        onClick={handleToolButton}
                    >
                        <LinearScaleIcon />
                    </Button>
                </Tooltip>
                <Tooltip title="Door Tool" enterDelay={500} placement="right" >

                    <Button
                        variant={(
                            dbContext.selectedTool == 'Door' ? "contained" : "text"
                        )}
                        value="Door"
                        onClick={handleToolButton}
                    >
                        <MeetingRoomIcon />
                    </Button>
                </Tooltip>

                <Tooltip title="Window Tool" enterDelay={500} placement="right" >

                    <Button
                        variant={(
                            dbContext.selectedTool == 'Window' ? "contained" : "text"
                        )}
                        value="Window"
                        onClick={handleToolButton}
                    >
                        <WindowOutlinedIcon />
                    </Button>
                </Tooltip>

                <Tooltip title="Stairs Tool" enterDelay={500} placement="right" >

                    <Button
                        variant={(
                            dbContext.selectedTool == 'Stairs' ? "contained" : "text"
                        )}
                        value="Stairs"
                        onClick={handleToolButton}
                    >
                        <StairsIcon />
                    </Button>
                </Tooltip>

            </Stack>
        </Card>

    );
};
