import { useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { PiEyeSlash } from "react-icons/pi";
import Logo from "../../../assets/images/logo.png"
import { useNavigate } from "react-router-dom"; 
import { loginUser } from "../../../api/loginApi";

const Login = ({ setIsLoggedIn }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState(""); 
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); 
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    const handleLogin = async (e) => {
        e.preventDefault();
 
        try {
            const data = await loginUser({ phoneNumber, password });
            const { access_token, user } = data;

            sessionStorage.setItem("access_token", access_token);
            sessionStorage.setItem("user", JSON.stringify(user));

            setIsLoggedIn(true);
            navigate("/");

        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong.");
        }
    };
       

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-bg px-2 md:px-4">
            <div className="bg-white rounded-xl shadow-md w-full max-w-md px-5 py-5 md:p-8">
                <div className="mb-6">
                    <img src={Logo} alt="Logo" className="mx-auto w-14 h-14" />
                </div>

                <div className="text-center">
                    <h2 className="text-2xl font-bold text-black-5 mb-1">Sign In</h2>
                    <p className="text-gray-500 mb-6">Welcome back! Please enter your details</p>
                </div>


                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-black-4 mb-1">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Phone Number"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-1"
                            required
                        />
                    </div>

                    <div className="mb-6 relative">
                        <label className="block text-sm font-medium text-black-4 mb-1">
                            Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-1 pr-10"
                            required
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute cursor-pointer top-9 right-3 text-gray-500"
                        >
                            {showPassword ? (
                                <PiEyeSlash className="hide_eye text-lg" />
                            ) : (
                                <IoEyeOutline className="show_eye text-lg" />
                            )}
                        </button>
                    </div>

                    {error && <div className="text-red-1 text-center mb-4">{error}</div>}

                    <button
                        type="submit"
                        className="w-full cursor-pointer bg-red-1 font-bold text-white py-2 rounded-full hover:bg-red-600 transition duration-200"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;