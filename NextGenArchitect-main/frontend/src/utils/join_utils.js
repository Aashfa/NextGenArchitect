
//
//    p1____________________p2
//     |                    |
//     |                    |
//     |                    |
//     |____________________|
//    p3                    p4

export const CoordinateTranslator = (x, y, w, h, angle, type) => {

    var coords = []
    
    //p1
    coords.push([x, y])

    //p2
    coords.push([x + (w * Math.cos(angle * (Math.PI / 180))), y + (w * Math.sin(angle * (Math.PI / 180)))])


    //p3
    var x3 = x - (h * Math.cos((angle + 270) * (Math.PI / 180)))
    var y3 = y - (h * Math.sin((angle + 270) * (Math.PI / 180)))
    coords.push([x3, y3])

    //p4
    coords.push([x3 + (w * Math.cos((angle) * (Math.PI / 180))), y3 + (w * Math.sin((angle) * (Math.PI / 180)))])
    if(type=="Door")
    {
        var p1=[(coords[0][0] + coords[1][0]) / 2, (coords[0][1] + coords[1][1]) / 2]
        // midpoint of p2 and p4
        var p2=[(coords[2][0] + coords[3][0]) / 2, (coords[2][1] + coords[3][1]) / 2]
        coords=[]
        coords.push(p1)
        coords.push(p2)
    }
    
    if (type != "Door") {

        if (type != "Connector") {
            // midpoint of p1 and p3
           // coords.push([(coords[0][0] + coords[2][0]) / 2, (coords[0][1] + coords[2][1]) / 2])
            // midpoint of p2 and p4
            //coords.push([(coords[1][0] + coords[3][0]) / 2, (coords[1][1] + coords[3][1]) / 2])


        }
        // midpoint of p1 and p2
        coords.push([(coords[0][0] + coords[1][0]) / 2, (coords[0][1] + coords[1][1]) / 2])

        // midpoint of p3 and p4
        coords.push([(coords[2][0] + coords[3][0]) / 2, (coords[2][1] + coords[3][1]) / 2])


        if (type == 'Wall' ) {
            var step = 5
            var xt1 = 0
            var yt1 = 0
            var xt2 = 0
            var yt2 = 0

            var edgeAvoidance = 2

            for (var i = edgeAvoidance * step; i < h - edgeAvoidance * step; i += step) {

                //generating points btwn p1 and p3
                xt1 = x - (i * Math.cos((angle + 270) * (Math.PI / 180)))
                yt1 = y - (i * Math.sin((angle + 270) * (Math.PI / 180)))                
              //  coords.push([xt1, yt1])

                //generating points btwn p2 and p4
                xt2 = coords[1][0] - (i * Math.cos((angle + 270) * (Math.PI / 180)))
                yt2 = coords[1][1] - (i * Math.sin((angle + 270) * (Math.PI / 180)))
              //  coords.push([xt2, yt2])

                //pushing mid points 
                coords.push([(xt1+xt2)/2, (yt1+yt2)/2])

            }
            
        }
    }
    if( type=="Wall")
    {   
        coords.shift()
        coords.shift()
        coords.shift()
        coords.shift()
    }
    return coords


};
export const checkJoins = (coord1, coord2) => {

    if (Math.abs(coord1[0] - coord2[0]) < 5 && Math.abs(coord1[1] - coord2[1]) < 5) {
        return true
    }
    else {
        return false
    }

};
export const checkEdgeConnections = (x, y, image) => {

    var coords1 = CoordinateTranslator(image.x, image.y, image.width, image.height, image.rotation, "Connector")
    for (var i = 0; i < coords1.length; i++) {
        if (checkJoins([x, y], coords1[i])) {
            return true
        }

    }
    return false
}

export const specifyEdgeConnection = (x, y, image) => {

    var coords1 = CoordinateTranslator(image.x, image.y, image.width, image.height, image.rotation, "Connector")
    for (var i = 0; i < coords1.length; i++) {
        if (checkJoins([x, y], coords1[i])) {
            if (i == 0 || i == 1 || i == 4) {
                return "top"
            }
            else {
                return "bottom"
            }
        }

    }
    return false
}

export const checkIds = (id1, id2, coord1, Joins) => {

    if (id1 == null || id2 == null) {
        return false
    }
    if (id1 > id2) {
        var temp = id1
        id1 = id2
        id2 = temp
    }

    for (var i = 0; i < Joins.length; i++) {
        if (id1 == Joins[i].img1Id && id2 == Joins[i].img2Id) {
            if (checkJoins(coord1, [Joins[i].x, Joins[i].y])) {
                return false
            }
        }
    }
    return true
};
export const findElement = (arr, propName, propValue) => {
    for (var i = 0; i < arr.length; i++)
        if (arr[i][propName] == propValue)
            return arr[i];

    return null
}
export const findEntry = (arr, entry) => {

    for (var i = 0; i < arr.length; i++) {
        if (JSON.stringify(arr[i][0]) === JSON.stringify(entry)) {

            return i
        }
    }
}

export const checkInclusion = (arr, entry) => {

    for (var i = 0; i < arr.length; i++) {
        if (JSON.stringify(arr[i]) === JSON.stringify(entry)) {
            return true
        }
    }
    return false
}

export const splitBasedonID = (arr) => {
    var tArr = []
    var temp = []
    for (var i = 0; i < arr.length; i++) {
        if (checkInclusion(temp, { id1: arr[i].img1Id, id2: arr[i].img2Id })) {
            tArr[findEntry(tArr, { id1: arr[i].img1Id, id2: arr[i].img2Id })][1].push([i, arr[i]])
        }
        else {
            temp.push({ id1: arr[i].img1Id, id2: arr[i].img2Id })
            tArr.push([{ id1: arr[i].img1Id, id2: arr[i].img2Id }, [[i, arr[i]]]])
        }
    }
    return tArr
}

export const getDistance = (xA, yA, xB, yB) => {
    var xDiff = xA - xB;
    var yDiff = yA - yB;

    return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}
