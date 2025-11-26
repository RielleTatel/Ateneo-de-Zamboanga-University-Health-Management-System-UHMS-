import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../lib/axiosInstance";
import { motion } from "framer-motion";

const Register = () => { 
    const navigate = useNavigate();
    const { register: registerUser } = useAuth();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [middleInitial, setMiddleInitial] = useState("");
    const [familyName, setFamilyName] = useState("");
    const [role, setRole] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); 

    const full_name = `${firstName} ${middleInitial} ${familyName}`.trim();

    const handleRegister = async (e) => {
        e.preventDefault();

        console.log('Register with:', { email, full_name, role }); 
        setError(null);
        setSuccess(false);

        // Frontend validation
        if (!email || !password || !firstName || !familyName || !role) {
            setError("All required fields must be filled out");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        if (!email.includes('@')) {
            setError("Please enter a valid email address");
            return;
        }

        setIsSubmitting(true);

        try {
            // Register through backend API only
            // Convert role to lowercase to match backend expectations
            const response = await axiosInstance.post("/auth/register", { 
                email, 
                password, 
                full_name, 
                role: role.toLowerCase() 
            });

            console.log("Registration successful:", response.data);
            setSuccess(true);
            setIsSubmitting(false);

            // Clear form
            setEmail("");
            setPassword("");
            setFirstName("");
            setMiddleInitial("");
            setFamilyName("");
            setRole("");

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate("/login", { 
                    state: { 
                        message: "Registration successful! Please wait for admin approval before logging in." 
                    } 
                });
            }, 3000);

        } catch (err) {
            console.error('Registration error:', err);
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else if (err.message) {
                setError(err.message);
            } else {
                setError("Registration failed. Please try again.");
            }
            setIsSubmitting(false);
        }
    };

    return (
      <div className="flex flex-row bg-gray-50 w-screen min-h-screen"> 
  
        {/* LEFT SIDE */}
        <motion.div
            key="form-panel"
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }}   
            exit={{ opacity: 0, x: -50 }}   
            transition={{ duration: 0.3, ease: "easeOut" }} 
            className="w-1/2 flex items-center justify-center bg-white shadow-2xl relative">
            
            {/* Form Container */}
            <div className="w-full px-16 py-8 overflow-y-auto max-h-screen"> 
                
                {/* Small Logo */}
                <div className="mb-2">
                    <img 
                        src="/logo.png" 
                        alt="Logo" 
                        className="h-16 w-16 object-contain"/>
                </div>

                {/* Title Section */}
                <div className="flex flex-col mb-6"> 
                    <h2 className="text-4xl font-bold mb-3 text-gray-800">Create Account</h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Register your credentials to access the system.
                    </p>
                    
                    {/* Error Message */}
                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-300 rounded-md">
                            <p className="text-sm text-red-700 font-medium">{error}</p>
                        </div>
                    )}
                    
                    {/* Success Message */}
                    {success && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-300 rounded-md">
                            <p className="text-sm text-green-700 font-medium">
                                Registration successful! Your account is pending admin approval. Redirecting to login...
                            </p>
                        </div>
                    )}
                </div> 

                {/* Form */}
                <form onSubmit={handleRegister} className="flex flex-col gap-y-5"> 
                    
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

                    {/* Password Field */}
                    <div className="flex flex-col gap-y-2"> 
                        <label htmlFor="password" className="font-semibold text-base text-gray-700">Password</label>
                        <Input 
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-12 bg-gray-50 border-gray-300 rounded-lg shadow-sm transition-all duration-200 
                                       focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                            required
                        />
                    </div> 

                    {/* Name Fields */}
                    <div className="flex flex-col gap-y-2"> 
                        <label htmlFor="firstName" className="font-semibold text-base text-gray-700">First Name</label>
                        <Input 
                            id="firstName"
                            type="text"
                            placeholder="Enter your first name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="h-12 bg-gray-50 border-gray-300 rounded-lg shadow-sm transition-all duration-200 
                                       focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-y-2"> 
                        <label htmlFor="middleInitial" className="font-semibold text-base text-gray-700">Middle Initial (Optional)</label>
                        <Input 
                            id="middleInitial"
                            type="text"
                            placeholder="Enter your middle initial"
                            value={middleInitial}
                            onChange={(e) => setMiddleInitial(e.target.value)}
                            className="h-12 bg-gray-50 border-gray-300 rounded-lg shadow-sm transition-all duration-200 
                                       focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                            maxLength={1}
                        />
                    </div>

                    <div className="flex flex-col gap-y-2"> 
                        <label htmlFor="familyName" className="font-semibold text-base text-gray-700">Family Name</label>
                        <Input 
                            id="familyName"
                            type="text"
                            placeholder="Enter your family name"
                            value={familyName}
                            onChange={(e) => setFamilyName(e.target.value)}
                            className="h-12 bg-gray-50 border-gray-300 rounded-lg shadow-sm transition-all duration-200 
                                       focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                            required
                        />
                    </div>

                    {/* Position Dropdown */}
                    <div className="flex flex-col gap-y-2"> 
                        <label htmlFor="role" className="font-semibold text-base text-gray-700">Position</label>
                        <select 
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="h-12 bg-gray-50 border border-gray-300 rounded-lg shadow-sm px-3 text-base text-gray-700
                                       focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                            required
                        >
                            <option value="">Select your Role</option>
                            <option value="Nurse">Nurse</option>
                            <option value="Staff">Staff</option>
                            <option value="Doctor">Doctor</option>
                            <option value="Admin">Admin</option> 
                        </select>
                    </div>

                    <div className="flex flex-col gap-y-3 mt-4"> 
                        {/* Register Button */}
                        <Button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-lg shadow-md transition-all duration-200 hover:shadow-lg disabled:opacity-60"
                        >
                            {isSubmitting ? "Registering..." : "Register"}
                        </Button>

                        {/* Login Link */}
                        <div className="text-center mt-4">
                            <p className="text-gray-600">
                                Already have an account?{' '}
                                <Link 
                                    to="/login" 
                                    className="text-blue-600 hover:text-blue-700 font-semibold underline-offset-4 hover:underline transition-colors"
                                >
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </div>

                </form>

            </div>
        </motion.div> 

        {/* RIGHT SIDE - Image */}
        <motion.div
            key="image-panel-right"
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}   
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
            className="w-1/2 flex items-center justify-center relative overflow-hidden"
        >
            
            {/* Background  */}
            <img 
                src="/bldg.png" 
                alt="Abstract medical background" 
                className="absolute inset-0 w-full h-full object-cover filter blur-xs" 
            />

            {/* Dark Overlay (Adjusted for high readability) */}
            <div className="absolute inset-0 bg-blue-900/80"></div> 
            


            {/* Header */}
            <div className="relative z-10 text-white text-center p-8">
                <h1 className="text-5xl font-extrabold mb-2">ADZU Health Management System</h1>
                <p className="text-xl font-normal mt-4 tracking-wide">Dedicated to Wellness, Guided by Faith.</p>
            </div>
        </motion.div> 

      </div>
    )
  }
  export default Register; 