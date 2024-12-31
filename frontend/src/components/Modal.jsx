import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {useDispatch} from "react-redux"
import { setCoordinates } from '../store/Reducers/locationSlice';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  borderRadius: 4,
  pt: 2,
  px: 4,
  pb: 3,
};

export default function LocationPermissionModal({open,setOpen }) {
  const navigate = useNavigate();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useDispatch()
  const handleEnableLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Latitute: "+latitude+" Longitude:"+longitude)
          dispatch(setCoordinates({latitude,longitude}))
          setOpen(false); 
          toast.success("Location retrieved successfully!");
          navigate('/address-selection'); 
          
        },
        (error) => {
          console.error("Location access denied or unavailable:", error.message);
          toast.error("Unable to fetch location. Please enable location permissions.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
    }
  };
  

  const handleSearchManually = () => {
    navigate('/address-selection')
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Set Delivery Location
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="location-modal-title"
        aria-describedby="location-modal-description"
      >
        <Box sx={style}>
          <Typography id="location-modal-title" variant="h6" component="h2">
            Location Permission Needed
          </Typography>
          <Typography id="location-modal-description" sx={{ mt: 2 }}>
            To continue, please enable location access or search for your address manually.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button variant="contained" color="success" onClick={handleEnableLocation}>
              Enable Location
            </Button>
            <Button variant="outlined" color="primary" onClick={handleSearchManually}>
              Search Manually
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
