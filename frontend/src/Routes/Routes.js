import {createBrowserRouter} from "react-router-dom"

import App from "../App"
import Home from "../Pages/Home"
import GoogleMapSelection from "../Pages/GoogleMapSelection"
import DeliveryAddressForm from "../Pages/DeliveryAddressForm"
import CheckEmailPage from "../Pages/CheckEmailPage"
import AuthLayouts from "../Layout/AuthLayout"
import CheckPasswordPage from "../Pages/CheckPasswordPage"
import RegisterPage from "../Pages/RegisterPage"
import VerifyEmail from "../Pages/VerifyEmail"
import SuccessPage from "../Pages/SuccessPage"
import AllAddressPage from "../Pages/AllAddressPage"
import PrivateRoute from "../Layout/PrivateLayout"
export const router = createBrowserRouter([
    {
        path:"/",
        element:<App />,
        children:[
            {
               path:"",
               element:<PrivateRoute><Home/></PrivateRoute>
            },
            {
                path:"address-selection",
                element:<PrivateRoute><GoogleMapSelection/></PrivateRoute>
             },
             {
                path:"delivery-address",
                element:<PrivateRoute><DeliveryAddressForm/></PrivateRoute>
             },
             {
                path:"email",
                element:<AuthLayouts><CheckEmailPage /></AuthLayouts>
             },
             {
               path:"password",
               element:<AuthLayouts><CheckPasswordPage /></AuthLayouts>
            },
            {
               path:"register",
               element:<AuthLayouts><RegisterPage /></AuthLayouts>
            },
            {
               path:"verifyMail",
               element:<AuthLayouts><VerifyEmail/></AuthLayouts>
           },
           {
            path:"success",
            element:<PrivateRoute><SuccessPage /></PrivateRoute>
        },
        {
         path:"all-addresses",
         element:<PrivateRoute><AllAddressPage /></PrivateRoute>
     },
        ]
    }
])

