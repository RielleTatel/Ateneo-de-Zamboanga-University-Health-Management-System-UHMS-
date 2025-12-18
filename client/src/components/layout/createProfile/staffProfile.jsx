import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";

const StaffProfile = ({ formData, setFormData }) => {
    const [errors, setErrors] = useState({});

    const validateField = (fieldName, value) => {
        const newErrors = { ...errors };

        switch (fieldName) {
            case 'department':
                if (!value || value.trim() === '') {
                    newErrors.department = 'Department is required';
                } else {
                    delete newErrors.department;
                }
                break;
            case 'position':
                if (!value || value.trim() === '') {
                    newErrors.position = 'Position is required';
                } else if (!/^[a-zA-Z\s.,-]+$/.test(value)) {
                    newErrors.position = 'Position should contain only letters and basic punctuation';
                } else if (value.trim().length < 2) {
                    newErrors.position = 'Position must be at least 2 characters';
                } else if (value.trim().length > 100) {
                    newErrors.position = 'Position must not exceed 100 characters';
                } else {
                    delete newErrors.position;
                }
                break;
            default:
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (fieldName, value) => {
        setFormData({ ...formData, [fieldName]: value });
        validateField(fieldName, value);
    };

    const handleSelectChange = (fieldName, value) => {
        setFormData({ ...formData, [fieldName]: value });
        validateField(fieldName, value);
    };

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
                        onValueChange={(value) => handleSelectChange('department', value)}
                    >
                        <SelectTrigger className={errors.department ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select Staff Department" />
                        </SelectTrigger>
                        <SelectContent>
                            {/* Academic Organizations */}
                            <SelectItem value="School of Management and Accountancy">School of Management and Accountancy</SelectItem>
                            <SelectItem value="School of Liberal Arts">School of Liberal Arts</SelectItem>
                            <SelectItem value="College of Science, Information Technology, and Engineering">College of Science, Information Technology, and Engineering</SelectItem>
                            <SelectItem value="School of Education">School of Education</SelectItem>
                            <SelectItem value="College of Nursing">College of Nursing</SelectItem>
                            
                            {/* Administrative Departments */}
                            <SelectItem value="Registrar">Registrar</SelectItem>
                            <SelectItem value="Student Affairs">Student Affairs</SelectItem>

                        </SelectContent>
                    </Select>
                    {errors.department && (
                        <div className="flex items-center gap-1 text-red-500 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.department}</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-y-2">
                    <label className="font-bold">Position <span className="text-red-500">*</span></label>
                    <Input 
                        placeholder="Enter Staff Position"
                        value={formData.position || ''}
                        onChange={(e) => handleInputChange('position', e.target.value)}
                        className={errors.position ? "border-red-500" : ""}
                        maxLength={100}
                    />
                    {errors.position && (
                        <div className="flex items-center gap-1 text-red-500 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.position}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StaffProfile;

