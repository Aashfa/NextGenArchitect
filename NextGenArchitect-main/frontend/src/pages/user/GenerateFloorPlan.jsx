import React, { useState, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { MdOutlineArrowBack, MdClose } from 'react-icons/md';
import Navbar from '../../components/user/Navbar';
import Footer from '../../components/user/Footer';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { GenerateMap } from '../../services/floorplanService';

// Modal Component for Saving the Project
const SaveProjectModal = ({ isOpen, onClose, onSave, projectName, setProjectName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <MdClose size={24} />
        </button>
        <h2 className="text-xl font-bold mb-6 text-center text-[#2F3D57]">Save Your Floor Plan</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
              Project Name
            </label>
            <input
              type="text"
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g., Dream House"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-[#ED7600] focus:border-transparent transition"
            />
          </div>
          <button
            onClick={onSave}
            disabled={!projectName.trim()}
            className="w-full bg-[#ED7600] hover:bg-[#d46000] text-white py-3 rounded-lg font-medium transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Save as PDF
          </button>
        </div>
      </div>
    </div>
  );
};


const GenerateFloorPlan = () => {
  const { societyId, plotId } = useParams();
  const location = useLocation();
//  const navigate = useNavigate();

  const { plotDimensions } = location.state || { plotDimensions: { x: 30, y: 60 } };
  
  const [constraints, setConstraints] = useState({
    plotX: plotDimensions.x,
    plotY: plotDimensions.y,
    bedrooms: 3,
    bathrooms: 2,
    livingRooms: 1,
    kitchens: 1,
  });

  const [show2DMap, setShow2DMap] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatedFloorplans, setGeneratedFloorplans] = useState([]);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  
  // State for the save modal
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  
  // Ref for the floor plan container to capture it for PDF
  const floorPlanRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConstraints(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }));
    setShow2DMap(false);
  };
  
  // Simplified room generation for demonstration
  const generateInitialRooms = () => {
     // This function seems complex and specific to your logic, so I'll keep it as is.
     // In a real scenario, you might want a more robust algorithm.
     const newRooms = [];
     const { bedrooms, bathrooms, livingRooms, kitchens } = constraints;

     // Example logic to place rooms in a somewhat organized way
     //let yOffset = 20;

     if (livingRooms > 0) {
        newRooms.push({ id: 'living-1', label: 'Living', type: 'livingroom', x: 130, y: 150 });
     }
     if (kitchens > 0) {
        newRooms.push({ id: 'kitchen-1', label: 'Kitchen', type: 'kitchen', x: 250, y: 250 });
     }
     if (bathrooms > 0) {
        newRooms.push({ id: 'bath-1', label: 'Bath', type: 'bathroom', x: 50, y: 250 });
     }
     if (bedrooms > 0) {
        newRooms.push({ id: 'br-1', label: 'BR1', type: 'bedroom', x: 50, y: 50 });
     }
     if (bedrooms > 1) {
        newRooms.push({ id: 'br-2', label: 'BR2', type: 'bedroom', x: 250, y: 50 });
     }
     // You can add more rooms based on counts
     setRooms(newRooms);
  };


  const handleView2DMap = async () => {
    setLoading(true);
    try {
      // Build connectors array (empty for now, you may need to collect user input for this)
      const connectors = [];
      
      // Default proportions and percentages (adjust as needed)
      const defaultProportion = 1;
      const defaultPercentage = 100 / 7; // Evenly distribute
      
      const response = await GenerateMap(
        connectors,
        constraints.plotX,
        constraints.plotY,
        constraints.kitchens > 0 ? defaultProportion : 0,
        constraints.livingRooms > 0 ? defaultProportion : 0,
        0, // drawing room
        0, // car porch
        constraints.bathrooms > 0 ? defaultProportion : 0,
        constraints.bedrooms > 0 ? defaultProportion : 0,
        0, // garden
        constraints.kitchens > 0 ? defaultPercentage : 0,
        constraints.livingRooms > 0 ? defaultPercentage : 0,
        0,
        0,
        constraints.bathrooms > 0 ? defaultPercentage : 0,
        constraints.bedrooms > 0 ? defaultPercentage : 0,
        0
      );
      
      console.log('Floorplan generated:', response.data);
      if (response.data.maps && Array.isArray(response.data.maps)) {
        setGeneratedFloorplans(response.data.maps);
        setSelectedPlanIndex(0);
        setShow2DMap(true);
        alert(`Generated ${response.data.maps.length} floorplan options!`);
      } else {
        generateInitialRooms(); // Fallback
        setShow2DMap(true);
        alert('Floorplan generated (fallback mode)');
      }
    } catch (error) {
      console.error('Error generating floorplan:', error);
      alert('Error generating floorplan: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const openSaveModal = () => {
    if (!show2DMap) {
      alert("Please generate the map first before saving!");
      return;
    }
    setIsSaveModalOpen(true);
  };

  const handleSaveAsPdf = () => {
    if (!projectName.trim() || !floorPlanRef.current) return;

    const input = floorPlanRef.current;
    
    html2canvas(input, { scale: 2 }) // Increase scale for better quality
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`${projectName}.pdf`);
        
        // Close modal and reset
        setIsSaveModalOpen(false);
        setProjectName('');
      })
      .catch(err => {
        console.error("Could not generate PDF", err);
        alert("Sorry, an error occurred while generating the PDF.");
      });
  };

  const loadLayout = () => {
    const savedLayout = localStorage.getItem(`floorPlanLayout-${societyId}-${plotId}`);
    if (savedLayout) {
      const { constraints: savedConstraints, rooms: savedRooms } = JSON.parse(savedLayout);
      setConstraints(savedConstraints);
      setRooms(savedRooms);
      setShow2DMap(true);
      alert('Layout loaded successfully!');
    } else {
      alert('No saved layout found for this plot.');
    }
  };


  return (
    <>
      <SaveProjectModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveAsPdf}
        projectName={projectName}
        setProjectName={setProjectName}
      />
      <div className="bg-white min-h-screen text-[#2F3D57] font-sans">
        <div className="sticky top-0 z-40">
          <Navbar />
        </div>

        <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-[#2F3D57]">Floor Plan Generator</h1>
            <div className="flex gap-4">
              <button
                onClick={openSaveModal}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
              >
                Save Layout
              </button>
              <button
                onClick={loadLayout}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition-all"
              >
                Load Layout
              </button>
            </div>
          </div>
          
          <div className="bg-[#F9FAFB] rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
                <div className="bg-[#ED7600] text-white rounded-full h-8 w-8 flex items-center justify-center font-bold text-lg">1</div>
                <h2 className="text-xl font-bold ml-4">Define Constraints</h2>
            </div>
            
            {/* Main Grid */}
            <div className="grid lg:grid-cols-2 gap-10">
              {/* Left Side - Constraints */}
              <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                  <h3 className="text-lg font-semibold mb-4 border-b pb-2">Map Constraints</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                          <label className="block text-sm font-medium mb-1">Plot X Dimension (ft)</label>
                          <input type="number" name="plotX" value={constraints.plotX} onChange={handleInputChange} className="w-full p-2 border rounded-md"/>
                      </div>
                      <div>
                          <label className="block text-sm font-medium mb-1">Plot Y Dimension (ft)</label>
                          <input type="number" name="plotY" value={constraints.plotY} onChange={handleInputChange} className="w-full p-2 border rounded-md"/>
                      </div>
                      <div>
                          <label className="block text-sm font-medium mb-1">Bedrooms</label>
                          <input type="number" name="bedrooms" value={constraints.bedrooms} onChange={handleInputChange} className="w-full p-2 border rounded-md"/>
                      </div>
                      <div>
                          <label className="block text-sm font-medium mb-1">Living Rooms</label>
                          <input type="number" name="livingRooms" value={constraints.livingRooms} onChange={handleInputChange} className="w-full p-2 border rounded-md"/>
                      </div>
                      <div>
                          <label className="block text-sm font-medium mb-1">Bathrooms</label>
                          <input type="number" name="bathrooms" value={constraints.bathrooms} onChange={handleInputChange} className="w-full p-2 border rounded-md"/>
                      </div>
                      <div>
                          <label className="block text-sm font-medium mb-1">Kitchens</label>
                          <input type="number" name="kitchens" value={constraints.kitchens} onChange={handleInputChange} className="w-full p-2 border rounded-md"/>
                      </div>
                  </div>
                  <button 
                    onClick={handleView2DMap} 
                    disabled={loading}
                    className="w-full mt-4 bg-[#ED7600] hover:bg-[#d46000] text-white py-3 rounded-lg font-semibold transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Generating...' : 'Generate Map'}
                  </button>
              </div>

              {/* Right Side - Generated Floorplans */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                    Generated Floorplans {generatedFloorplans.length > 0 && `(${generatedFloorplans.length} options)`}
                  </h3>
                  
                  {/* Navigation buttons */}
                  {generatedFloorplans.length > 1 && (
                    <div className="flex gap-2 mb-4">
                      {generatedFloorplans.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedPlanIndex(index)}
                          className={`px-4 py-2 rounded-md font-medium transition-all ${
                            selectedPlanIndex === index
                              ? 'bg-[#ED7600] text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          Option {index + 1}
                        </button>
                      ))}
                    </div>
                  )}

                   <div ref={floorPlanRef} className="relative w-full h-96 bg-gray-50 border-2 border-dashed rounded-lg overflow-auto">
                      {show2DMap && generatedFloorplans.length > 0 ? (
                          <svg className="w-full h-full" viewBox="0 0 600 600" style={{ background: '#fff' }}>
                            {/* Render the selected floorplan */}
                            {generatedFloorplans[selectedPlanIndex] && generatedFloorplans[selectedPlanIndex].map((row, y) => (
                              row.map((cell, x) => {
                                const roomColors = {
                                  1: '#FF6B6B',    // Kitchen - red
                                  2: '#4ECDC4',    // Living - teal
                                  3: '#95E1D3',    // Drawing - light green
                                  4: '#FFE66D',    // Car porch - yellow
                                  5: '#A8E6CF',    // Bathroom - mint
                                  6: '#C7CEEA',    // Bedroom - purple
                                  7: '#98D8C8',    // Garden - green
                                  0: '#f0f0f0'     // Empty - gray
                                };
                                return cell !== 0 ? (
                                  <rect
                                    key={`${y}-${x}`}
                                    x={x * 10}
                                    y={y * 10}
                                    width={10}
                                    height={10}
                                    fill={roomColors[cell] || '#ccc'}
                                    stroke="#fff"
                                    strokeWidth="0.5"
                                  />
                                ) : null;
                              })
                            ))}
                          </svg>
                      ) : show2DMap && rooms.length > 0 ? (
                          <div className="w-full h-full relative p-4">
                              {/* Fallback dummy visualization */}
                              {rooms.find(r => r.type === 'livingroom') && <div className="absolute w-20 h-20 bg-green-300 rounded-full flex items-center justify-center text-xs" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>LIVING</div>}
                              {rooms.find(r => r.id === 'br-1') && <div className="absolute w-16 h-16 bg-purple-300 rounded-full flex items-center justify-center text-xs" style={{ left: '20%', top: '20%' }}>BR1</div>}
                              {rooms.find(r => r.id === 'br-2') && <div className="absolute w-16 h-16 bg-purple-300 rounded-full flex items-center justify-center text-xs" style={{ right: '20%', top: '20%' }}>BR2</div>}
                              {rooms.find(r => r.id === 'bath-1') && <div className="absolute w-14 h-14 bg-yellow-300 rounded-full flex items-center justify-center text-xs" style={{ left: '30%', bottom: '20%' }}>BATH</div>}
                              {rooms.find(r => r.id === 'kitchen-1') && <div className="absolute w-14 h-14 bg-red-300 rounded-full flex items-center justify-center text-xs" style={{ right: '30%', bottom: '20%' }}>KIT</div>}
                          </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-gray-400">Your floorplan will be generated here</p>
                        </div>
                      )}
                   </div>
                   
                   {/* Legend */}
                   <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-sm">
                      <div className="flex items-center"><div className="w-3 h-3 rounded bg-[#FF6B6B] mr-2"></div>Kitchen</div>
                      <div className="flex items-center"><div className="w-3 h-3 rounded bg-[#4ECDC4] mr-2"></div>Living</div>
                      <div className="flex items-center"><div className="w-3 h-3 rounded bg-[#C7CEEA] mr-2"></div>Bedroom</div>
                      <div className="flex items-center"><div className="w-3 h-3 rounded bg-[#A8E6CF] mr-2"></div>Bathroom</div>
                      <div className="flex items-center"><div className="w-3 h-3 rounded bg-[#95E1D3] mr-2"></div>Drawing</div>
                      <div className="flex items-center"><div className="w-3 h-3 rounded bg-[#98D8C8] mr-2"></div>Garden</div>
                   </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default GenerateFloorPlan;