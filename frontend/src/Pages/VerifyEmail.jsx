import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Avatar from "../components/Avatar";
import { useDispatch } from "react-redux";
import { setToken } from "../store/Reducers/userSlice";
import Loader from "../components/Loader";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    email: "",
    verificationCode: "",
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

    const Url = `${process.env.REACT_APP_BACKEND_URL}/api/v1/verifyemail`;

    try {
      setLoading(true);
      const response = await axios.post(Url, {
        email: location?.state?.email,
        verificationCode: data.verificationCode,
      });

      setLoading(false);

      toast.success(response?.data?.message);

      if (response.data.success) {
        dispatch(setToken(response?.data?.token));
        localStorage.setItem("token", response?.data?.token);

        setData({
          verificationCode: "",
        });
      }

      navigate("/");
    } catch (error) {
      setLoading(false);

      if (error.response && error.response.data) {
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error occurred:", error.message);
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    if (!location.state?.name) {
      navigate("/email");
    }
  }, [location.state?.name, navigate]);

  return (
    <div className="flex items-center justify-center bg-gradient-to-r from-violet-800 to-indigo-700 h-[90vh]">
      <div className="w-full md:w-1/3 bg-white p-8 rounded-lg shadow-lg border border-gray-100 overflow-hidden">
        <div className="w-fit mx-auto mb-4 flex justify-center items-center flex-col">
          <Avatar
            width={70}
            height={70}
            name={location?.state?.name}
            imageUrl={location?.state?.profile_pic}
          />
          <h2 className="font-semibold text-xl mt-2 text-gray-700">{location?.state?.name}</h2>
        </div>
        <h3 className="text-2xl font-bold text-center text-indigo-600">Welcome to OptaCloud</h3>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="flex flex-col">
            <label htmlFor="verificationCode" className="text-gray-600 font-medium">OTP :</label>
            <input
              type="text"
              id="verificationCode"
              placeholder="Enter your OTP"
              name="verificationCode"
              className="bg-gray-100 p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
              value={data.verificationCode}
              onChange={handleChange}
              required
            />
          </div>

          <button className="w-full py-3 bg-indigo-600 text-white rounded-lg text-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400">
            {loading ? <Loader /> : "Verify"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          <Link to={"/forgot-password"} className="text-indigo-600 hover:text-indigo-700 font-semibold">
            Forgot Password?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
