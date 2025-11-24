import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../lib/axiosInstance";
import { Eye as EyeIcon, EyeOff as EyeOffIcon } from "lucide-react"; 
import { motion } from "framer-motion";

const Login = () => { 
    const navigate = useNavigate();
    const { login, isAuthenticated, user } = useAuth();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");   
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Toggle password visibility state
    const [showPassword, setShowPassword] = useState(false); 

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && user) {
            // Redirect based on role
            if (user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }
        }
    }, [isAuthenticated, user, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();

        console.log('Sign in with:', { email }); 
        setError(null);
        setIsSubmitting(true);

        try {
            // Login with Supabase Auth through AuthContext
            const result = await login(email, password);

            if (!result.success) {
                throw new Error(result.error);
            }

            // Check user verification status through backend
            const response = await axiosInstance.get("/auth/me");
            const userData = response.data.user;

            if (!userData.status) {
                setError("Your account is pending admin approval");
                setIsSubmitting(false);
                return;
            }

            // Redirect based on role
            if (userData.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }

        } catch (err) {
            console.error("Login error:", err);
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.message) {
                setError(err.message);
            } else {
                setError("Login failed. Please check your credentials.");
            }
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-row bg-gray-50 w-screen min-h-screen"> 
    
            {/* LEFT SIDE - Image */}
            <motion.div 
                key="image-panel"
                initial={{ opacity: 0, x: -50 }} 
                animate={{ opacity: 1, x: 0 }}   
                exit={{ opacity: 0, x: -50 }}    
                transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }} 
                className="w-1/2 flex items-center justify-center relative overflow-hidden">
                
                {/* Background Image */}
                <img 
                    src="/bldg.png" 
                    alt="Abstract medical background" 
                    className="absolute inset-0 w-full h-full object-cover filter blur-xs"/>

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-blue-900/80"></div> 
                
                {/* Header */}
                <div className="relative z-10 text-white text-center p-8">
                    <h1 className="text-5xl font-extrabold mb-2">ADZU Health Management System</h1>
                    <p className="text-xl font-normal mt-4 tracking-wide">Dedicated to Wellness, Guided by Faith.</p>
                </div>
            </motion.div> 
    
            {/* 2. RIGHT SIDE */}
            <motion.div
                key="form-panel"
                initial={{ opacity: 0, x: 50 }} 
                animate={{ opacity: 1, x: 0 }}  
                exit={{ opacity: 0, x: 50 }}   
                transition={{ duration: 0.3, ease: "easeOut" }} 
                className="w-1/2 flex items-center justify-center bg-white shadow-2xl relative"
            >
                
                {/* Form Container */}
                <div className="w-full px-16 py-12"> 
                    
                    {/* Small Logo */}
                    <div className="mb-2">
                        <img 
                            src="/logo.png" 
                            alt="Logo" 
                            className="h-16 w-16 object-contain" 
                        />
                    </div>

                    {/* Title Section */}
                    <div className="flex flex-col mb-8"> 
                        <h2 className="text-4xl font-bold mb-3 text-gray-800">Sign In</h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Welcome back! Access your health records and services.
                        </p>
                        {/* Error Message */}
                        {error && (
                            <div className="mt-6 p-3 bg-red-50 border border-red-300 rounded-md">
                                <p className="text-sm text-red-700 font-medium">
                                    {error}
                                </p>
                            </div>
                        )}
                    </div> 

                    {/* Form */}
                    <form onSubmit={handleLogin} className="flex flex-col gap-y-6">
                        
                        {/* Email Field */}
                        <div className="flex flex-col gap-y-2"> 
                            <label htmlFor="email" className="font-semibold text-base text-gray-700">Email</label>
                            <Input 
                                id="email"
                                type="email"
                                placeholder="e.g. juan@adzu.edu.ph" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 bg-gray-50 border-gray-300 rounded-lg shadow-sm transition-all duration-200 
                                           focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                                required
                            />
                        </div> 

                        {/* Password Field with Toggle */}
                        <div className="flex flex-col gap-y-2"> 
                            <div className="flex justify-between items-center">
                                <label htmlFor="password" className="font-semibold text-base text-gray-700">Password</label>
                            </div>
                            
                            <div className="relative">
                                <Input 
                                    id="password"
                                    type={showPassword ? "text" : "password"} // Toggled type
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-12 bg-gray-50 pr-10 border-gray-300 rounded-lg shadow-sm transition-all duration-200 
                                               focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                                    required
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)} // Toggle function
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                    aria-label={showPassword ? "Hide password" : "Show password"}>
                                    {showPassword ? (
                                        <EyeOffIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            
                            <div className="flex justify-end mt-1">
                                <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                        </div> 

                        <div className="flex flex-col gap-y-3 mt-4"> 
                            {/* Sign In Button */}
                            <Button 
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-lg shadow-md transition-all duration-200 hover:shadow-lg disabled:opacity-60">
                                {isSubmitting ? "Signing In..." : "Sign In"}
                            </Button>
                            
                            {/* Register Link */}
                            <div className="text-center mt-4">
                                <p className="text-gray-600">
                                    Don't have an account?{' '}
                                    <Link 
                                        to="/register" 
                                        className="text-blue-600 hover:text-blue-700 font-semibold underline-offset-4 hover:underline transition-colors">
                                        Register here
                                    </Link>
                                </p>
                            </div>
                        </div>

                    </form>

                </div>
            </motion.div> 

        </div>
    )
}
export default Login;