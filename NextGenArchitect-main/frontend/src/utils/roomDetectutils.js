import { getDistance } from "./join_utils";

function getOverlapDistanceV(line1, line2, variance) {


    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 2; j++) {
            line1[i][j] = Math.round(line1[i][j] * 10) / 10
        }
    }

    for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 2; j++) {
            line2[i][j] = Math.round(line2[i][j] * 10) / 10
        }
    }

    for (var n = 0; n < 2; n++) {
        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < 2; j++) {
                for (var k = 0; k < 2; k++) {
                    for (var l = 0; l < 2; l++) {
                        if (line1[i][j] != line2[k][l] && Math.abs(line1[i][j] - line2[k][l]) < variance) {

                            if (line1[i][j] > line2[k][l]) {
                                line1[i][j] = line2[k][l]
                            }
                            else {
                                line2[k][l] = line1[i][j]

                            }

                        }
                    }
                }
            }
        }
    }


    var oD = getOverlapDistance(line1, line2)
    return oD

}


function areLinesParallel(point1, point2, point3, point4) {


    // Check if both line segments are vertical


    if (point1[0] == point2[0] && point3[0] == point4[0]) {
        return true;
    }

    // Calculate the slopes of both line segments (excluding vertical lines)
    let slope1, slope2;
    if (point1[0] !== point2[0]) {
        slope1 = (point2[1] - point1[1]) / (point2[0] - point1[0]);
    }
    if (point3[0] !== point4[0]) {
        slope2 = (point4[1] - point3[1]) / (point4[0] - point3[0]);
    }


    // Check if the slopes are equal (within a small tolerance)

    if (slope1 == slope2) {

        return true;

    } else {
        return false;
    }
}

function getOverlapDistance(line1, line2) {



    var x1 = line1[0][0];
    var y1 = line1[0][1];
    var x2 = line1[1][0];
    var y2 = line1[1][1];
    var x3 = line2[0][0];
    var y3 = line2[0][1];
    var x4 = line2[1][0];
    var y4 = line2[1][1];


    // Check if the line segments are parallel
    if (!areLinesParallel([x1, y1], [x2, y2], [x3, y3], [x4, y4])) {

        return 0; // Line segments are not parallel, no overlap
    }

    // Calculate max_start and min_end
    var max_startx = Math.max(Math.min(x1, x2), Math.min(x3, x4));
    var min_endx = Math.min(Math.max(x1, x2), Math.max(x3, x4));

    var overlap_distancex = min_endx - max_startx;


    var max_starty = Math.max(Math.min(y1, y2), Math.min(y3, y4));
    var min_endy = Math.min(Math.max(y1, y2), Math.max(y3, y4));


    var overlap_distancey = min_endy - max_starty;


    if (!areLinesParallel([x1, y1], [x2, y2], [max_startx, max_starty], [min_endx, min_endy])) {


        return 0; // Line segments are not parallel, no overlap

    }



    var overlap_distance = getDistance(max_startx, max_starty, min_endx, min_endy);

    if (overlap_distancex > -1 && overlap_distancey > -1) {
        return overlap_distance

    }

    return 0;
}

function ID2Rooms(id2j, cycle) {
    var corners = []
    for (var i = 0; i < cycle.length; i++) {
        corners.push(id2j[cycle[i]]);
    }

}

