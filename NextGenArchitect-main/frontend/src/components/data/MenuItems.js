// Menu items data for floorplan generation
export const initial_menuItems = [
    {
        id: '1',
        alt: 'wall',
        name: 'Wall',
        width: 10,
        height: 100,
        rotation: 0,
        keepRatio: false,
        enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
    },
    {
        id: '2', 
        alt: 'door',
        name: 'Door',
        width: 80,
        height: 10,
        rotation: 0,
        keepRatio: true,
        enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
    },
    {
        id: '3',
        alt: 'window',
        name: 'Window', 
        width: 60,
        height: 10,
        rotation: 0,
        keepRatio: true,
        enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
    },
    {
        id: '4',
        alt: 'bathroom',
        name: 'Bathroom',
        width: 100,
        height: 100,
        rotation: 0,
        keepRatio: false,
        enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
    },
    {
        id: '5',
        alt: 'bedroom',
        name: 'Bedroom',
        width: 120,
        height: 120,
        rotation: 0,
        keepRatio: false,
        enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
    },
    {
        id: '6',
        alt: 'kitchen',
        name: 'Kitchen',
        width: 100,
        height: 100,
        rotation: 0,
        keepRatio: false,
        enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
    },
    {
        id: '7',
        alt: 'living room',
        name: 'Living Room',
        width: 150,
        height: 120,
        rotation: 0,
        keepRatio: false,
        enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
    }
];