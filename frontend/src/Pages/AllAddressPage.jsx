import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaHeart, FaRegHeart } from 'react-icons/fa'; // Importing heart icons for favourite
import { FaTrash } from 'react-icons/fa'; // Importing trash icon for delete

const AllAddressPage = () => {
    const [addresses, setAddresses] = useState([]); // State to hold the addresses
    const [loading, setLoading] = useState(true); // State to show loading spinner

    // Fetch all addresses from the backend
    const fetchAllAddresses = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Authentication token is missing');
                return;
            }

            const url = `${process.env.REACT_APP_BACKEND_URL}/api/v1/get-all-addresses`;

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setAddresses(response.data.addresses);
            setLoading(false); // Stop loading spinner when data is fetched
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch addresses');
            setLoading(false); // Stop loading spinner even if there's an error
        }
    };

    // Handle toggle favourite for an address
    const handleFavouriteToggle = async (addressId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Authentication token is missing');
                return;
            }

            const url = `${process.env.REACT_APP_BACKEND_URL}/api/v1/set-favourite/${addressId}`;

            // Send the API request to update the favourite status in the backend
            const response = await axios.post(url, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Update the address in the local state after successful backend update
            setAddresses((prevAddresses) =>
                prevAddresses.map((address) =>
                    address._id === addressId
                        ? { ...address, isFavourite: response.data.address.isFavourite }
                        : address
                )
            );

            toast.success('Favourite status updated successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update favourite status');
        }
    };

    // Handle address deletion
    const handleDeleteAddress = async (addressId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Authentication token is missing');
                return;
            }

            const url = `${process.env.REACT_APP_BACKEND_URL}/api/v1/delete-address/${addressId}`;

            // Send the delete request to the backend
            await axios.delete(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Remove the deleted address from the local state
            setAddresses((prevAddresses) =>
                prevAddresses.filter((address) => address._id !== addressId)
            );

            toast.success('Address deleted successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete address');
        }
    };

    useEffect(() => {
        fetchAllAddresses();
    }, []); // Fetch addresses when the component mounts

    return (
        <div className="w-4/5 mx-auto p-6 h-[100vh]">
            <h1 className="text-3xl font-semibold text-center mb-6">All Addresses</h1>

            {loading ? (
                <div className="text-center text-xl text-gray-500">Loading...</div>
            ) : (
                <div>
                    {addresses.length === 0 ? (
                        <p className="text-center text-xl text-gray-600">No addresses found</p>
                    ) : (
                        <ul className="space-y-4">
                            {addresses.map((address) => (
                                <li key={address._id} className="flex justify-between items-center p-4 border rounded-lg shadow-sm bg-white">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold">{(address.category)}</h3>
                                        <p className="text-sm text-gray-600">{address.flatDetails}, {address.areaDetails}</p>
                                        <p className="text-xs text-gray-500">Latitude: {address.coordinates.latitude}, Longitude: {address.coordinates.longitude}</p>
                                    </div>

                                    {/* Favourite Button */}
                                    <button
                                        className="p-2"
                                        onClick={() => handleFavouriteToggle(address._id)}
                                    >
                                        {address.isFavourite ? (
                                            <FaHeart className="text-red-500 hover:text-red-700 text-2xl" />
                                        ) : (
                                            <FaRegHeart className="text-gray-500 hover:text-red-500 text-2xl" />
                                        )}
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                        className="p-2 text-red-500 hover:text-red-700"
                                        onClick={() => handleDeleteAddress(address._id)}
                                    >
                                        <FaTrash className="text-xl" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default AllAddressPage;
