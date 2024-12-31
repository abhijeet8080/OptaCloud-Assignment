import React, { useState,useEffect } from 'react';
import BasicModal from '../components/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {setUser,logout} from "../store/Reducers/userSlice"
const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/email");
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const Url = `${process.env.REACT_APP_BACKEND_URL}/api/v1/user-details`;
      const response = await axios.get(Url, config);
      // //console.log(response)
      dispatch(setUser(response?.data?.data));
      
    } catch (error) {
      //console.log(error)
      if(error?.response?.data?.logout){
        dispatch(logout());
        navigate('/email');
      }
      if (error?.response && error?.response?.data) {
        //console.log("Error message:", error?.response?.data?.message);
        navigate("/email");
      } else {
        console.error("Error occurred:", error?.message);
        navigate("/email");
      }
    }
  };
  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage:
          "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
      }}
    >
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">Hello there</h1>
          <p className="mb-5">
          Easily manage your delivery and billing addresses for a seamless shopping experience. Make sure your addresses are up to date for quick and accurate deliveries.
          </p>
          
          <BasicModal
            open={isModalOpen}
            setOpen={setIsModalOpen}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
