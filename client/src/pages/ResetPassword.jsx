import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { KeyRound, Loader2 } from "lucide-react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Validation
    if (!password || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSaving(true);

    try {
      // Update the user's password
      const { error: updateError } = await supabase.auth.updateUser({ 
        password: password 
      });

      if (updateError) {
        setError(updateError.message || "Failed to update password.");
        setSaving(false);
        return;
      }

      setMessage("Password updated successfully! Redirecting to login...");
      
      // Sign out the user and redirect to login
      await supabase.auth.signOut();
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      console.error("Unexpected error updating password:", err);
      setError("An unexpected error occurred. Please try again.");
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl border-2 border-outline shadow-lg space-y-6"
        >
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <KeyRound className="w-8 h-8" style={{ color: '#0033A0' }} />
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: '#0033A0' }}>
              Set New Password
            </h1>
            <p className="text-sm text-gray-600">
              You reached this page from a secure email link. Enter your new password below.
            </p>
          </div>

          {/* Password Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={saving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Re-enter new password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={saving}
              />
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700 text-center">{error}</p>
            </div>
          )}

          {message && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-700 text-center font-medium">{message}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-lg text-white font-semibold text-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ backgroundColor: '#0033A0' }}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating Password...
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                Update Password
              </>
            )}
          </button>

          {/* Help Text */}
          <p className="text-xs text-gray-500 text-center">
            After updating your password, you'll be redirected to the login page.
          </p>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

