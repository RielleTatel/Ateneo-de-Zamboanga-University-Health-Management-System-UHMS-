import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../lib/axiosInstance";

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
        setIsSubmitting(true);

        try {
            // Register with Supabase Auth through backend
            const response = await axiosInstance.post("/auth/register", { 
                email, 
                password, 
                full_name, 
                role 
            });

            console.log("Registration successful:", response.data);
            setSuccess(true);

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate("/login");
            }, 2000);

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
      <div className="flex flex-row bg-background-primary w-screen min-h-screen"> 
  
        {/* LEFT SIDE - Image Section */}
        <div className="w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center relative overflow-hidden">
          {/* You can add an actual image here */}
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 text-white text-center p-8">
            <h1 className="text-4xl font-bold mb-4">Join Us</h1>
            <p className="text-lg opacity-90">Ateneo de Zamboanga University</p>
            <p className="text-lg opacity-90">Health Management System</p>
          </div>
        </div> 
  
        {/* RIGHT SIDE */}
        <div className="w-1/2 flex flex-col items-center justify-start bg-white relative overflow-y-auto">
          
          {/* Header */}
          <div className="flex flex-col items-center w-full py-8 border-b border-gray-200">
            <p className="text-black font-semibold text-[20px]">ADZU Health Management System</p> 
          </div> 

          {/* Form Container */}
          <div className="w-full px-14 py-12"> 
            
            {/* Title Section */}
            <div className="flex flex-col mb-8"> 
                <h2 className="text-[32px] font-bold mb-2">Register</h2>
                <p className="text-[16px] text-gray-600">Create your account to access the system</p>
                {error && (
                    <p className="mt-4 text-sm text-red-500">
                        {error}
                    </p>
                )}
                {success && (
                    <p className="mt-4 text-sm text-green-600 font-medium">
                        Registration successful! Your account is pending admin approval. Redirecting to login...
                    </p>
                )}
            </div> 

            {/* Form */}
            <form onSubmit={handleRegister} className="flex flex-col gap-y-6">
                
                {/* Email Field */}
                <div className="flex flex-col gap-y-2"> 
                    <label className="font-semibold text-[18px]">Email</label>
                    <Input 
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 bg-gray-50"
                        required
                    />
                </div> 

                {/* Password Field */}
                <div className="flex flex-col gap-y-2"> 
                    <label className="font-semibold text-[18px]">Password</label>
                    <Input 
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 bg-gray-50"
                        required
                    />
                </div> 

                {/* Name Fields */}
                <div className="flex flex-col gap-y-2"> 
                    <label className="font-semibold text-[18px]">First Name</label>
                    <Input 
                        type="text"
                        placeholder="Enter your first name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="h-12 bg-gray-50"
                        required
                    />
                </div>

                <div className="flex flex-col gap-y-2"> 
                    <label className="font-semibold text-[18px]">Middle Initial</label>
                    <Input 
                        type="text"
                        placeholder="Enter your middle initial"
                        value={middleInitial}
                        onChange={(e) => setMiddleInitial(e.target.value)}
                        className="h-12 bg-gray-50"
                        maxLength={1}
                    />
                </div>

                <div className="flex flex-col gap-y-2"> 
                    <label className="font-semibold text-[18px]">Family Name</label>
                    <Input 
                        type="text"
                        placeholder="Enter your family name"
                        value={familyName}
                        onChange={(e) => setFamilyName(e.target.value)}
                        className="h-12 bg-gray-50"
                        required
                    />
                </div>

                {/* Position Dropdown */}
                <div className="flex flex-col gap-y-2"> 
                    <label className="font-semibold text-[18px]">Position</label>
                    <select 
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="h-12 bg-gray-50 border border-gray-300 rounded-md px-3 text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select your Role</option>
                        <option value="Nurse">Nurse</option>
                        <option value="Staff">Staff</option>
                        <option value="Doctor">Doctor</option>
                        <option value="Admin">Admin</option>
                    </select>
                </div>

                <div className="flex flex-col gap-y-2"> 
                    {/* Register Button */}
                    <div className="flex items-center justify-center"> 
                        <Button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-10 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-[16px] mt-4 disabled:opacity-60"
                        >
                            {isSubmitting ? "Registering..." : "Register"}
                        </Button>
                    </div>

                    {/* Login Link */}
                    <div className="text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-500 hover:text-blue-600 font-semibold">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>

            </form>

          </div>
        </div> 

      </div>
    )
  }
  export default Register;

