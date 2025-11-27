import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";

const StudentProfile = ({ formData, setFormData }) => {
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
            case 'course':
                if (!value || value.trim() === '') {
                    newErrors.course = 'Course is required';
                } else {
                    delete newErrors.course;
                }
                break;
            case 'yearLevel':
                if (!value || value.trim() === '') {
                    newErrors.yearLevel = 'Year level is required';
                } else {
                    delete newErrors.yearLevel;
                }
                break;
            default:
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSelectChange = (fieldName, value) => {
        setFormData({ ...formData, [fieldName]: value });
        validateField(fieldName, value);
    };

    return (
        <div>
            <div className="flex justify-center items-center mb-8">
                <p className="text-[23px]"> <b> Student Details </b> </p>
            </div>

            <div className="flex flex-col gap-y-4 p-2 mx-auto">
                <div className="flex flex-col gap-y-2">
                    <label className="font-bold">Department <span className="text-red-500">*</span></label>
                    <Select 
                        value={formData.department} 
                        onValueChange={(value) => handleSelectChange('department', value)}
                    >
                        <SelectTrigger className={errors.department ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select Student Department" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="School of Arts and Sciences">School of Arts and Sciences</SelectItem>
                            <SelectItem value="School of Business and Entrepreneurship">School of Business and Entrepreneurship</SelectItem>
                            <SelectItem value="School of Education">School of Education</SelectItem>
                            <SelectItem value="School of Engineering and Architecture">School of Engineering and Architecture</SelectItem>
                            <SelectItem value="School of Nursing">School of Nursing</SelectItem>
                            <SelectItem value="School of Law">School of Law</SelectItem>
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
                    <label className="font-bold">Course <span className="text-red-500">*</span></label>
                    <Select 
                        value={formData.course} 
                        onValueChange={(value) => handleSelectChange('course', value)}
                    >
                        <SelectTrigger className={errors.course ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select Student Course" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="BS Computer Science">BS Computer Science</SelectItem>
                            <SelectItem value="BS Information Technology">BS Information Technology</SelectItem>
                            <SelectItem value="BS Business Administration">BS Business Administration</SelectItem>
                            <SelectItem value="BS Accountancy">BS Accountancy</SelectItem>
                            <SelectItem value="BS Psychology">BS Psychology</SelectItem>
                            <SelectItem value="BS Nursing">BS Nursing</SelectItem>
                            <SelectItem value="BS Civil Engineering">BS Civil Engineering</SelectItem>
                            <SelectItem value="Bachelor of Elementary Education">Bachelor of Elementary Education</SelectItem>
                            <SelectItem value="Bachelor of Secondary Education">Bachelor of Secondary Education</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.course && (
                        <div className="flex items-center gap-1 text-red-500 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.course}</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-y-2">
                    <label className="font-bold">Year Level <span className="text-red-500">*</span></label>
                    <Select 
                        value={formData.yearLevel} 
                        onValueChange={(value) => handleSelectChange('yearLevel', value)}
                    >
                        <SelectTrigger className={errors.yearLevel ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select Year Level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1st Year">1st Year</SelectItem>
                            <SelectItem value="2nd Year">2nd Year</SelectItem>
                            <SelectItem value="3rd Year">3rd Year</SelectItem>
                            <SelectItem value="4th Year">4th Year</SelectItem>
                            <SelectItem value="5th Year">5th Year</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.yearLevel && (
                        <div className="flex items-center gap-1 text-red-500 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.yearLevel}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
