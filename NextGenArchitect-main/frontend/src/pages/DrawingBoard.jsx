import React, { useEffect, useContext, useState } from 'react';
// import { AuthContext } from '../context/AuthContext'; // Authentication removed
import { Grid, Paper } from '@mui/material';
import { DrawingBoardContext } from "../context/DrawingBoardContext";
import { DrawingToolBox } from "../components/floorplan/DrawingToolBox"
import { DrawingCanvas } from "../components/floorplan/DrawingCanvas"
import { AttributeWindow } from "../components/floorplan/AttributeWindow"
import { Modal, Backdrop, Fade, Box } from "@mui/material";
import Pagination from '@mui/material/Pagination';
import Alert from "@mui/material/Alert";
import Stack from '@mui/material/Stack';

import { Unity, useUnityContext } from "react-unity-webgl";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1000,
    height: 700,
    bgcolor: "transparent",
    borderRadius: '2%',
    p: 4,
};
const paginationStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: 'lightgray',
    borderRadius: '8px',
    padding: '16px',
};


export const DrawingBoard = () => {

    const dbContext = useContext(DrawingBoardContext);
    const [selectedItemCoordinates, setSelectedItemCoordinates] = React.useState({ x: 0, y: 0, w: 0, h: 0, angle: 0 })
    const [scale, setScale] = React.useState(1)
    const [exportData, setExportData] = React.useState([]);
    const [ImageObjects, setImageObjects] = React.useState([]);
    const [newId, setNewId] = React.useState('1');
    const [testBtn, setTestBtn] = React.useState(1)
    const [testBtn2, setTestBtn2] = React.useState(1)
    const [mapName, setMapName] = React.useState("")
    const [modalOpen, setModalOpen] = useState(false);
    const [disable3D, setDisable3D] = useState(true)


    const openModal = (username) => {
        setModalOpen(true);
    };
    async function closeModal() {
        setModalOpen(false);
        await unload();
    };
    const enable3D = () => {
        setDisable3D(false)

    }
    const parseConnection = (connection) => {


        let str = "";
        for (let key in connection) {
            if (typeof connection[key] === 'number') {
                str += parseInt(connection[key]);
            } else {
                str += connection[key];
            }
            str += ",";
        }
        str = str.slice(0, -1); // Remove the last comma  
        return str
    }

    const [connections, setConnections] = useState([])
    const [labels, setLabels] = useState([])
    const { unityProvider, unload, sendMessage, loadingProgression, isLoaded } = useUnityContext({
        loaderUrl: "assets/UnityBuild/MapGen3d.loader.js",
        dataUrl: "assets/UnityBuild/MapGen3d.data.unityweb",
        frameworkUrl: "assets/UnityBuild/MapGen3d.framework.js.unityweb",
        codeUrl: "assets/UnityBuild/MapGen3d.wasm.unityweb",
    });
    useEffect(() => {

        console.log(labels)
        var labelled = false
        if (labels.length > 0  && "x1" in labels[0]) {
            labelled = true
        }

        if (modalOpen == true && connections.length > 0 && isLoaded) {
            var floor = ""
            floor += parseInt(dbContext.mapDim.w)
            floor += ","
            floor += parseInt(dbContext.mapDim.h)
            setTimeout(sendMessage("MapGenerator", "GenerateFloorP", floor, 3000));

            for (var i = 0; i < connections.length; i++) {

                //  for (var i = 1; i < 2; i++) {
                console.log(parseConnection(connections[i]))
                setTimeout(sendMessage("MapGenerator", "GenerateAssetP", parseConnection(connections[i])), 3000)
                    ;

            }
            if (labelled) {
                for (var i = 0; i < labels.length; i++) {
                    //  for (var i = 1; i < 2; i++) {

                    console.log("GeneratePropsP(\"",parseConnection(labels[i]),"\")")
                        setTimeout(sendMessage("MapGenerator", "GeneratePropsP", parseConnection(labels[i])), 3000)
                        ;

                }
            }

        }
        // This function will run when the component mounts
        console.log('Component mounted');
    }, [isLoaded]);

    // const auth = useContext(AuthContext) // Authentication removed
    const [page, setPage] = useState(1);
    const handleChange = (event, value) => {
        setPage(value);
    };

    useEffect(() => {
        console.log("MAP DIMENSIONS: ", dbContext.mapDim)
    }, [])


    return (
        <Grid sx={{ display: 'flex', pt: 4, pl: 1 }}  >
            <DrawingToolBox />

            <Grid item sx={{ padding: 2 }}>
                {dbContext.showPagination &&
                    <Stack spacing={2} xs={12}>
                        {/*{  <Typography variant='h6'>Generated Map #{page}</Typography>*/}
                        <Pagination page={page} onChange={handleChange} count={5} shape="rounded" size='large' xs={12} />
                    </Stack>
                }
                <DrawingCanvas
                    testBtn={testBtn}
                    mapToDraw={page - 1}
                    testBtn2={testBtn2}
                    mapName={mapName}
                    enable3D={enable3D}
                    selectedItemCoordinates={selectedItemCoordinates}
                    setSelectedItemCoordinates={setSelectedItemCoordinates}
                    scale={scale}
                    exportData={exportData}
                    setExportData={setExportData}
                    ImageObjects={ImageObjects}
                    setImageObjects={setImageObjects}
                    newId={newId}
                    setNewId={setNewId}
                    setCons={setConnections}
                    setLabs={setLabels}
                />
            </Grid>
            <AttributeWindow
                disable3D={disable3D}
                onVisualizeClick={openModal}
                selectedItemCoordinates={selectedItemCoordinates}
                scale={scale}
                setScale={setScale}
                exportData={exportData}
                setNewId={setNewId}
                setImageObjects={setImageObjects}
                setExportData={setExportData}
                createJoins={() => {
                    setTestBtn(testBtn + 1)
                }}
                setMap_name={(newname) => {
                    // console.log("Setting name to: ", newname)
                    setMapName(newname)
                }}
                connections={connections}
                labels={labels}
                mapName={mapName}

            />

            {/*{  <Button onClick={() => {
                setTestBtn(testBtn + 1)
            }}>Tester</Button>
            <Button onClick={() => {
                setTestBtn2(testBtn2 + 1)
            }}>Tester2</Button>*/}
            <Modal
                aria-labelledby="transition-modal-title"
                open={modalOpen}
                onClose={closeModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                    sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)' // Set backdrop color to black with 50% opacity
                    }
                }}
            >
                <Fade in={modalOpen}>
                    <Box sx={style}>
                        <Grid container>


                            <Grid item xs={12}>
                                {!isLoaded && (
                                    <p>Loading Application... {Math.round(loadingProgression * 100)}%</p>
                                )}
                                <Unity
                                    unityProvider={unityProvider}
                                    style={{ width: 1000, height: 700, visibility: isLoaded ? "visible" : "hidden" }}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Fade>
            </Modal>

        </Grid>

    );

};

