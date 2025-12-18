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
                            <SelectItem value="Science, Information Technology, and Engineering Academic Organization"> Science, Information Technology, and Engineering Academic Organization (SITEAO) </SelectItem>
                            <SelectItem value="Liberal Arts Academic Organization">Liberal Arts Academic Organization (LAAO) </SelectItem>
                            <SelectItem value=" Education Academic Organization"> Education Academic Organization (EAO) </SelectItem>
                            <SelectItem value="Nursing Academic Organization"> Nursing Academic Organization (NAO) </SelectItem>
                            <SelectItem value="Accountancy Academic Organization"> Accountancy Academic Organization (AAO) </SelectItem>
                            <SelectItem value="Management Academic Organizaion">Management Academic Organizaion (MAO) </SelectItem>
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
                            {/* School of Management and Accountancy */}
                            <SelectItem value="BS Accountancy">BS Accountancy</SelectItem>
                            <SelectItem value="BS Business Administration - Entrepreneurship">BS Business Administration - Entrepreneurship</SelectItem>
                            <SelectItem value="BS Business Administration - Financial Management">BS Business Administration - Financial Management</SelectItem>
                            <SelectItem value="BS Business Administration - Marketing Management">BS Business Administration - Marketing Management</SelectItem>
                            <SelectItem value="BS Legal Management">BS Legal Management</SelectItem>
                            <SelectItem value="BS Management Accounting">BS Management Accounting</SelectItem>
                            <SelectItem value="BS Office Administration">BS Office Administration</SelectItem>
                            
                            {/* School of Liberal Arts */}
                            <SelectItem value="BA Communication">BA Communication</SelectItem>
                            <SelectItem value="BA English Language Studies">BA English Language Studies</SelectItem>
                            <SelectItem value="BA International Studies">BA International Studies</SelectItem>
                            <SelectItem value="BA Philosophy">BA Philosophy</SelectItem>
                            <SelectItem value="BS Psychology">BS Psychology</SelectItem>
                            
                            {/* College of Science, Information Technology, and Engineering */}
                            <SelectItem value="BS Biology">BS Biology</SelectItem>
                            <SelectItem value="BS Biomedical Engineering">BS Biomedical Engineering</SelectItem>
                            <SelectItem value="BS Civil Engineering">BS Civil Engineering</SelectItem>
                            <SelectItem value="BS Computer Engineering">BS Computer Engineering</SelectItem>
                            <SelectItem value="BS Computer Science">BS Computer Science</SelectItem>
                            <SelectItem value="BS Electronics Engineering">BS Electronics Engineering</SelectItem>
                            <SelectItem value="BS Information Technology">BS Information Technology</SelectItem>
                            <SelectItem value="BS Mathematics">BS Mathematics</SelectItem>
                            <SelectItem value="BS New Media and Computer Animation">BS New Media and Computer Animation</SelectItem>
                            <SelectItem value="Associate in Electronics Technology">Associate in Electronics Technology</SelectItem>
                            
                            {/* School of Education */}
                            <SelectItem value="Bachelor of Early Childhood Education">Bachelor of Early Childhood Education</SelectItem>
                            <SelectItem value="Bachelor of Elementary Education">Bachelor of Elementary Education</SelectItem>
                            <SelectItem value="Bachelor of Physical Education">Bachelor of Physical Education</SelectItem>
                            <SelectItem value="Bachelor of Special Needs Education">Bachelor of Special Needs Education</SelectItem>
                            <SelectItem value="Certificate in Professional Education">Certificate in Professional Education</SelectItem>
                            
                            {/* College of Nursing */}
                            <SelectItem value="BS Nursing">BS Nursing</SelectItem>
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