export const DetectRooms = (nJoins, Joins, connections) => {



    var joinProximity = 10;

    var iD2Join = {}

    // assigning all joins to a dictionary 
    for (var i = 0; i < Joins.length; i++) {
        var value = [Joins[i].x, Joins[i].y]
        iD2Join[i] = value


    }

    console.log("🚀 ~ file: JoinPainter.js:244 ~ DetectRooms ~ iD2Join:", iD2Join)

    // creating all possible pairs of joins
    var joinIds = Object.keys(iD2Join)
    var joinPairs = joinIds.flatMap(
        (v, i) => joinIds.slice(i + 1).map(w => [parseInt(v), parseInt(w)])
    );
    console.log("🚀 ~ file: JoinPainter.js:260 ~ DetectRooms ~ joinPairs:", joinPairs)


    let graph = [];
    let cycles = [];





    for (var i = 0; i < connections.length; i++) {
        console.log("------------------------------------------------------")
        var oPairs = []
        for (var j = 0; j < joinPairs.length; j++) {
            var l1 = [[connections[i].x1, connections[i].y1], [connections[i].x2, connections[i].y2]]
            console.log("🚀 ~ file: roomDetectutils.js:253 ~ DetectRooms ~ l1:", l1)


            var l2 = [iD2Join[joinPairs[j][0]], iD2Join[joinPairs[j][1]]]
            console.log("🚀 ~ file: JoinPainter.js:279 ~ DetectRooms ~ joinPairs:", joinPairs[j])
            console.log("🚀 ~ file: roomDetectutils.js:257 ~ DetectRooms ~ l2:", l2)


            var oDist = getOverlapDistanceV([...l1], [...l2], 5)
            console.log("🚀 ~ file: roomDetectutils.js:261 ~ DetectRooms ~ oDist:", oDist)

            if (oDist > 0 && oDist <= getDistance(l1[0][0], l1[0][1], l1[1][0], l1[1][1])) {
                oPairs.push([oDist, joinPairs[j][0], joinPairs[j][1]])
            }


        }
        oPairs.sort(function (a, b) {
            return a[0] - b[0]
        });
        console.log("🚀 ~ file: roomDetectutils.js:272 ~ oPairs:", oPairs)



        if (oPairs.length != 0) {
            if (oPairs.length == 1) {
                graph.push([oPairs[0][1], oPairs[0][2]])
            }
            else {
                var onPairs = []
                //add valid pairs to onPairs
                for (var j = 0; j < oPairs.length; j++) {
                    if (j == 0) {
                        onPairs.push([oPairs[j][1], oPairs[j][2]])
                        graph.push([oPairs[j][1], oPairs[j][2]])

                    }
                    else {
                        var overlap = false
                        for (var k = 0; k < onPairs.length; k++) {


                            var l1 = [iD2Join[oPairs[j][1]], iD2Join[oPairs[j][2]]]

                            var l2 = [iD2Join[onPairs[k][0]], iD2Join[onPairs[k][1]]]

                            var odist = getOverlapDistanceV([...l1], [...l2], 5)


                            if (odist > 0) {

                                overlap = true
                            }

                        }
                        if (!overlap) {
                            onPairs.push([oPairs[j][1], oPairs[j][2]])
                            graph.push([oPairs[j][1], oPairs[j][2]])

                        }
                    }

                }

            }

        }
        console.log("🚀 ~ file: roomDetectutils.js:309 ~ DetectRooms ~ onPairs:", onPairs)




    }







    function findNewCycles(path) {
        let start_node = path[0];
        let next_node = null;
        let sub = [];

        for (let edge of graph) {
            let [node1, node2] = edge;

            if (start_node === node1) {
                next_node = node2;
            } else if (start_node === node2) {
                next_node = node1;
            }

            if (next_node && !visited(next_node, path)) {
                sub = [next_node];
                sub.push(...path);
                findNewCycles(sub);
            } else if (path.length > 2 && next_node === path[path.length - 1]) {
                let p = rotateToSmallest(path);
                let inv = invert(p);

                if (isNew(p) && isNew(inv)) {
                    cycles.push(p);
                }
            }
        }
    }

    function invert(path) {
        return rotateToSmallest(path.slice().reverse());
    }

    function rotateToSmallest(path) {
        let n = path.indexOf(Math.min(...path));
        return path.slice(n).concat(path.slice(0, n));
    }

    function isNew(path) {
        return !cycles.some(cycle => JSON.stringify(cycle) === JSON.stringify(path));
    }

    function visited(node, path) {
        return path.includes(node);
    }

    for (let edge of graph) {
        for (let node of edge) {
            findNewCycles([node]);
        }
    }
    console.log(graph)
    console.log(cycles)

    for (let cy of cycles) {
        console.log(cy);
    }



}