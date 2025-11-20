import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Navigation from "../components/layout/navigation.jsx";
import { Search, Trash2, AlertTriangle, UserPlus, CheckCircle, XCircle, Users, UserCheck, Clock } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Admin = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterPosition, setFilterPosition] = useState("all");
    const [deleteDialog, setDeleteDialog] = useState({ open: false, userId: null, userName: "" });
    const [activeTab, setActiveTab] = useState("pending");
    
    // Mock data for registered users
    const [users, setUsers] = useState([
        {
            id: 1,
            name: "Juan Dela Cruz",
            position: "Nurse",
            department: "College of Science, Information, Technology and Engineering",
            email: "juan.delacruz@adzu.edu.ph",
            dateRegistered: "2024-01-15"
        },
        {
            id: 2,
            name: "Maria Santos",
            position: "Nurse",
            department: "Registrar Office",
            email: "maria.santos@adzu.edu.ph",
            dateRegistered: "2024-01-20"
        },
    ]);

    // Mock data for pending registrations
    const [pendingRegistrations, setPendingRegistrations] = useState([
        {
            id: 101,
            name: "Carlos Rivera",
            position: "Doctor",
            department: "Medical Services",
            email: "carlos.rivera@adzu.edu.ph",
            dateRequested: "2024-11-15",
            reason: "New medical staff member"
        },
        {
            id: 102,
            name: "Anna Marie Lopez",
            position: "Staff",
            department: "Human Resources",
            email: "anna.lopez@adzu.edu.ph",
            dateRequested: "2024-11-16",
            reason: "HR department staff"
        },
        {
            id: 103,
            name: "Roberto Cruz",
            position: "Nurse",
            department: "Student Affairs",
            email: "roberto.cruz@adzu.edu.ph",
            dateRequested: "2024-11-17",
            reason: "Student health services"
        }
    ]);

    // Form state for creating new account
    const [newAccount, setNewAccount] = useState({
        name: "",
        email: "",
        position: "",
        department: "",
        password: ""
    });

    // Filter users based on search and position filter
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            user.id.toString().includes(searchQuery);
        
        const matchesFilter = filterPosition === "all" || user.position.toLowerCase() === filterPosition.toLowerCase();
        
        return matchesSearch && matchesFilter;
    });

    const handleDeleteClick = (userId, userName) => {
        setDeleteDialog({ open: true, userId, userName });
    };

    const handleConfirmDelete = () => {
        if (deleteDialog.userId) {
            setUsers(users.filter(user => user.id !== deleteDialog.userId));
            setDeleteDialog({ open: false, userId: null, userName: "" });
        }
    };

    const handleCancelDelete = () => {
        setDeleteDialog({ open: false, userId: null, userName: "" });
    };

    // Handle approving a pending registration
    const handleApproveRegistration = (registration) => {
        const newUser = {
            id: Date.now(),
            name: registration.name,
            position: registration.position,
            department: registration.department,
            email: registration.email,
            dateRegistered: new Date().toISOString().split('T')[0]
        };
        setUsers([...users, newUser]);
        setPendingRegistrations(pendingRegistrations.filter(reg => reg.id !== registration.id));
    };

    // Handle rejecting a pending registration
    const handleRejectRegistration = (registrationId) => {
        setPendingRegistrations(pendingRegistrations.filter(reg => reg.id !== registrationId));
    };

    // Handle creating a new account
    const handleCreateAccount = (e) => {
        e.preventDefault();
        
        if (!newAccount.name || !newAccount.email || !newAccount.position || !newAccount.department || !newAccount.password) {
            alert("Please fill in all fields");
            return;
        }

        const createdUser = {
            id: Date.now(),
            name: newAccount.name,
            position: newAccount.position,
            department: newAccount.department,
            email: newAccount.email,
            dateRegistered: new Date().toISOString().split('T')[0]
        };

        setUsers([...users, createdUser]);
        setNewAccount({
            name: "",
            email: "",
            position: "",
            department: "",
            password: ""
        });
        alert("Account created successfully!");
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
                                {pendingRegistrations.length > 0 && (
                                    <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                                        {pendingRegistrations.length}
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
                                {pendingRegistrations.length === 0 ? (
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
                                                <TableHead className="text-black font-semibold">Position</TableHead>
                                                <TableHead className="text-black font-semibold">Date Requested</TableHead>
                                                <TableHead className="text-black font-semibold text-center">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {pendingRegistrations.map((registration) => (
                                                <TableRow key={registration.id} className="border-outline">
                                                    <TableCell className="font-medium border-outline">
                                                        <div>
                                                            <div className="font-semibold text-base">{registration.name}</div>
                                                            <div className="text-xs text-gray-500">{registration.email}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="border-outline">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                            registration.position === 'Doctor' 
                                                                ? 'bg-red-100 text-red-800' 
                                                                : registration.position === 'Nurse'
                                                                ? 'bg-purple-100 text-purple-800'
                                                                : registration.position === 'Staff'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-blue-100 text-blue-800'
                                                        }`}>
                                                            {registration.position}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="border-outline">
                                                        <span className="text-sm text-gray-600">
                                                            {new Date(registration.dateRequested).toLocaleDateString()}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-center border-outline">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleApproveRegistration(registration)}
                                                                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleRejectRegistration(registration.id)}
                                                                className="border-red-300 text-red-600 hover:bg-red-50 flex items-center gap-1"
                                                            >
                                                                <XCircle className="w-4 h-4" />
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
                                {pendingRegistrations.length} pending registration{pendingRegistrations.length !== 1 ? 's' : ''}
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
                                <Table>
                                    <TableHeader className="border-outline">
                                        <TableRow className="bg-background-secondary border-outline">
                                            <TableHead className="text-black font-semibold">Name</TableHead>
                                            <TableHead className="text-black font-semibold">Position</TableHead>
                                            <TableHead className="text-black font-semibold text-center">Remove User</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsers.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                                                    No users found matching your search criteria
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredUsers.map((user) => (
                                                <TableRow key={user.id} className="border-outline">
                                                    <TableCell className="font-medium border-outline">
                                                        <div>
                                                            <div className="font-semibold text-base">{user.name}</div>
                                                            <div className="text-xs text-gray-500">{user.email}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="border-outline">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                            user.position === 'Admin'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : user.position === 'Doctor' 
                                                                ? 'bg-red-100 text-red-800' 
                                                                : user.position === 'Nurse'
                                                                ? 'bg-purple-100 text-purple-800'
                                                                : user.position === 'Staff'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-blue-100 text-blue-800'
                                                        }`}>
                                                            {user.position}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-center border-outline">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDeleteClick(user.id, user.name)}
                                                            className="flex items-center gap-2 mx-auto text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            Remove
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Results count */}
                            <div className="mt-4 text-sm text-gray-600">
                                Showing {filteredUsers.length} of {users.length} users
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

