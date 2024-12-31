import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    coordinates:{
        latitude:"",
        longitude:""
    },
    selectedLocation: null,
    deliveryAddress:{
      flatDetails:"",
      areaDetails:"",
      category:""
    },
    savedAddresses: [],
    loading: false,
    error: null,
};

const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {
      setCoordinates:(state,action)=>{
        state.coordinates.latitude = action.payload.latitude;
        state.coordinates.longitude = action.payload.longitude;
      },  
      setDeliveryAddress:(state,action)=>{
        state.deliveryAddress.flatDetails = action.payload.flatDetails;
        state.deliveryAddress.areaDetails = action.payload.areaDetails;
        state.deliveryAddress.category = action.payload.category;
      },
      setSelectedLocation: (state, action) => {
        state.selectedLocation = action.payload;
      },
      setSavedAddresses: (state, action) => {
        state.savedAddresses = action.payload;
      },
      addSavedAddress: (state, action) => {
        state.savedAddresses.push(action.payload);
      },
      setLoading: (state, action) => {
        state.loading = action.payload;
      },
      setError: (state, action) => {
        state.error = action.payload;
      },
    },
  });
  
  export const {
    setCoordinates,
    setDeliveryAddress,
    setSelectedLocation,
    setSavedAddresses,
    addSavedAddress,
    setLoading,
    setError,
  } = locationSlice.actions;
  
  export default locationSlice.reducer;