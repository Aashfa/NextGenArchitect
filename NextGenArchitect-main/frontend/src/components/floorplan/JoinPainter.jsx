import React, { useContext, useEffect, useCallback } from 'react';
import { DrawingBoardContext } from "../../context/DrawingBoardContext";
import { Button, Modal } from '@mui/material';
import { Circle, Text, Rect } from 'react-konva';
import useImage from 'use-image';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';

//import { DetectRooms } from '../util/roomDetectutils';
import { initial_menuItems } from "../data/MenuItems.js";
import { CoordinateTranslator, checkJoins, checkEdgeConnections, specifyEdgeConnection, checkIds, findElement, splitBasedonID, getDistance } from "../../utils/join_utils.js";
import { GetMapConnections, GetMap, SaveMap } from '../../services/floorplanService';
//import { AuthContext } from '../context/AuthContext';
//Noted Bug
// joining 3 images at a point leads to incorrect connections
// angled connection to map translation is full of bugs


var Joins = [];



export const JoinPainter = (props) => {
    const theme = useTheme();
    const [allMaps, setAllMaps] = useState([]);
    const { testBtn } = props
    const { testBtn2 } = props
    const { setImageObjects } = props
    const { newId } = props
    const { setNewId } = props
    const { enable3D } = props
    const { setCons } = props
    const { setLabs } = props
    const { mapToDraw } = props

    const { ImageObjects } = props;
    const [connections, setConnections] = React.useState([]);

    const { setImageChanged } = props
    const { ImageChanged } = props
    const { selectedItemCoordinates } = props
    const [newJoinId, setNewJoinId] = React.useState('1');
    const [labels, setLabels] = React.useState([])
    const [textList, setTextList] = React.useState([])

    const dbContext = useContext(DrawingBoardContext);


    const makeJoins = (xx, yy, id1, id2, obj1, obj2) => {
        // Creates a join between two img Objects
        if (id1 != id2) {
            if (id1 > id2) {
                var temp = id1
                id1 = id2
                id2 = temp
            }
            Joins.push({ img1Id: id1, img2Id: id2, type1: obj1, type2: obj2, x: xx, y: yy })
        }

    };

    const joinMaker = (selectedImgInstance, selectedItemCoordinates) => {

        // detect attachments and make joins accordingly,also removes unnecessary joins
        var selid = selectedImgInstance
        var selt = findElement(ImageObjects, "id", selid)
        if (selt != null) {
            var selAsset = selt.alt

            var coords2 = CoordinateTranslator(selectedItemCoordinates.x, selectedItemCoordinates.y, selectedItemCoordinates.w, selectedItemCoordinates.h, selectedItemCoordinates.angle, selAsset)

            // checking for attachment and making joins
            for (var img = 0; img < ImageObjects.length; img++) {
                if (ImageObjects[img] != null) {
                    var coords1 = CoordinateTranslator(ImageObjects[img].x, ImageObjects[img].y, ImageObjects[img].width, ImageObjects[img].height, ImageObjects[img].rotation, ImageObjects[img].alt)
                    for (var i = 0; i < coords1.length; i++) {
                        for (var j = 0; j < coords2.length; j++) {
                            if (checkJoins(coords1[i], coords2[j])) {
                                if (checkIds(selectedImgInstance, ImageObjects[img].id, coords1[i], Joins)) {
                                    makeJoins(coords1[i][0], coords1[i][1], selectedImgInstance, ImageObjects[img].id, selAsset, ImageObjects[img].alt)
                                }
                            }
                        }
                    }
                }
            }



            // Checking to Remove all unattached joins
            var toRemove = []

            for (var i = 0; i < Joins.length; i++) {

                for (var x = 0; x < Joins.length; x++) {

                }
                if (Joins[i].img1Id == selectedImgInstance || Joins[i].img2Id == selectedImgInstance) {
                    var valid = false;
                    for (var j = 0; j < coords2.length; j++) {
                        if (checkJoins([Joins[i].x, Joins[i].y], coords2[j])) {

                            valid = true
                        }
                    }
                    if (!valid) {
                        toRemove.push(i)
                    }
                }

            }

            //Remove all unattached joins
            for (var i = toRemove.length - 1; i >= 0; i--) {

                Joins.splice(toRemove[i], 1)
            }
            // making double joins into singles 
            var sJoins = splitBasedonID(Joins)
            toRemove = []
            for (var i = 0; i < sJoins.length; i++) {
                if (sJoins[i][1].length > 1) {
                    var avgX = 0
                    var avgY = 0
                    var indices = []
                    for (var j = 0; j < sJoins[i][1].length; j++) {
                        indices.push(sJoins[i][1][j][0])
                        avgX += sJoins[i][1][j][1].x
                        avgY += sJoins[i][1][j][1].y
                    }
                    avgX = avgX / sJoins[i][1].length
                    avgY = avgY / sJoins[i][1].length
                    var minIndex = sJoins[i][1][0][0]
                    var minDist = getDistance(sJoins[i][1][0][1].x, sJoins[i][1][0][1].y, avgX, avgY)

                    for (var j = 1; j < sJoins[i][1].length; j++) {
                        var ind = sJoins[i][1][j][0]
                        var dist = getDistance(sJoins[i][1][j][1].x, sJoins[i][1][j][1].y, avgX, avgY)
                        if (dist < minDist) {
                            minDist = dist
                            minIndex = ind
                        }
                    }
                    const index = indices.indexOf(minIndex);
                    indices.splice(index, 1);
                    toRemove = toRemove.concat(indices)
                }
            }

            toRemove.sort(function (a, b) { return a - b })

            //Remove all double joins
            for (var i = toRemove.length - 1; i >= 0; i--) {

                Joins.splice(toRemove[i], 1)
            }

        }
    }

    const joinRefresher = () => {


        for (var i = 0; i < ImageObjects.length; i++) {

            joinMaker(ImageObjects[i].id,
                {
                    x: ImageObjects[i].x,
                    y: ImageObjects[i].y,
                    w: ImageObjects[i].width,
                    h: ImageObjects[i].height,
                    angle: ImageObjects[i].rotation,
                }
            )

        }

    }
    const makeConnections = (ImageObjects, Joins) => {

        var cons = []
        for (var i = 0; i < ImageObjects.length; i++) {
            // console.log(ImageObjects[i])
            var edgeNo = -1
            var inJoin = false
            var points = [[0, 0], [0, 0]]
            for (var j = 0; j < Joins.length; j++) {
                //console.log(Joins[j])

                if (edgeNo < 1) {
                    if (Joins[j].img1Id == ImageObjects[i].id || Joins[j].img2Id == ImageObjects[i].id) {
                        inJoin = true
                        if (checkEdgeConnections(Joins[j].x, Joins[j].y, ImageObjects[i])) {

                            edgeNo += 1
                            points[edgeNo][0] = Joins[j].x
                            points[edgeNo][1] = Joins[j].y
                        }
                    }
                }
            }
            if (inJoin) {
                if (edgeNo == 0) {
                    if (specifyEdgeConnection(points[0][0], points[0][1], ImageObjects[i]) == "top") {

                        points[1][0] = points[0][0] - (ImageObjects[i].height * Math.cos((ImageObjects[i].rotation + 270) * (Math.PI / 180)))
                        points[1][1] = points[0][1] - (ImageObjects[i].height * Math.sin((ImageObjects[i].rotation + 270) * (Math.PI / 180)))

                    }
                    else {
                        points[1][0] = points[0][0] + (ImageObjects[i].height * Math.cos((ImageObjects[i].rotation + 270) * (Math.PI / 180)))
                        points[1][1] = points[0][1] + (ImageObjects[i].height * Math.sin((ImageObjects[i].rotation + 270) * (Math.PI / 180)))


                    }

                }
                else if (edgeNo == -1) {
                    var coords1 = CoordinateTranslator(ImageObjects[i].x, ImageObjects[i].y, ImageObjects[i].width, ImageObjects[i].height, ImageObjects[i].rotation, "Connector")

                    points[0][0] = coords1[4][0]
                    points[0][1] = coords1[4][1]
                    points[1][0] = coords1[5][0]
                    points[1][1] = coords1[5][1]

                }

                cons.push({
                    x1: points[0][0],
                    y1: points[0][1],
                    x2: points[1][0],
                    y2: points[1][1],
                    type: ImageObjects[i].alt
                })

            }
        }
        setConnections(cons)

        //setConnections()
        //saving map to the database 
        if (props.mapName !== "") {
            //labels.map((lab)=>{
            //   cons.push(lab)
            //})
            console.log("Posting CONS: ", cons, "Labels: ", labels)
            ///postMap(cons, labels)
            //  .catch(console.error);
        }
    }
    const makeMap = (connections) => {
        console.log("Make map called on cons: ", connections)
        var imgs = []
        setImageObjects([])
        Joins = []
        var ids = '1'
        var temp_labels = []
        for (var i = 0; i < connections.length; i++) {
            if (connections[i].type != 'label') {
                ids = String(parseInt(ids, 10) + 1)

                var dist1 = getDistance(0, 0, connections[i].x1, connections[i].y1)
                var dist2 = getDistance(0, 0, connections[i].x2, connections[i].y2)

                if (dist1 > dist2) {
                    var tempx = connections[i].x1
                    var tempy = connections[i].y1
                    connections[i].x1 = connections[i].x2
                    connections[i].y1 = connections[i].y2
                    connections[i].x2 = tempx
                    connections[i].y2 = tempy
                }

                var rot = (Math.atan((connections[i].y2 - connections[i].y1) / Math.abs(connections[i].x2 - connections[i].x1)) * (180 / Math.PI)) - 90
                var alt = connections[i].type
                var element = findElement(initial_menuItems, "alt", alt)
                var ea = element.enabledAnchors
                var kr = element.keepRatio
                var url = element.url
                var width = element.width
                var height = getDistance(connections[i].x1, connections[i].y1, connections[i].x2, connections[i].y2)
                var newx = connections[i].x1 - ((width / 2) * Math.cos((rot) * (Math.PI / 180)))
                var newy = connections[i].y1 - ((width / 2) * Math.sin((rot) * (Math.PI / 180)))
                //var coords1 = CoordinateTranslator(ImageObjects[i].x, ImageObjects[i].y, ImageObjects[i].width, ImageObjects[i].height, ImageObjects[i].rotation, "Connector")
                //                if(connections[i].type=='Door'){
                //                  rot=rot+90
                //                width= getDistance(connections[i].x1, connections[i].y1, connections[i].x2, connections[i].y2);
                //              height=element.height
                //            newx=connections[i].x1 + ((height / 2) * Math.cos((rot-90) * (Math.PI / 180)))
                //          newy=connections[i].y1 + ((height / 2) * Math.sin((rot-90) * (Math.PI / 180)))
                //    }


                imgs.push(

                    {
                        alt: alt,
                        url: url,
                        x: newx,
                        y: newy,
                        width: width,
                        height: height,
                        id: ids,
                        rotation: rot,
                        keepRatio: kr,
                        enabledAnchors: ea,
                        name: 'object',
                    },

                )
            }
            else if (connections[i].type == 'label') {
                //setLabels(prevList => [...prevList, connections[i]])
                temp_labels.push(connections[i])
            }

        }
        //console.log("SETTING LABELS HEREE: ", temp_labels)
        setLabels(temp_labels)
        ids = String(parseInt(ids, 10) + 1)

        setNewId(ids)

        setImageObjects(imgs)
        // console.log("IMAGES: ", imgs)

    }
    React.useEffect(() => {
        joinMaker(dbContext.selectedImgInstance, selectedItemCoordinates)

    }, [ImageChanged])

    React.useEffect(() => {
        if (connections.length > 0) {
            console.log("Enabling 3D")


            enable3D()
            setCons(connections) //passing to parent component
            setLabs(labels)
            // DetectRooms(Joins.length, Joins, connections)
        }
    }, [connections])



    React.useEffect(() => {
        // Map loading logic removed - auth dependency removed
    }, [])

    React.useEffect(() => {
        if (allMaps.length > 0) {
            setConnections(allMaps[mapToDraw])
            makeMap(allMaps[mapToDraw])
        }
    }, [mapToDraw])

    React.useEffect(() => {

        joinRefresher()
        makeConnections(ImageObjects, Joins)
    }, [ImageObjects])

    React.useEffect(() => {

        joinRefresher()

        // makeConnections(ImageObjects, Joins)




    }, [testBtn])

    // React.useEffect removed - no auth dependency

    const handleLabelChange = (id, newLabel) => {
        setLabels(prevLabels =>
            prevLabels.map(lab => (lab.id === id ? { ...lab, label: newLabel } : lab))
        );
    };


    useEffect(() => { console.log("Labels Changed, new: ", labels) }, [labels])

    return (
        <>
            { /* <Rect 
                x ={20}
                y={20}
                width = {50}
                height = {20}
                fill={'red'}
                stroke={'black'}
                strokeWidth={2}
                onClick = {()=>{
                    console.log("Add Label clicked")
                }}>
                
            </Rect>}*/}
            {
                Joins.map((circ, i) => {
                    return (
                        <>
                            <Circle
                                x={circ.x}
                                y={circ.y}
                                radius={theme.custom.joins.outerRadius}
                                fill={theme.custom.joins.outerColor}
                            />
                            <Circle
                                x={circ.x}
                                y={circ.y}
                                radius={theme.custom.joins.innerRadius}
                                fill={theme.custom.joins.innerColor}
                            />
                        </>
                    );
                })
            }
            {
                labels.length > 0 &&
                labels.map((lab, index) => {
                    return (<>
                        <Rect
                            key={lab.id}
                            x={lab.x - 20}
                            y={lab.y}
                            width={lab.label.length * 7}
                            height={20}
                            fill="#FFFFFF"
                            opacity={0.9}
                        />
                        <Text text={lab.label.charAt(0).toUpperCase() + lab.label.slice(1)} x={lab.x - 20} y={lab.y} onDblClick={() => {
                            const newText = window.prompt('Update Label', lab.label);
                            if (newText) {
                                handleLabelChange(lab.id, newText);
                            }
                        }} />
                    </>
                    );
                })
            }


        </>

    );
};