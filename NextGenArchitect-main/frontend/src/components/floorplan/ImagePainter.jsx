import React, { useContext } from 'react';
import { DrawingBoardContext } from "../../context/DrawingBoardContext";
import { Stage, Layer, Image, Transformer } from 'react-konva';
import useImage from 'use-image';


const ImageObject = ({ shapeProps, isSelected, onSelect, setImageChanged, ImageChanged, onChange, attributeTrack }) => {
    const shapeRef = React.useRef();
    const trRef = React.useRef();

    const [img] = useImage(shapeProps.url);
    React.useEffect(() => {
        if (isSelected) {
            // we need to attach transformer manually
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    return (
        <React.Fragment>
            <Image
                image={img}
                onClick={onSelect}
                //onDragMove={onSelect}
                onTap={onSelect}
                ref={shapeRef}
                {...shapeProps}
                draggable
                onDragEnd={(e) => {
                    onChange({
                        ...shapeProps,
                        x: e.target.x(),
                        y: e.target.y(),
                    });
                    attributeTrack({ x: e.target.x(), y: e.target.y(), w: Math.max(5, e.target.width() * e.target.scaleX()), h: Math.max(5, e.target.height() * e.target.scaleY()), angle: e.target.rotation() })
                    setImageChanged(ImageChanged + 1)

                }}

                onDragMove={(e) => {
                    onSelect()
                    attributeTrack({ x: e.target.x(), y: e.target.y(), w: Math.max(5, e.target.width() * e.target.scaleX()), h: Math.max(5, e.target.height() * e.target.scaleY()), angle: e.target.rotation() })
                    setImageChanged(ImageChanged + 1)

                }}

                onTransform={(e) => {
                    const node = shapeRef.current;
                    attributeTrack({ x: node.x(), y: node.y(), w: Math.max(5, node.width() * node.scaleX()), h: Math.max(5, node.height() * node.scaleY()), angle: node.rotation() })
                    setImageChanged(ImageChanged + 1)

                }}

                onTransformEnd={(e) => {
                    // transformer is changing scale of the node
                    // and NOT its width or height
                    // but in the store we have only width and height
                    // to match the data better we will reset scale on transform end
                    console.log("On Transform end called")

                    const node = shapeRef.current;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    // we will reset it back
                    node.scaleX(1);
                    node.scaleY(1);
                    onChange({
                        ...shapeProps,
                        x: node.x(),
                        y: node.y(),
                        rotation: node.rotation(),
                        // set minimal value
                        width: Math.max(5, node.width() * scaleX),
                        height: Math.max(node.height() * scaleY),
                    });
                    attributeTrack({ x: node.x(), y: node.y(), w: Math.max(5, node.width() * scaleX), h: Math.max(node.height() * scaleY), angle: node.rotation() })
                    setImageChanged(ImageChanged + 1)

                }}

            />
            {isSelected && (
                <Transformer
                    ref={trRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        // limit resize
                        if (newBox.width < 10 || newBox.height < 10) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                    rotationSnaps={[0, 90, 180, 270]}
                    keepRatio={shapeProps.keepRatio}
                    enabledAnchors={shapeProps.enabledAnchors}
                    rotationSnapTolerance={10}
                />
            )}
        </React.Fragment>
    );
};

export const ImagePainter = (props) => {
    const { ImageObjects } = props;
    const { setImageObjects } = props;
    const { setSelectedItemCoordinates } = props;
    const { setImageChanged } = props
    const { ImageChanged } = props
    const { exportData } = props
    const dbContext = useContext(DrawingBoardContext);
    return (
        <>

            {
                ImageObjects.map((rect, i) => {
                    return (

                        <ImageObject
                            key={i}
                            shapeProps={rect}
                            isSelected={rect.id === dbContext.selectedImgInstance}
                            onSelect={() => {
                                dbContext.setSelectedImgInstance(rect.id)
                                setSelectedItemCoordinates({ x: rect.x, y: rect.y, w: rect.width, h: rect.height, angle: rect.rotation });

                            }}

                            setImageChanged={setImageChanged}
                            ImageChanged={ImageChanged}
                            onChange={(newAttrs) => {
                                const rects = ImageObjects.slice();
                                rects[i] = newAttrs;

                                setImageObjects(rects);
                                dbContext.setSelectedImgInstance(rect.id)
                                for (let i = 0; i < exportData.length; i++) {
                                    if (exportData[i].id === rect.id) {
                                        exportData[i].x = newAttrs.x;
                                        exportData[i].y = newAttrs.y;
                                        exportData[i].width = newAttrs.width;
                                        exportData[i].height = newAttrs.height;
                                        exportData[i].rotation = newAttrs.rotation;
                                        exportData[i].keepRatio = newAttrs.keepRatio;
                                        exportData[i].enabledAnchors = newAttrs.enabledAnchors;
                                    }

                                }

                            }}
                            attributeTrack={(newAttrs) => {
                                setSelectedItemCoordinates(newAttrs)
                            }}
                            
                        />
                        
                        );
                })
            }
        </>

    );
};
