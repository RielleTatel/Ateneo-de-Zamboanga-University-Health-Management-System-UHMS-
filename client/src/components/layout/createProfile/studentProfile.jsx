import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const StudentProfile = ({ formData, setFormData }) => {
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
                        onValueChange={(value) => setFormData({ ...formData, department: value })}
                    >
                        <SelectTrigger>
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
                </div>

                <div className="flex flex-col gap-y-2">
                    <label className="font-bold">Course <span className="text-red-500">*</span></label>
                    <Select 
                        value={formData.course} 
                        onValueChange={(value) => setFormData({ ...formData, course: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Student Department" />
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
                </div>

                <div className="flex flex-col gap-y-2">
                    <label className="font-bold">Year Level <span className="text-red-500">*</span></label>
                    <Select 
                        value={formData.yearLevel} 
                        onValueChange={(value) => setFormData({ ...formData, yearLevel: value })}
                    >
                        <SelectTrigger>
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
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
