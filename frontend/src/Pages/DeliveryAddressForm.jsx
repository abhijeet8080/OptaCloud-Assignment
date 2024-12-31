import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PlaceIcon from '@mui/icons-material/Place';
import HomeIcon from '@mui/icons-material/Home';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import GroupIcon from '@mui/icons-material/Group';
import { setDeliveryAddress } from '../store/Reducers/locationSlice';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DeliveryAddressForm = () => {
    const selectedLocation = useSelector(state => state?.location?.selectedLocation);
    const coordinates = useSelector(state => state?.location?.coordinates);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [address, setAddress] = useState({
        flatDetails: '',
        areaDetails: '',
        category: 'Home', // Default category
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress({
            ...address,
            [name]: value,
        });
    };

    const handleCategoryChange = (category) => {
        setAddress({
            ...address,
            category: category,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Authentication token is missing');
            return;
        }
    
        const payload = {
            ...address,
            coordinates: {
                latitude: coordinates?.latitude || 0,
                longitude: coordinates?.longitude || 0,
            },
            isFavourite: false,
            token:token // You can adjust this based on your logic
        };
        console.log(payload)
        const url = `${process.env.REACT_APP_BACKEND_URL}/api/v1/create-address`;
    
        try {
            
            const response = await axios.post(url, payload);
            toast.success('Address saved successfully!');
            dispatch(setDeliveryAddress(payload)); // Dispatch the address to redux store
            navigate('/success');
        } catch (error) {
            toast.error(error?.response?.data?.error || 'Something went wrong');
        }
    };
    

    return (
        <div className="h-[80vh] w-full flex flex-col items-center justify-center">
            <h2>
                <PlaceIcon /> {selectedLocation || 'Select Location'}
            </h2>
            <form
                onSubmit={handleSubmit}
                className="max-w-md mx-auto p-6 rounded-lg shadow-lg w-full bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40 border border-gray-100"
            >
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="flatDetails">
                        House/Flat/Block No.
                    </label>
                    <input
                        type="text"
                        name="flatDetails"
                        value={address.flatDetails}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="areaDetails">
                        Apartment/Road/Area
                    </label>
                    <input
                        type="text"
                        name="areaDetails"
                        value={address.areaDetails}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Category</label>
                    <div className="flex space-x-4">
                        <button
                            type="button"
                            onClick={() => handleCategoryChange('Home')}
                            className={`px-4 py-2 rounded-lg flex items-center ${address.category === 'Home' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                            <HomeIcon className="mr-2" />
                            Home
                        </button>
                        <button
                            type="button"
                            onClick={() => handleCategoryChange('Office')}
                            className={`px-4 py-2 rounded-lg flex items-center ${address.category === 'Office' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                            <BusinessCenterIcon className="mr-2" />
                            Office
                        </button>
                        <button
                            type="button"
                            onClick={() => handleCategoryChange('Friends')}
                            className={`px-4 py-2 rounded-lg flex items-center ${address.category === 'Friends' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                            <GroupIcon className="mr-2" />
                            Friends
                        </button>
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Save Address
                </button>
            </form>
        </div>
    );
};

export default DeliveryAddressForm;
