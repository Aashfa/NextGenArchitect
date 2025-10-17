import React from 'react';
import Navbar from '../user/Navbar';
// Authentication removed from floorplan generation
import { useNavigate } from 'react-router-dom';

const NavigationUI = () => {
  // Authentication removed
  const navigate = useNavigate();

  const logoutHandler = () => {
    // Authentication removed - simple navigation
    navigate("/", { replace: true });
  }
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {

    setMobileOpen(!mobileOpen);
  };
  return (
    <>
      <Navbar
        logoutHandler={logoutHandler}
        handleDrawerToggle={handleDrawerToggle}
      />

    </>
  );
};

export default NavigationUI;