import React, {useState, useEffect} from "react";
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import { DrawingBoardContext } from "../context/DrawingBoardContext";
// import { GetUserMaps } from "../services/floorplanAPI";
import {
    Button,
    Grid,
    Card,
    CardActions,
    CardContent,
    Typography,
    Box,
    Divider,
    TextField
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import SearchBox from "../components/floorplan/SearchBox";
// import { theme } from "../Themes/Default-theme";
import HouseIcon from '@mui/icons-material/House';

const UserMaps = () => {
    const [fps, setFps] = useState(0)
    // const auth = useContext(AuthContext)
    // const dbContext = useContext(DrawingBoardContext)
    const nav = useNavigate();
    const [searchedMap, setSearchedMap] = useState("");
    const [mapOptions, setMapOptions] = useState([])
    const [maps, setMaps] = useState([])
    const [mapsMaster, setMapsMaster] = useState([])
    
    useEffect(()=>{
        // Load saved maps from localStorage
        const savedMaps = localStorage.getItem('userFloorplans');
        if (savedMaps) {
            try {
                const parsedMaps = JSON.parse(savedMaps);
                setMaps(parsedMaps);
                setMapsMaster(parsedMaps);
                const temp_list = parsedMaps.map(item => item.Floorplan_Name || item.name);
                setMapOptions(temp_list);
                setFps(temp_list.length);
            } catch (err) {
                console.log("ERROR parsing saved maps: ", err);
            }
        }
    }, [])

    // useEffect(()=>{
    //   dbContext.setShowPagination(false)  //setting pagination to false on load 
    // }, [])

    const textChange = (value) => {
        setSearchedMap(value);
        //console.log("here: " + value);
        if (typeof value === "string") {
          const filteredArray = mapsMaster.filter((map) => {
            return (map.Floorplan_Name || map.name || "").toLowerCase().includes(value.toLowerCase());
          });
          setMaps(filteredArray);
        }
        if (value.length === 0) setMaps(mapsMaster);
        
    };

    const handleViewClick = (id) => {
        console.log("Floor Plan ID Clicked : ", id)
        // auth.setSelectedMap(id)
        localStorage.setItem('selectedMapId', id);
        nav('/drawing-board')
    }

    return (
      <Grid container spacing={3} padding={2}>
  <Grid item xs={12} md={3}>
    <SearchBox
      onChange={textChange}
      inputValue={searchedMap}
      options={mapOptions}
      label="Map Name"
    />
  <Box sx={{
  display: "flex",
  alignItems: "center",
  marginTop: "16px",
  backgroundColor: "#F57663",
  borderRadius: "10px",
  boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)",
}}>
  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "20%", }}>
    <HouseIcon />
  </Box>
  <Box sx={{ width: "80%",  backgroundColor: "#F57663", height : "100%"}}>
    <Typography variant="h7" sx={{ marginBottom: "8px", fontFamily: "Roboto", fontWeight: 60, color: "#000000", textTransform: "uppercase", letterSpacing: "1px" }}>
      TOTAL FLOORPLANS GENERATED
    </Typography>
    <Typography variant="h5" sx={{ fontSize: "20px", fontFamily: "Roboto", fontWeight: 400, lineHeight: "1.5", color: "#000" , textAlign :  "center"}}>
      {fps}
    </Typography>
  </Box>
</Box>
  </Grid>
  <Grid item xs={12} md={9}>
    <Grid container spacing={3}>
    {maps.map((item) => (
  <Grid
    item
    xs={12}
    sm={6}
    md={4}
    key={item.Floorplan_ID}
    sx={{
      display: "flex",
      justifyContent: "center",
      "&:hover": {
        transform: "scale(1.01)",
        transition: "transform 0.2s ease-in-out",
        boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.10)",
      },
    }}
  >
    <Card
      sx={{
        maxWidth: 220,
        minWidth: 220,
        borderRadius: "10px",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <CardContent sx={{ backgroundColor: "#f9f9f9" }}>
        <Typography gutterBottom variant="h5" component="div" textAlign={"center"}>
          {item.Floorplan_Name}
        </Typography>
      </CardContent>
      <Divider />
      <CardActions>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            sx={{
              width: "100%",
              borderRadius: "10px",
              backgroundColor: "#F57663",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#FFA546",
              },
            }}
            variant="contained"
            component="label"
            startIcon={<EditIcon />}
            onClick={() => handleViewClick(item.Floorplan_ID)}
          >
            View
          </Button>
          
        </Box>
      </CardActions>
    </Card>
  </Grid>
))}
    </Grid>
  </Grid>
</Grid>
    )
}

export default UserMaps;