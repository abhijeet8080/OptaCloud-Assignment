import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from 'react-hot-toast';
import { PiUserCircleLight } from "react-icons/pi";
import { logout, setUser } from "../store/Reducers/userSlice";

const CheckEmailPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const Url = `${process.env.REACT_APP_BACKEND_URL}/api/v1/email`;
    try {
      const response = await axios.post(Url, data);
      console.log(response.data); // Log the response to see its structure
      toast.success(response.data.message);

      if (response.data.success) {
        setData({ email: "" });
        navigate("/password", {
          state: response?.data?.data
        });
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error?.response?.data?.message);
      } else {
        console.error('Error occurred:', error.message);
        toast.error(error.message);
      }
    }
  };

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const Url = `${process.env.REACT_APP_BACKEND_URL}/api/v1/user-details`;
      const response = await axios.get(Url, config);

      if (response?.data?.success) {
        dispatch(setUser(response?.data?.data));
        navigate('/');
      }
    } catch (error) {
      if (error?.response?.data?.logout) {
        dispatch(logout());
        navigate('/email');
      }
      if (error?.response && error?.response?.data) {
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
    <>
      <div className="bg-gradient-to-r from-purple-700 to-blue-600 h-[90vh] flex items-center justify-center">
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg opacity-90">
          <div className="w-fit mx-auto mb-4">
            <PiUserCircleLight size={80} className="text-purple-700" />
          </div>
          <h3 className="text-2xl font-semibold text-center text-gray-800">Welcome to OptaCloud</h3>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                className="bg-gray-100 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Please enter your email"
                value={data.email}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition duration-300 ease-in-out"
            >
              Enter
            </button>
          </form>

          <p className="my-4 text-center text-gray-600">
            New User? <Link to="/register" className="text-purple-600 hover:text-purple-700 font-semibold">Register</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default CheckEmailPage;
