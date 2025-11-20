import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../lib/axiosInstance";

const Login = () => { 
    const navigate = useNavigate();
    const { login, isAuthenticated, user } = useAuth();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");   
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
      <div className="flex flex-row bg-background-primary w-screen min-h-screen"> 
  
        {/* LEFT SIDE - Image Section */}
        <div className="w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center relative overflow-hidden">
          {/* You can add an actual image here */}
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 text-white text-center p-8">
            <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
            <p className="text-lg opacity-90">Ateneo de Zamboanga University</p>
            <p className="text-lg opacity-90">Health Management System</p>
          </div>
        </div> 
  
        {/* RIGHT SIDE */}
        <div className="w-1/2 flex flex-col items-center justify-start bg-white relative">
          
          {/* Header */}
          <div className="flex flex-col items-center w-full py-8 border-b border-gray-200">
            <p className="text-black font-semibold text-[20px]">ADZU Health Management System</p> 
          </div> 

          {/* Form Container */}
          <div className="w-full px-14 py-12"> 
            
            {/* Title Section */}
            <div className="flex flex-col mb-8"> 
                <h2 className="text-[32px] font-bold mb-2">Sign In</h2>
                <p className="text-[16px] text-gray-600">You must sign in first to be able to access content</p>
                {error && (
                    <p className="mt-4 text-sm text-red-500">
                        {error}
                    </p>
                )}
            </div> 

            {/* Form */}
            <form onSubmit={handleLogin} className="flex flex-col gap-y-6">
                
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
                    <div className="flex justify-end">
                        <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-gray-800">
                            Forgot password?
                        </Link>
                    </div>
                </div> 

                <div className="flex flex-col gap-y-2"> 
                    {/* Sign In Button */}
                    <div className="flex items-center justify-center"> 
                        <Button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-10 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-[16px] mt-4 disabled:opacity-60"
                        >
                            {isSubmitting ? "Signing In..." : "Sign In"}
                        </Button>
                    </div>

                    {/* Register Link */}
                    <div className="text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-blue-500 hover:text-blue-600 font-semibold">
                                Register here
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
  export default Login;
  