import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../lib/axiosInstance";
import { supabase } from "../lib/supabaseClient";
import { Eye as EyeIcon, EyeOff as EyeOffIcon, KeyRound } from "lucide-react"; 
import { motion } from "framer-motion";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const Login = () => { 
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated, user } = useAuth();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");   
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Toggle password visibility state
    const [showPassword, setShowPassword] = useState(false);
    
    // Forgot password modal state
    const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resetError, setResetError] = useState(null);
    const [resetSuccess, setResetSuccess] = useState(false);
    const [isSubmittingReset, setIsSubmittingReset] = useState(false);
    const [isAdminReset, setIsAdminReset] = useState(false); 

    // Check for registration success message from navigation state
    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            // Clear the message from state
            window.history.replaceState({}, document.title);
        }
    }, [location]);

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
            setIsSubmitting(false);
            if (userData.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }

        } catch (err) {
            console.error("Login error:", err);
            
            // Handle specific error messages
            let errorMessage = "Login failed. Please check your credentials.";
            
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                // Handle common Supabase error messages
                if (err.message.includes("Email not confirmed")) {
                    errorMessage = "Your account is pending admin approval. Please wait for an administrator to verify your account.";
                } else if (err.message.includes("Invalid login credentials")) {
                    errorMessage = "Invalid email or password. Please try again.";
                } else if (err.message.includes("Email not found")) {
                    errorMessage = "No account found with this email. Please register first.";
                } else {
                    errorMessage = err.message;
                }
            }
            
            setError(errorMessage);
            setIsSubmitting(false);
        }
    };

    const handleForgotPasswordClick = (e) => {
        e.preventDefault();
        setForgotPasswordOpen(true);
        setResetError(null);
        setResetSuccess(false);
        setResetEmail("");
        setNewPassword("");
        setConfirmPassword("");
    };

    const handlePasswordResetSubmit = async (e) => {
        e.preventDefault();
        setResetError(null);
        setIsSubmittingReset(true);

        // Validation
        if (!resetEmail) {
            setResetError("Email is required");
            setIsSubmittingReset(false);
            return;
        }

        try {
            // First, check if the email belongs to an admin user
            const checkResponse = await axiosInstance.post("/auth/check-user-role", {
                email: resetEmail
            });

            const { role } = checkResponse.data;

            // If admin, use Supabase's built-in password reset email (2FA)
            if (role === 'admin') {
                setIsAdminReset(true);
                
                console.log('[Password Reset] Sending reset email to admin:', resetEmail);
                
                // Use Supabase's password reset email
                const { data, error: resetError } = await supabase.auth.resetPasswordForEmail(resetEmail, {
                    redirectTo: `${window.location.origin}/reset-password`
                });

                if (resetError) {
                    console.error('[Password Reset] Supabase error:', resetError);
                    throw new Error(resetError.message);
                }

                console.log('[Password Reset] Email sent successfully:', data);
                
                setResetSuccess(true);
                setResetError(null);
                
                // Close modal after 5 seconds
                setTimeout(() => {
                    setForgotPasswordOpen(false);
                    setResetSuccess(false);
                    setIsAdminReset(false);
                }, 5000);
            } else {
                // For non-admin users, require new password and send for admin approval
                if (!newPassword || !confirmPassword) {
                    setResetError("All fields are required");
                    setIsSubmittingReset(false);
                    return;
                }

                if (newPassword !== confirmPassword) {
                    setResetError("Passwords do not match");
                    setIsSubmittingReset(false);
                    return;
                }

                if (newPassword.length < 6) {
                    setResetError("Password must be at least 6 characters long");
                    setIsSubmittingReset(false);
                    return;
                }

                const response = await axiosInstance.post("/auth/password-reset/request", {
                    email: resetEmail,
                    newPassword: newPassword
                });

                console.log("Password reset request submitted:", response.data);
                setResetSuccess(true);
                
                // Close modal after 3 seconds
                setTimeout(() => {
                    setForgotPasswordOpen(false);
                    setResetSuccess(false);
                }, 3000);
            }

        } catch (err) {
            console.error("Password reset error:", err);
            if (err.response?.data?.message) {
                setResetError(err.response.data.message);
            } else {
                setResetError(err.message || "Failed to process password reset request. Please try again.");
            }
        } finally {
            setIsSubmittingReset(false);
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
                        {/* Success Message from Registration */}
                        {successMessage && (
                            <div className="mt-6 p-3 bg-green-50 border border-green-300 rounded-md">
                                <p className="text-sm text-green-700 font-medium">
                                    {successMessage}
                                </p>
                            </div>
                        )}
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
                                <button
                                    type="button"
                                    onClick={handleForgotPasswordClick}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                >
                                    Forgot password?
                                </button>
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

            {/* Forgot Password Modal */}
            <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-2xl">
                            <KeyRound className="w-6 h-6 text-blue-600" />
                            Reset Your Password
                        </DialogTitle>
                        <DialogDescription className="pt-2">
                            Enter your email and new password. Your request will be sent to the admin for approval.
                        </DialogDescription>
                    </DialogHeader>

                    {resetSuccess ? (
                        <div className="py-8 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {isAdminReset ? "Reset Email Sent!" : "Request Submitted!"}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {isAdminReset ? (
                                    <>
                                        A password reset link has been sent to your email.
                                        <br />
                                        Please check your inbox (and spam folder) and follow the instructions to reset your password.
                                        <br />
                                        <span className="text-xs text-gray-500 mt-2 block">
                                            The link will expire in 1 hour. If you don't receive the email, check your Supabase email configuration.
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        Your password reset request has been submitted successfully.
                                        <br />
                                        Please wait for admin approval.
                                    </>
                                )}
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handlePasswordResetSubmit} className="space-y-4 py-4">
                            {/* Error Message */}
                            {resetError && (
                                <div className="p-3 bg-red-50 border border-red-300 rounded-md">
                                    <p className="text-sm text-red-700 font-medium">
                                        {resetError}
                                    </p>
                                </div>
                            )}

                            {/* Email Field */}
                            <div className="space-y-2">
                                <label htmlFor="reset-email" className="text-sm font-semibold text-gray-700">
                                    Email Address
                                </label>
                                <Input
                                    id="reset-email"
                                    type="email"
                                    placeholder="your.email@adzu.edu.ph"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    className="h-11"
                                    required
                                />
                                <p className="text-xs text-gray-500">
                                    Admin users will receive a secure reset link via email. Others will submit a request for approval.
                                </p>
                            </div>

                            {/* New Password Field - Only shown for non-admin users */}
                            {resetEmail && !resetEmail.includes('admin') && (
                                <>
                                    <div className="space-y-2">
                                        <label htmlFor="new-password" className="text-sm font-semibold text-gray-700">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <Input
                                                id="new-password"
                                                type={showNewPassword ? "text" : "password"}
                                                placeholder="Enter new password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="h-11 pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                            >
                                                {showNewPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Confirm Password Field */}
                                    <div className="space-y-2">
                                        <label htmlFor="confirm-password" className="text-sm font-semibold text-gray-700">
                                            Confirm New Password
                                        </label>
                                        <div className="relative">
                                            <Input
                                                id="confirm-password"
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Confirm new password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="h-11 pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                            >
                                                {showConfirmPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}

                            <DialogFooter className="gap-2 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setForgotPasswordOpen(false)}
                                    disabled={isSubmittingReset}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmittingReset}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    {isSubmittingReset ? "Processing..." : "Submit"}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

        </div>
    )
}
export default Login;