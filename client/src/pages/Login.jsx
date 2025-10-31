import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = (e) => {
        e.preventDefault();
        // Handle sign in logic here
        console.log('Sign in with:', { email, password });
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
            </div> 

            {/* Form */}
            <form onSubmit={handleSignIn} className="flex flex-col gap-y-6">
                
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
                            className="w-full h-10 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-[16px] mt-4"
                        >
                            Sign In
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
  