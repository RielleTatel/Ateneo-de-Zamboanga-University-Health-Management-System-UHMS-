import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navigation from "../components/layout/navigation.jsx";
import UserNav from "../components/layout/userNav.jsx";
import { Button } from "@/components/ui/button";
import { Shield, KeyRound, Loader2 } from "lucide-react";
import axiosInstance from "../lib/axiosInstance";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "@/context/AuthContext.jsx";

// Fetch verified users for role transfer
const fetchVerifiedUsers = async () => {
  const { data } = await axiosInstance.get("/users/verified");
  return data.users;
};

// Transfer admin role
const transferAdminRole = async (targetUuid) => {
  const { data } = await axiosInstance.post("/users/transfer-admin", { targetUuid });
  return data;
};

const Controls = () => {
  const [transferTarget, setTransferTarget] = useState("");
  const [transferMessage, setTransferMessage] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Load verified users list
  const {
    data: verifiedUsers = [],
    isLoading: isVerifiedLoading,
    error: verifiedError,
  } = useQuery({
    queryKey: ["verifiedUsers"],
    queryFn: fetchVerifiedUsers,
    refetchOnWindowFocus: false,
  });

  // Mutation for transferring admin role
  const transferAdminMutation = useMutation({
    mutationFn: transferAdminRole,
    onSuccess: () => {
      setTransferMessage(
        "Admin role transferred successfully. You will lose admin permissions after your next login."
      );
      queryClient.invalidateQueries({ queryKey: ["verifiedUsers"] });
    },
    onError: (error) => {
      console.error("Error transferring admin role:", error);
      // Axios-style error handling
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to transfer admin role.";
      setTransferMessage(msg);
    },
  });

  const handleTransferAdmin = () => {
    if (!transferTarget) return;
    const confirmed = window.confirm(
      "Are you sure you want to transfer the Admin role to this user? You will lose admin permissions after the transfer."
    );
    if (!confirmed) return;
    setTransferMessage("");
    transferAdminMutation.mutate(transferTarget);
  };

  const handleAdminPasswordReset = async () => {
    try {
      setIsResettingPassword(true);
      setResetMessage("");

      if (!user?.email) {
        setResetMessage("No admin email found on your profile.");
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error("Error sending reset email:", error);
        setResetMessage(error.message || "Failed to send password reset email.");
        return;
      }

      setResetMessage(
        "Password reset email sent to your registered admin inbox. Because only you can access that email, this acts as a two-factor verification step."
      );
    } catch (err) {
      console.error("Unexpected error sending reset email:", err);
      setResetMessage("Unexpected error sending password reset email.");
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <div className="bg-background-primary w-screen min-h-screen flex flex-row">
      <Navigation />

      {/* Main Content */}
      <div className="flex-1 flex-col p-4">
        <div className="min-w-full px-3 flex justify-between items-center">
          <div>
            <p className="text-[20px]">
              <b> Super Admin Controls </b>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Transfer system ownership and securely reset your own admin password
            </p>
          </div>
          <UserNav />
        </div>

        <div className="mt-2 min-h-[700px] rounded-[23px] border-outline border-2 p-7">
          <div className="mb-8 p-4 bg-blue-50 rounded-2xl border-2" style={{ borderColor: "#0033A0" }}>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="md:w-1/2">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-blue-700" />
                  <span className="text-base font-semibold" style={{ color: "#0033A0" }}>
                    Super Admin Controls
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Transfer the Admin role to another verified user and trigger a secure password reset
                  for your own admin account. These actions are restricted to the current Admin.
                </p>
              </div>
              <div className="md:w-1/2 space-y-4">
                {/* Role Transfer */}
                <div className="bg-white rounded-xl border border-outline p-3">
                  <p className="text-sm font-semibold mb-2">Transfer Admin Role</p>
                  <p className="text-xs text-gray-600 mb-2">
                    Select a verified user to become the new Admin. After transfer, your own role will be
                    changed to <span className="font-semibold">staff</span>.
                  </p>
                  {isVerifiedLoading || verifiedError ? (
                    <p className="text-xs text-gray-600">
                      {isVerifiedLoading
                        ? "Loading verified users..."
                        : "Failed to load verified users. Please refresh the page."}
                    </p>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <select
                        className="flex-1 h-10 rounded-md border border-gray-300 px-2 text-sm"
                        value={transferTarget}
                        onChange={(e) => setTransferTarget(e.target.value)}
                      >
                        <option value="">Select verified user…</option>
                        {verifiedUsers
                          .filter((u) => u.uuid !== user?.uuid)
                          .map((u) => (
                            <option key={u.uuid} value={u.uuid}>
                              {u.full_name} ({u.email})
                            </option>
                          ))}
                      </select>
                      <Button
                        size="sm"
                        onClick={handleTransferAdmin}
                        disabled={!transferTarget || transferAdminMutation.isLoading}
                        className="whitespace-nowrap"
                      >
                        {transferAdminMutation.isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Shield className="w-4 h-4 mr-1" />
                            Transfer Role
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                  {transferMessage && (
                    <p className="mt-2 text-xs text-gray-700">{transferMessage}</p>
                  )}
                </div>

                {/* Admin Password Reset */}
                <div className="bg-white rounded-xl border border-outline p-3">
                  <p className="text-sm font-semibold mb-1">Reset Admin Password</p>
                  <p className="text-xs text-gray-600 mb-2">
                    Sends a password reset email to your registered admin address (
                    <span className="font-mono">{user?.email || "no email"}</span>).
                    This uses your inbox as a second verification factor—only someone with access
                    to that email can complete the reset.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleAdminPasswordReset}
                    disabled={isResettingPassword}
                    className="border-2"
                    style={{ borderColor: "#0033A0", color: "#0033A0" }}
                  >
                    {isResettingPassword ? (
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <KeyRound className="w-4 h-4 mr-1" />
                    )}
                    Send Reset Email
                  </Button>
                  {resetMessage && (
                    <p className="mt-2 text-xs text-gray-700">{resetMessage}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;


