import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import uploadFile from "../Helper/uploadFile";
import axios from "axios";
import toast from 'react-hot-toast';
import Loader from "../components/Loader";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: "",
  });
  const [uploadPhoto, setUploadPhoto] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    const uploadPhoto = await uploadFile(file);
    setUploadPhoto(file);

    setData((prev) => ({
      ...prev,
      profile_pic: uploadPhoto?.url,
    }));
  };

  const handleClearUploadPhoto = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setUploadPhoto(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const emailDomain = data.email.split('@')[1]; // Get everything after the '@'
    const restrictedDomains = ['viit.ac.in', 'vupune.ac.in', 'vit.edu'];

    if (restrictedDomains.includes(emailDomain)) {
      toast.error('Registrations from this domain are not allowed.');
      return; 
    }

    const Url = `${process.env.REACT_APP_BACKEND_URL}/api/v1/register`;
    try {
      setLoading(true);

      const response = await axios.post(Url, data);
      setLoading(false);

      toast.success(response?.data?.message);
      if (response.data.success) {
        setData({
          name: '',
          email: '',
          password: '',
          profile_pic: '',
        });
      }

      navigate('/verifyMail', {
        state: response?.data?.data,
      });
    } catch (error) {
      setLoading(false);

      if (error.response && error.response.data) {
        toast.error(error?.response?.data?.message);
      } else {
        console.error('Error occurred:', error.message);
        toast.error(error.message);
      }
    }
  };

  return (
    <>
      <div className=" bg-gradient-to-r from-purple-700 to-blue-600 h-[90vh] flex items-center justify-center">
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-xl opacity-90">
          <h3 className="text-center text-2xl font-semibold text-gray-800">
            Welcome to OptaCloud
          </h3>

          <form className="grid gap-6 mt-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Please Enter your name"
                className="bg-gray-100 px-4 py-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={data.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Please Enter your email"
                className="bg-gray-100 px-4 py-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={data.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Please Enter your password"
                className="bg-gray-100 px-4 py-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={data.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="profile_pic" className="text-sm font-medium text-gray-700">
                Photo:
                <div className="h-14 bg-gray-200 flex cursor-pointer justify-center items-center border rounded-md hover:border-purple-600">
                  <p className="text-sm max-w-[300px] text-ellipsis line-clamp-1">
                    {uploadPhoto?.name ? uploadPhoto.name : "Upload Profile Photo"}
                  </p>
                  {uploadPhoto?.name && (
                    <button
                      className="text-lg ml-2 text-red-600 hover:text-red-700"
                      onClick={handleClearUploadPhoto}
                      type="button"
                    >
                      <IoIosClose />
                    </button>
                  )}
                </div>
              </label>
              <input
                type="file"
                id="profile_pic"
                name="profile_pic"
                className="bg-gray-100 px-2 py-1 hidden"
                onChange={handleUploadPhoto}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition duration-300 ease-in-out"
            >
              {loading ? <Loader /> : "Register"}
            </button>
          </form>

          <p className="my-3 text-center text-gray-600">
            Already have an account?{" "}
            <Link to={"/email"} className="text-purple-600 hover:text-purple-700 font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
