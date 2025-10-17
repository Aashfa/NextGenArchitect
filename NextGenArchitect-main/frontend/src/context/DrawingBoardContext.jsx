import React, { createContext, useState } from 'react';

export const DrawingBoardContext = createContext({
  selectedTool: '',
  setSelectedTool: () => {},
  selectedAsset: {},
  setSelectedAsset: () => {},
  selectedSource: '',
  setSelectedSource: () => {},
  selectedImgInstance: null,
  setSelectedImgInstance: () => {},
  showPagination: false,
  setShowPagination: () => {},
  mapDim: { w: 100, h: 100 },
  setMapDim: () => {},
});

export const DrawingBoardProvider = ({ children }) => {
  const [selectedTool, setSelectedTool] = useState('');
  const [selectedAsset, setSelectedAsset] = useState({});
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedImgInstance, setSelectedImgInstance] = useState(null);
  const [showPagination, setShowPagination] = useState(false);
  const [mapDim, setMapDim] = useState({ w: 100, h: 100 });

  return (
    <DrawingBoardContext.Provider
      value={{
        selectedTool,
        setSelectedTool,
        selectedAsset,
        setSelectedAsset,
        selectedSource,
        setSelectedSource,
        selectedImgInstance,
        setSelectedImgInstance,
        showPagination,
        setShowPagination,
        mapDim,
        setMapDim,
      }}
    >
      {children}
    </DrawingBoardContext.Provider>
  );
};
