import axios from "axios";

// Backend API URL
const URL = "http://localhost:5000/api/";

export async function SaveMap(name, length, width, userId, Joins, Labels) {
  let tempURL = URL + "/Floorplan";
  console.log(tempURL);
  //let loginDetails = { username, password };
  const newJoins = []
  if (Array.isArray(Joins) && Joins.length > 0){
    for (var i=0; i<Joins.length; i++){
      newJoins.push({X1:Joins[i].x1, Y1: Joins[i].y1, X2:Joins[i].x2, Y2: Joins[i].y2, Type: Joins[i].type})
    }
  }
  console.log("New Joins: ", newJoins)
  let mapInfo = { name, length, width, userId, Joins:newJoins, Labels };
  console.log("SENDING MAP INFO: ", mapInfo)
  const response = await axios.post(tempURL, mapInfo);
  return response;
}

export async function GetMap(mapId) {
  let tempURL = URL +  "getFloorplan/"
  tempURL = tempURL + mapId 

  const response = await axios.get(tempURL)
  if(response.status === 201)
  {
    console.log("Floor Plan Details")
    console.log(response.data)
  }
  return response;
}
export async function GetUserMaps(userId) {
  let tempURL = URL + "/Floorplan";
  console.log(tempURL);
  const response = await axios.patch(tempURL, {user_Id: userId});
  return response;
}

export async function GetMapConnections(mapId) {
  let tempURL = URL + "/getFloorplan/";
  tempURL = tempURL + mapId;
  console.log(tempURL);
  const response = await axios.get(tempURL);
  console.log(response.data)
  return response;
}

export async function GenerateMap(connectors, w, h, kitchen_p, living_p, drawing_p, car_p, bath_p, bed_p,gar_p, kitchen_per, living_per, drawing_per, car_per, bath_per, bed_per, gar_per) {
  let tempURL = URL + "generate-floorplan";
  console.log(tempURL);
  console.log("Connectors: ", connectors)
  
  const response = await axios.post(tempURL, {
    connectors, 
    width: w, 
    height: h, 
    kitchen_proportion: kitchen_p, 
    livingroom_proportion: living_p, 
    drawingroom_proportion: drawing_p, 
    carporch_proportion: car_p, 
    bathroom_proportion: bath_p, 
    bedroom_proportion: bed_p, 
    garden_proportion: gar_p,
    kitchen_percentage: kitchen_per, 
    livingroom_percentage: living_per, 
    drawingroom_percentage: drawing_per, 
    carporch_percentage: car_per, 
    bathroom_percentage: bath_per, 
    bedroom_percentage: bed_per, 
    garden_percentage: gar_per,
    name: 'Generated Floor Plan'
  });
  return response;
}
