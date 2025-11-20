import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Navigation from "../components/layout/navigation.jsx";
import { Search, Trash2, AlertTriangle, CheckCircle, XCircle, Users, UserCheck, Clock, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axiosInstance from "../lib/axiosInstance";

// API functions
const fetchPendingUsers = async () => {
    const { data } = await axiosInstance.get("/users/pending");
    return data.users;
};

const fetchVerifiedUsers = async () => {
    const { data } = await axiosInstance.get("/users/verified");
    return data.users;
};

const approveUser = async (uuid) => {
    const { data } = await axiosInstance.patch(`/users/approve/${uuid}`);
    return data;
};

const rejectUser = async (uuid) => {
    const { data } = await axiosInstance.delete(`/users/reject/${uuid}`);
    return data;
};

const deleteUser = async (uuid) => {
    const { data } = await axiosInstance.delete(`/users/delete/${uuid}`);
    return data;
};  


const Admin = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteDialog, setDeleteDialog] = useState({ open: false, userId: null, userName: "" });
    const [activeTab, setActiveTab] = useState("pending");
    const queryClient = useQueryClient();

    // Fetch pending users
    const { 
        data: pendingUsers = [], 
        isLoading: isPendingLoading,
        error: pendingError 
    } = useQuery({
        queryKey: ["pendingUsers"],
        queryFn: fetchPendingUsers,
        refetchOnWindowFocus: false
    });

    // Fetch verified users
    const { 
        data: verifiedUsers = [], 
        isLoading: isVerifiedLoading,
        error: verifiedError 
    } = useQuery({
        queryKey: ["verifiedUsers"],
        queryFn: fetchVerifiedUsers,
        refetchOnWindowFocus: false
    });

    // Approve user mutation
    const approveMutation = useMutation({
        mutationFn: approveUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pendingUsers"] });
            queryClient.invalidateQueries({ queryKey: ["verifiedUsers"] });
        }
    });

    // Reject user mutation
    const rejectMutation = useMutation({
        mutationFn: rejectUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pendingUsers"] });
        }
    });

    // Delete user mutation
    const deleteMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["verifiedUsers"] });
            setDeleteDialog({ open: false, userId: null, userName: "" });
        }
    });

    // Filter users based on search
    const filteredUsers = verifiedUsers.filter(user => {
        const matchesSearch = 
            user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.uuid?.toString().includes(searchQuery);
        
        return matchesSearch;
    });

    const handleDeleteClick = (userId, userName) => {
        setDeleteDialog({ open: true, userId, userName });
    };

    const handleConfirmDelete = () => {
        if (deleteDialog.userId) {
            deleteMutation.mutate(deleteDialog.userId);
        }
    };

    const handleCancelDelete = () => {
        setDeleteDialog({ open: false, userId: null, userName: "" });
    };

    // Handle approving a pending registration
    const handleApproveRegistration = (user) => {
        approveMutation.mutate(user.uuid);
    };

    // Handle rejecting a pending registration
    const handleRejectRegistration = (userId) => {
        rejectMutation.mutate(userId);
    };

    return (
        <div className="bg-background-primary w-screen min-h-screen flex flex-row">
            <Navigation/>  

            {/* Main Content */}
            <div className="flex-1 flex-col p-4"> 

                <div className="min-w-full p-3"> 
                    <p className="text-[20px]"> <b> Admin Dashboard </b> </p>
                    <p className="text-sm text-gray-600 mt-1"> Total control of user accounts and system access </p>
                </div>  

                <div className="mt-2 min-h-[700px] rounded-[23px] border-outline border-2 p-7">  

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="mb-6 p-3 flex items-center flex-row gap-x-4 bg-background-primary">
                            <TabsTrigger value="pending" className="flex items-center gap-2 w-1/2 py-2.5 rounded-xl">
                                <Clock className="w-4 h-4" />
                                Pending Registrations
                                {pendingUsers.length > 0 && (
                                    <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                                        {pendingUsers.length}
                                    </span>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="manage" className="flex items-center gap-2 w-1/2 py-3 rounded-xl">
                                <Users className="w-4 h-4" />
                                Manage Users
                            </TabsTrigger>
                        </TabsList>

                        {/* Pending Registrations Tab */}
                        <TabsContent value="pending">
                            <div className="mb-6">
                                <p className="text-[15px]">  
                                    <span className="text-[28px] mb-1"> <b> Pending Registration Requests </b> </span> 
                                    <br/> 
                                    Review and approve or reject account registration requests
                                </p>
                            </div>

                            <div className="bg-white rounded-lg overflow-hidden border-outline border-2">
                                {isPendingLoading ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <Loader2 className="w-16 h-16 mx-auto mb-4 text-gray-300 animate-spin" />
                                        <p className="text-lg font-medium">Loading pending users...</p>
                                    </div>
                                ) : pendingError ? (
                                    <div className="text-center py-12 text-red-500">
                                        <AlertTriangle className="w-16 h-16 mx-auto mb-4" />
                                        <p className="text-lg font-medium">Error loading pending users</p>
                                        <p className="text-sm">{pendingError.message}</p>
                                    </div>
                                ) : pendingUsers.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <UserCheck className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                        <p className="text-lg font-medium">No pending registrations</p>
                                        <p className="text-sm">All registration requests have been processed</p>
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader className="border-outline">
                                            <TableRow className="bg-background-secondary border-outline">
                                                <TableHead className="text-black font-semibold">Applicant Details</TableHead>
                                                <TableHead className="text-black font-semibold">Role</TableHead>
                                                <TableHead className="text-black font-semibold text-center">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {pendingUsers.map((user) => (
                                                <TableRow key={user.uuid} className="border-outline">
                                                    <TableCell className="font-medium border-outline">
                                                        <div>
                                                            <div className="font-semibold text-base">{user.full_name}</div>
                                                            <div className="text-xs text-gray-500">{user.email}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="border-outline">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                            user.role === 'doctor' 
                                                                ? 'bg-red-100 text-red-800' 
                                                                : user.role === 'nurse'
                                                                ? 'bg-purple-100 text-purple-800'
                                                                : user.role === 'staff'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-blue-100 text-blue-800'
                                                        }`}>
                                                            {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-center border-outline">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleApproveRegistration(user)}
                                                                disabled={approveMutation.isLoading}
                                                                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                                                            >
                                                                {approveMutation.isLoading ? (
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                ) : (
                                                                    <CheckCircle className="w-4 h-4" />
                                                                )}
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleRejectRegistration(user.uuid)}
                                                                disabled={rejectMutation.isLoading}
                                                                className="border-red-300 text-red-600 hover:bg-red-50 flex items-center gap-1"
                                                            >
                                                                {rejectMutation.isLoading ? (
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                ) : (
                                                                    <XCircle className="w-4 h-4" />
                                                                )}
                                                                Reject
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </div>

                            <div className="mt-4 text-sm text-gray-600">
                                {pendingUsers.length} pending registration{pendingUsers.length !== 1 ? 's' : ''}
                            </div>
                        </TabsContent>

                        {/* Manage Users Tab */}
                        <TabsContent value="manage">
                            <div className="mb-6">
                                <p className="text-[15px]">  
                                    <span className="text-[28px] mb-1"> <b> User Management </b> </span> 
                                    <br/> 
                                    View and manage all registered accounts in the system
                                </p>
                            </div>

                            {/* Search and Filter Section */}
                            <div className="flex flex-row gap-4 mb-6 p-4 rounded-[16px] bg-background-secondary border-outline border-2">
                                {/* Search Input */}
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700" />
                                    <input 
                                        type="text" 
                                        placeholder="Search by ID, name, or email"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-300 bg-background-secondary text-gray-700 placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Users Table */}
                            <div className="bg-white rounded-lg overflow-hidden border-outline border-2">
                                {isVerifiedLoading ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <Loader2 className="w-16 h-16 mx-auto mb-4 text-gray-300 animate-spin" />
                                        <p className="text-lg font-medium">Loading verified users...</p>
                                    </div>
                                ) : verifiedError ? (
                                    <div className="text-center py-12 text-red-500">
                                        <AlertTriangle className="w-16 h-16 mx-auto mb-4" />
                                        <p className="text-lg font-medium">Error loading verified users</p>
                                        <p className="text-sm">{verifiedError.message}</p>
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader className="border-outline">
                                            <TableRow className="bg-background-secondary border-outline">
                                                <TableHead className="text-black font-semibold">Name</TableHead>
                                                <TableHead className="text-black font-semibold">Role</TableHead>
                                                <TableHead className="text-black font-semibold text-center">Remove User</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredUsers.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                                                        {verifiedUsers.length === 0 
                                                            ? "No verified users found"
                                                            : "No users found matching your search criteria"}
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredUsers.map((user) => (
                                                    <TableRow key={user.uuid} className="border-outline">
                                                        <TableCell className="font-medium border-outline">
                                                            <div>
                                                                <div className="font-semibold text-base">{user.full_name}</div>
                                                                <div className="text-xs text-gray-500">{user.email}</div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="border-outline">
                                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                                user.role === 'admin'
                                                                    ? 'bg-yellow-100 text-yellow-800'
                                                                    : user.role === 'doctor' 
                                                                    ? 'bg-red-100 text-red-800' 
                                                                    : user.role === 'nurse'
                                                                    ? 'bg-purple-100 text-purple-800'
                                                                    : user.role === 'staff'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-blue-100 text-blue-800'
                                                            }`}>
                                                                {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-center border-outline">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDeleteClick(user.uuid, user.full_name)}
                                                                disabled={deleteMutation.isLoading}
                                                                className="flex items-center gap-2 mx-auto text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            >
                                                                {deleteMutation.isLoading ? (
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                ) : (
                                                                    <Trash2 className="w-4 h-4" />
                                                                )}
                                                                Remove
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                )}
                            </div>

                            {/* Results count */}
                            <div className="mt-4 text-sm text-gray-600">
                                Showing {filteredUsers.length} of {verifiedUsers.length} users
                            </div>
                        </TabsContent>
                    </Tabs>

                </div> 
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialog.open} onOpenChange={(open) => !open && handleCancelDelete()}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="w-5 h-5" />
                            Confirm User Removal
                        </DialogTitle>
                        <DialogDescription className="pt-4">
                            Are you sure you want to remove <span className="font-semibold">{deleteDialog.userName}</span> from the system?
                            <br />
                            <br />
                            This action cannot be undone. All associated records and data will be permanently deleted.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button 
                            variant="outline" 
                            onClick={handleCancelDelete}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={handleConfirmDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Remove User
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div> 
    );
}

export default Admin;

