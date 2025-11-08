import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Navigation from "../components/layout/navigation.jsx";
import { Search, Trash2, AlertTriangle } from "lucide-react";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select.jsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const Admin = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterPosition, setFilterPosition] = useState("all");
    const [deleteDialog, setDeleteDialog] = useState({ open: false, userId: null, userName: "" });
    
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

    return (
        <div className="bg-background-primary w-screen min-h-screen flex flex-row">
            <Navigation/>  

            {/* Main Content */}
            <div className="flex-1 flex-col p-4"> 

                <div className="min-w-full p-3"> 
                    <p className="text-[20px]"> <b> Admin Dashboard </b> </p>
                </div>  

                <div className="bg-background-secondary mt-2 min-h-[700px] rounded-[23px] border-outline border-2 p-7">  

                    <div className="mb-6">
                        <p className="text-[15px]">  
                            <span className="text-[36px] mb-1"> <b> User Management </b> </span> 
                            <br/> 
                            View and manage all registered accounts in the system
                        </p>
                    </div>

                    {/* Stats Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-lg border-outline border-2 p-4">
                            <p className="text-sm text-gray-600 mb-1">Total Users</p>
                            <p className="text-2xl font-bold text-blue-600">{users.length}</p>
                        </div>
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
                        
                        {/* Filter Dropdown */}
                        <Select value={filterPosition} onValueChange={setFilterPosition}>
                            <SelectTrigger className="w-[180px] h-12 bg-background-secondary text-gray-700">
                                <SelectValue placeholder="Filter by position" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Users</SelectItem>
                                <SelectItem value="student">Students Only</SelectItem>
                                <SelectItem value="staff">Staff Only</SelectItem>
                                <SelectItem value="admin">Admin Only</SelectItem>
                            </SelectContent>
                        </Select>
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
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        {user.department}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="border-outline">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                    user.position === 'Student' 
                                                        ? 'bg-blue-100 text-blue-800' 
                                                        : user.position === 'Staff'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-purple-100 text-purple-800'
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

