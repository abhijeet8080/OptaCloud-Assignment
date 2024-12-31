import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Avatar from "../components/Avatar";
import { useDispatch } from "react-redux";
import { setToken } from "../store/Reducers/userSlice";
import Loader from "../components/Loader.jsx";

const CheckPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [data, setData] = useState({
    userId: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const navigateToForgotPassword = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    const Url = `${process.env.REACT_APP_BACKEND_URL}/api/v1/forgot-password`;
    try {
      const response = await axios.post(Url, {
        email: location?.state?.email,
      });
      toast.success(response?.data?.message);
      setLoading(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const Url = `${process.env.REACT_APP_BACKEND_URL}/api/v1/password`;
    try {
      const response = await axios.post(Url, {
        userId: location?.state?._id,
        password: data.password,
      });
      toast.success(response?.data?.message);
      if (response.data.success) {
        dispatch(setToken(response?.data?.token));
        localStorage.setItem("token", response?.data?.token);
        setData({
          password: "",
        });
      }
      navigate("/");
    } catch (error) {
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
      navigate("/checkMail");
    }
  });

  return (
    <>
      <div className=" bg-gradient-to-r from-purple-700 to-blue-600 h-[90vh] flex items-center justify-center">
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-xl opacity-90">
          <div className="w-fit mx-auto mb-4 flex justify-center items-center flex-col">
            <Avatar
              width={70}
              height={70}
              name={location?.state?.name}
              imageUrl={location?.state?.profile_pic}
            />
            <h2 className="font-semibold text-lg mt-2 text-center text-gray-800">
              {location?.state?.name}
            </h2>
          </div>
          <h3 className="text-xl font-medium text-center text-gray-800">
            Welcome to OptaCloud
          </h3>

          <form className="grid gap-6 mt-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="bg-gray-100 text-black px-4 py-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Please enter your password"
                value={data.password}
                onChange={handleChange}
                required
              />
            </div>

            {!loading && (
              <button
                type="submit"
                className="w-full py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition duration-300 ease-in-out"
              >
                Verify
              </button>
            )}
          </form>

          <p className="my-3 text-center text-gray-600">
            {loading ? (
              <Loader />
            ) : (
              <button
                onClick={navigateToForgotPassword}
                className="text-purple-600 hover:text-purple-700 font-semibold"
              >
                Forgot Password?
              </button>
            )}
          </p>
        </div>
      </div>
    </>
  );
};

export default CheckPasswordPage;
