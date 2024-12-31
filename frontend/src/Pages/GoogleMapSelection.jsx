import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCoordinates, setSelectedLocation } from '../store/Reducers/locationSlice'
import {Link} from "react-router-dom"
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
const GoogleMapSelection = () => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [address, setAddress] = useState('');
  const mapRef = useRef(null);

  const dispatch = useDispatch(); // Redux dispatch
  const coordinates = useSelector((state) => state?.location?.coordinates); // Redux coordinates

  const geocodeLatLng = (latLng) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          setAddress(results[0].formatted_address);
          dispatch(setSelectedLocation(results[0].formatted_address)); // Update Redux selected location
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  };

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => initializeMap();
      script.onerror = () => {
        window.alert('Failed to load Google Maps. Please check your API key.');
      };
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      const defaultCenter = { lat: -34.397, lng: 150.644 }; // Default location

      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 12, // Adjusted zoom level for better visibility
      });

      const markerInstance = new window.google.maps.Marker({
        map: mapInstance,
        draggable: true,
        position: defaultCenter,
      });

      mapInstance.addListener('click', (event) => {
        const latLng = event.latLng.toJSON();
        markerInstance.setPosition(event.latLng);
        setMarker(markerInstance);
        geocodeLatLng(event.latLng);
        dispatch(setCoordinates({ latitude: latLng.lat, longitude: latLng.lng })); // Update Redux coordinates
      });

      markerInstance.addListener('dragend', (event) => {
        const latLng = event.latLng.toJSON();
        geocodeLatLng(event.latLng);
        dispatch(setCoordinates({ latitude: latLng.lat, longitude: latLng.lng })); // Update Redux coordinates
      });

      setMap(mapInstance);
      setMarker(markerInstance);
    };

    loadGoogleMaps();
  }, [dispatch]);

  // Update marker and recenter map when coordinates from Redux change
  useEffect(() => {
    if (coordinates.latitude && coordinates.longitude && map && marker) {
      const newPosition = {
        lat: parseFloat(coordinates.latitude),
        lng: parseFloat(coordinates.longitude),
      };
      marker.setPosition(newPosition); // Update marker position
      map.setCenter(newPosition); // Center map to new position
    }
  }, [coordinates, map, marker]);

  const locateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map.setCenter(pos);
          marker.setPosition(pos);
          geocodeLatLng(pos);
          dispatch(setCoordinates({ latitude: pos.lat, longitude: pos.lng })); // Update Redux coordinates
        },
        (error) => {
          window.alert('Error: Unable to access location.');
        }
      );
    } else {
      window.alert("Your browser doesn't support geolocation.");
    }
  };

  return (
    <div className='flex flex-col justify-center items-center h-[90vh]'>
      <div
        className='h-[500px] w-full mb-[10px] border-r-[10px]'
        ref={mapRef}
        style={{
          border: '1px solid #ccc',
        }}
      ></div>
      <button
        className='w-60 px-[20px] py-[10px] bg-[#007BFF] text-white border-none border-r-[5px] cursor-pointer'
        onClick={locateMe}
      >
        Locate Me
      </button>
      <p style={{ marginTop: '10px' }}>
        <strong>Selected Address:</strong> {address || 'No address selected yet'}
      </p>
      <div className='w-full flex justify-end'>
        <Link to={'/delivery-address'} className='w-28 px-[20px] py-[10px] bg-sky-500 mr-5 text-white border-none border-r-[5px] cursor-pointer rounded-md'>Next <NavigateNextIcon /></Link>
      </div>
    </div>
  );
};

export default GoogleMapSelection;
