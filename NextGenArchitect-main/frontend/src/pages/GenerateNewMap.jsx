import React, { useState, useEffect } from 'react'
import { Grid, Button, Typography, Modal, Box, Backdrop, Fade, TextField, Input } from '@mui/material';
import { Stage, Layer } from 'react-konva';
import { generateTarget, drawNodes, updateObjects, makeConnection } from '../utils/map_graph_util';
// import { UpdateUser } from '../services/apiServices';
import ConstraintsForm from '../components/floorplan/ContraintsForm';
import { GenerateMap } from '../services/floorplanService';
import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import { theme } from "../Themes/Default-theme";
// import { DrawingBoardContext } from "../context/DrawingBoardContext";

const GenerateNewMap = () => {
    const stageW = 900
    const stageH = 800
    const [targets, setTargets] = useState([])
    const [connectors, setConnectors] = useState([])
    const layerRef = React.useRef();
    const [nodes, setNodes] = useState([])    //list with max size 2
    const [submitClicked, setSubmitClicked] = useState(false)
    // const auth = useContext(AuthContext)
    const [open,setOpen] = useState(false)
    const nav = useNavigate();
    // const dbContext = useContext(DrawingBoardContext);
    const [mapDimensions, setMapDimensions] = useState({ w: 100, h: 100 });
    const [selectedMap, setSelectedMap] = useState(null);
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [showPagination, setShowPagination] = useState(false);

    const [plotDim, setPlotDim] = useState({x:100, y:100})
    const [kp, setKp] = useState(0.6)
    const [lp, setLp] = useState(0.8)
    const [bedp, setBedp] = useState(0.8)
    const [bathp, setBathp] = useState(0.7)
    const [cp, setCp] = useState(0.5)
    const [gp, setGp] = useState(0.3)
    const [dp, setDp] = useState(0.8)

    const [kper, setKper] = useState(10)
    const [lper, setLper] = useState(40)
    const [bedper, setBedper] = useState(15)
    const [bathper, setBathper] = useState(5)
    const [cper, setCper] = useState(30)
    const [gper, setGper] = useState(10)
    const [dper, setDper] = useState(10)

    
    const setSelectedNode = (newNode) => {
        setNodes(prevState => [...prevState, newNode]);
        /*  console.log("Node clicked, before update: ", nodes)
          console.log("Node length, before update: ", nodes.length)
           console.log("Setting node", newNode.attrs.id)
          //  console.log("Prev Node", node)
          if (nodes.length === 0) {    //no nodes was selected before
              console.log("Adding node 1")
              //layerRef.current.findOne('#' + newNode.attrs.id).shadowColor('red')
              setNodes([newNode]);
              return;
          }
          else if (nodes.length === 1) {   //node was selected before 
              if (newNode.attrs.id == nodes[0].attrs.id) {  //same node is selected now
                  console.log("Same node selected")
                  setNodes([])
                  removeCircleHighlight();
                  return;
              }
              else {
                  // nodes[1] = newNode
                  console.log("Adding node 2")
                  removeCircleHighlight();
                  setNodes(prevState => [...prevState, newNode]);
                  return;
              }
          }
          else if (nodes.length === 2) {   // new selection alltogether
              console.log("clearing and adding Node 1")
              removeCircleHighlight();
              //layerRef.current.findOne('#' + newNode.attrs.id).shadowColor('red')
              setNodes([newNode])
              return;
          }*/

    }

    const handleNewNodeClick = () => {
        removeCircleHighlight();
        setNodes([])
        //console.log(layerRef.current)
        const stage = layerRef.current.parent;
        const tars = generateTarget(targets, stage)
        setTargets(tars)
        console.log("Targetsss: ", tars)

        drawNodes(connectors, [tars[tars.length - 1]], layerRef.current, setSelectedNode)

    }

    const removeCircleHighlight = () => {
        for (var i = 0; i < targets.length; i++) {
            layerRef.current.findOne('#' + targets[i].id).shadowColor('black')
        }
    }

    const addCircleHighlight = () => {
        //for (var i = 0; i < nodes.length; i++) {
        // console.log("Highlighted: ", nodes[i].attrs.id)
        if (nodes.length % 2 === 1)
            layerRef.current.findOne('#' + nodes[nodes.length - 1].attrs.id).shadowColor('red')
        // }
    }
    const removeExtraCircleHighlights = () => {
        for (var i = 0; i < targets.length; i++) {
            if (nodes.find(node => node.attrs.id === targets[i].id) === undefined)  //node is not selected
                layerRef.current.findOne('#' + targets[i].id).shadowColor('black')
        }
    }
    const handleClose = () => {
        setOpen(false)
    }
    const handleOpen = () => {
        setOpen(true)
    }

    useEffect(() => {
        console.log("NODES SET: ", nodes)
        addCircleHighlight();
        removeExtraCircleHighlights();
        // console.log("SELECT STATUS: ", isNodeSelected)
        if (nodes.length > 1 && nodes.length % 2 === 0) {
            console.log("Adding connection")
            removeCircleHighlight();
            var newCons = makeConnection(targets, connectors, nodes[nodes.length - 2].attrs.id, nodes[nodes.length - 1].attrs.id)
            drawNodes([newCons[newCons.length - 1]], [], layerRef.current, setSelectedNode)
            setConnectors(newCons)
            console.log("New connections: ", newCons)
            updateObjects(targets, connectors, layerRef.current)
        }

        /*   layerRef.current.findOne('#' + node.attrs.id).attrs.shadowColor = 'red';*/
    }, [nodes]);

    const onSubmitFormHandler = (formInputs) => {
        setSubmitClicked(true)
        console.log("INPUTS: ", formInputs);
        var bedrooms = parseInt(formInputs.bedrooms.value);
        var bathrooms = parseInt(formInputs.bathrooms.value);
        var carporch = parseInt(formInputs.carporch.value);
        // var coveredarea = parseInt(formInputs.coveredarea.value);
        var drawingrooms = parseInt(formInputs.drawingrooms.value);
        var gardens = parseInt(formInputs.gardens.value);
        var kitchens = parseInt(formInputs.kitchens.value);
        var livingrooms = parseInt(formInputs.livingrooms.value);
        var plot_x = parseInt(formInputs.plot_X_Dimension.value);
        var plot_y = parseInt(formInputs.plot_Y_Dimension.value);
        setPlotDim({x: plot_x, y: plot_y});
        // dbContext.setMapDim(plot_x,  plot_y);
        setMapDimensions({ w: plot_x, h: plot_y });



        removeCircleHighlight();
        setNodes([])
        const stage = layerRef.current.parent;
        for (var i = 0; i < bedrooms; i++) {
            //console.log(layerRef.current)
            // console.log("GEnerate Target called, i: ", i)
            var tag = 'bedroom-' + i;
            const tars = generateTarget(targets, stage, i, tag)
            setTargets(tars)
            console.log("Targetsss: ", tars)
            drawNodes(connectors, [tars[tars.length - 1]], layerRef.current, setSelectedNode)
        }

        for (var i = 0; i < bathrooms; i++) {
            var tag = 'bathroom-' + i;
            const tars = generateTarget(targets, stage, i + bedrooms, tag)
            setTargets(tars)
            console.log("Targetsss: ", tars)
            drawNodes(connectors, [tars[tars.length - 1]], layerRef.current, setSelectedNode)
        }
        for (var i = 0; i < carporch; i++) {
            var tag = 'carporch-' + i;
            const tars = generateTarget(targets, stage, i + bedrooms + bathrooms, tag)
            setTargets(tars)
            console.log("Targetsss: ", tars)
            drawNodes(connectors, [tars[tars.length - 1]], layerRef.current, setSelectedNode)
        }
        for (var i = 0; i < drawingrooms; i++) {
            var tag = 'drawingroom-' + i;
            const tars = generateTarget(targets, stage, i + bedrooms + bathrooms + carporch, tag)
            setTargets(tars)
            console.log("Targetsss: ", tars)
            drawNodes(connectors, [tars[tars.length - 1]], layerRef.current, setSelectedNode)
        }
        for (var i = 0; i < gardens; i++) {
            var tag = 'garden-' + i;
            const tars = generateTarget(targets, stage, i + bedrooms + bathrooms + carporch + drawingrooms, tag)
            setTargets(tars)
            console.log("Targetsss: ", tars)
            drawNodes(connectors, [tars[tars.length - 1]], layerRef.current, setSelectedNode)
        }
        for (var i = 0; i < kitchens; i++) {
            var tag = 'kitchen-' + i;
            const tars = generateTarget(targets, stage, i + bedrooms + bathrooms + carporch + drawingrooms + gardens, tag)
            setTargets(tars)
            console.log("Targetsss: ", tars)
            drawNodes(connectors, [tars[tars.length - 1]], layerRef.current, setSelectedNode)
        }
        for (var i = 0; i < livingrooms; i++) {
            var tag = 'livingroom-' + i;
            const tars = generateTarget(targets, stage, i + bedrooms + bathrooms + carporch + drawingrooms + gardens + kitchens, tag)
            setTargets(tars)
            console.log("Targetsss: ", tars)
            drawNodes(connectors, [tars[tars.length - 1]], layerRef.current, setSelectedNode)
        }

    }

    const generateBtnClicked = () => {
        console.log(kp,gp,lp)
        GenerateMap(connectors, plotDim.x, plotDim.y, lp, kp, dp, cp, bathp, bedp, gp, lper, kper, dper, cper, bathper, bedper, gper).then((res) => {
            console.log("Generated Map: ", res.data)
            // auth.setSelectedMap(res.data.maps)
            // auth.setSelectedRooms(res.data.room)
            setSelectedMap(res.data.maps)
            setSelectedRooms(res.data.room)
            // dbContext.setShowPagination(true)
            setShowPagination(true)
            console.log("Rooms:",res.data.room)
            // Store in localStorage for DrawingBoard page to access
            localStorage.setItem('selectedMap', JSON.stringify(res.data.maps))
            localStorage.setItem('selectedRooms', JSON.stringify(res.data.room))
            localStorage.setItem('mapDimensions', JSON.stringify(plotDim))
            nav('/drawing-board')
        })
    }
    useEffect(()=>{
        // dbContext.setShowPagination(false)  //setting pagination to false on load 
        setShowPagination(false)
    }, [])
    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 600,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
      };
      
    return (
        <Grid container sx={{ pt: 5 }}>
            {/*<Grid item xs={12}><Button sx={{w:'100%'}} variant="contained"  onClick={handleNewNodeClick}>Add Node</Button></Grid>*/}
            <Grid item xs={11}>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <Box sx={style}>
                <Grid container>
                    <Grid item xs={6}>
  
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
                sx={{mb:2}}
              >
                Enter the Propotions
              </Typography>
              <TextField sx = {{
                pb : 2
              }}
          id="outlined-helperText"
          label="Livingroom Proportions"
          defaultValue={lp}
          onChange = {(event) => {setLp(event.target.value)}}
        />
              <TextField sx = {{
                pb : 2
              }}
          id="outlined-helperText"
          label="Kitchen Proportions"
          defaultValue={kp}
          onChange = {(event) => {setKp(event.target.value)}}
        
                />
        <TextField sx = {{
                pb : 2
              }}
          id="outlined-helperText"
          label="Bedroom Proportions"
          defaultValue={bedp}
          onChange = {(event) => {setBedp(event.target.value)}}
        />
        <TextField sx = {{
                pb : 2
              }}
          id="outlined-helperText"
          label="Bathroom Proportions"
          defaultValue={bathp}
          onChange = {(event) => {setBathp(event.target.value)}}
        />
        <TextField sx = {{
                pb : 2
              }}
          id="outlined-helperText"
          label="Carpoarch Proportion"
          defaultValue={cp}
          onChange = {(event) => {setCp(event.target.value)}}
        />
        <TextField sx = {{
                pb : 2
              }}
          id="outlined-helperText"
          label="Garden Proportion"
          defaultValue={gp}
          onChange = {(event) => {setGp(event.target.value)}}
        />
        <TextField sx = {{
                pb : 2
              }}
          id="outlined-helperText"
          label="Drawing Room Proportion"
          defaultValue={dp}
          onChange = {(event) => {setDp(event.target.value)}}
        />
                              
                              </Grid>
                              <Grid item xs={6}>
  
  <Typography
    id="transition-modal-title"
    variant="h6"
    component="h2"
    sx={{mb:2}}
  >
    Enter the Percentages
  </Typography>
  <TextField sx = {{
    pb : 2
  }}
id="outlined-helperText"
label="Livingroom Percentages"
defaultValue={lper}
onChange = {(event) => {setLper(event.target.value)}}
/>
  <TextField sx = {{
    pb : 2
  }}
id="outlined-helperText"
label="Kitchen Percentages"
defaultValue={kper}
onChange = {(event) => {setKper(event.target.value)}}

/>
<TextField sx = {{
    pb : 2
  }}
id="outlined-helperText"
label="Bedroom Percentages"
defaultValue={bedper}
onChange = {(event) => {setBedper(event.target.value)}}
/>
<TextField sx = {{
    pb : 2
  }}
id="outlined-helperText"
label="Bathroom Percentages"
defaultValue={bathper}
onChange = {(event) => {setBathper(event.target.value)}}

/>
<TextField sx = {{
    pb : 2
  }}
id="outlined-helperText"
label="Carpoarch Percentages"
defaultValue={cper}
onChange = {(event) => {setCper(event.target.value)}}

/>
<TextField sx = {{
    pb : 2
  }}
id="outlined-helperText"
label="Garden Percentages"
defaultValue={gper}
onChange = {(event) => {setGper(event.target.value)}}

/>
<TextField sx = {{
    pb : 2
  }}
id="outlined-helperText"
label="Drawing Room Percentages"
defaultValue={dper}
onChange = {(event) => {setDper(event.target.value)}}
/>
                  
                  </Grid>
        </Grid>
              <Box sx={{ width:'100%', display: 'flex', justifyContent: 'space-between' }}>
                <Button
                variant="outlined" color="error"
                  onClick={handleClose}
                  
                >
                  Go Back
                </Button>
                <Button variant="contained"
                  component="label"
                  sx={{mr:3}}
                  onClick= { generateBtnClicked} >
                  Generate
                </Button>
              </Box>
            </Box>
          </Fade>
        </Modal>
      </Grid>
            <Grid item xs={4} sx={{}}><ConstraintsForm submitClicked={submitClicked} onSubmit={onSubmitFormHandler}></ConstraintsForm></Grid>
            <Grid item xs={4} sx={{ pb: 1 }}>
                <Stage
                    width={700}
                    height={1000}
                    style={{ width: '700px', height: '680px', marginLeft: '5px', marginTop: '2px', border: '2px solid red' }}
                    //style={{
                    //   border: '2px solid',
                    //   marginTop: '2px',
                    //}}
                    onDragMove={() => { updateObjects(targets, connectors, layerRef.current) }}

                >
                    <Layer ref={layerRef}>

                    </Layer>
                </Stage>
                <Grid item xs={8} sx={{ pt: 2 }}>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleOpen}
                        justifyContent="flex-end"
                        sx={{
                            mt: 3,
                            mb: 2,
                            height: '60px',
                            borderRadius: '50px',
                            padding: '12px 24px',
                            backgroundColor: "#F57663",
                            color: "#fff",
                            "&:hover": {
                                backgroundColor: "#FFA546",
                            },
                        }}
                    >
                        Generate Map
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default GenerateNewMap;