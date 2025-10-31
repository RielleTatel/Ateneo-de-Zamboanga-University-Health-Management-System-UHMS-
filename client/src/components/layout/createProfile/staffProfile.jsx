import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const StaffProfile = ({ formData, setFormData }) => {
    return (
        <div>
            <div className="flex justify-center items-center mb-8">
                <p className="text-[23px]"> <b> Staff Details </b> </p>
            </div>

            <div className="flex flex-col gap-y-4 p-2 mx-auto">
                <div className="flex flex-col gap-y-2">
                    <label className="font-bold">Department <span className="text-red-500">*</span></label>
                    <Select 
                        value={formData.department} 
                        onValueChange={(value) => setFormData({ ...formData, department: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Staff Department" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Administration">Administration</SelectItem>
                            <SelectItem value="Registrar">Registrar</SelectItem>
                            <SelectItem value="Library">Library</SelectItem>
                            <SelectItem value="IT Department">IT Department</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                            <SelectItem value="Human Resources">Human Resources</SelectItem>
                            <SelectItem value="Maintenance">Maintenance</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col gap-y-2">
                    <label className="font-bold">Position <span className="text-red-500">*</span></label>
                    <Input 
                        placeholder="Enter Staff Position"
                        value={formData.position || ''}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    />
                </div>
            </div>
        </div>
    );
};

export default StaffProfile;

