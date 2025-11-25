
import React, { useState } from "react"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/layout/navigation";
import StaffProfile from "@/components/layout/createProfile/staffProfile";
import StudentProfile from "@/components/layout/createProfile/studentProfile";
import EmergencyContact from "@/components/layout/createProfile/emergencyContact";

import { Link, useNavigate } from "react-router-dom";
import { 
    Breadcrumb, 
    BreadcrumbList, 
    BreadcrumbItem, 
    BreadcrumbLink, 
    BreadcrumbPage, 
    BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";



const CreateProfile = () => {
    const navigate = useNavigate(); // Allows redirection and history manipulation via code
    
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        userRole: '',
        idNumber: '',
        firstName: '',
        middleName: '',
        lastName: '',
        schoolEmail: '',
        phoneNumber: '',
        dateOfBirth: '',
        age: '',
        sex: '',
        barangay: '',
        streetName: '',
        houseNumber: '',

        // Staff/Student specific fields
        department: '',
        position: '', // Staff only
        course: '', // Student only
        yearLevel: '', // Student only

        // Emergency contact fields
        emergencyFirstName: '',
        emergencyMiddleName: '',
        emergencyLastName: '',
        emergencyRelationship: '',
        emergencyContactNumber: ''
    });

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        } else {
            // Handle form submission
            console.log('Form submitted:', formData);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };
    
    const renderBreadcrumb = () => {
        const segments = [
            // Step 0: External link
            { label: 'Records', to: '/records', step: 0 }, 
            // Step 1: Basic info
            { label: 'Create New Profile', step: 1 },
        ];

        if (currentStep >= 2) {
            // Step 2: Details are dynamic based on userRole
            const roleDetailLabel = formData.userRole === 'Staff' ? 'Staff Details' : 'Student Details';
            segments.push({ 
                label: roleDetailLabel, 
                step: 2
            });
        }

        if (currentStep >= 3) {
            // Step 3: Emergency Contact
            segments.push({ 
                label: 'Emergency Contact', 
                step: 3
            });
        }

        const finalSegments = segments.slice(0, currentStep + 1);

        return (
            <div className="flex items-center gap-2 mb-4">
                <button
                    className="text-xl mr-2 hover:text-gray-700 font-bold"
                    onClick={() => navigate(-1)}> 
                    ← 
                </button>
                <Breadcrumb>
                    <BreadcrumbList>
                        {finalSegments.map((segment, index) => {
                            const isLast = index === finalSegments.length - 1;
                            const isExternalLink = segment.step === 0;

                            return (
                                <React.Fragment key={segment.label}>
                                    <BreadcrumbItem>
                                        {isLast ? (
                                            // Current step (last item) is non-clickable
                                            <BreadcrumbPage>{segment.label}</BreadcrumbPage>
                                        ) : isExternalLink ? (
                                            // 'Records' is an external route link
                                            <BreadcrumbLink asChild>
                                                <Link to={segment.to}>{segment.label}</Link>
                                            </BreadcrumbLink>
                                        ) : (
                                            // Previous steps (1, 2) are internal links (clickable)
                                            <BreadcrumbLink asChild>
                                                <a 
                                                    onClick={() => setCurrentStep(segment.step)} 
                                                    className="cursor-pointer" // Add pointer to hint clickability
                                                >
                                                    {segment.label}
                                                </a>
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {!isLast && <BreadcrumbSeparator />}
                                </React.Fragment>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        );
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div>
                        <div className="flex justify-center items-center mb-4">
                            <p className="text-[23px]"> <b> Basic information </b> </p>
                        </div>

                        <div className="flex flex-row gap-x-2 p-2">
                            <div className="w-1/2 flex flex-col gap-y-2">
                                <label className="font-bold">User Role</label>
                                <Select value={formData.userRole} onValueChange={(value) => setFormData({ ...formData, userRole: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select position" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Student"> Student </SelectItem>
                                        <SelectItem value="Staff"> Staff</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-1/2 flex flex-col gap-y-2">
                                <label className="font-bold">ID Number</label>
                                <Input value={formData.idNumber} onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-y-2 p-2">
                            <label className="font-bold"> Full name </label>
                            <div className="flex flex-row gap-x-2">
                                <Input className="w-1/3" placeholder="First Name" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                                <Input className="w-1/3" placeholder="Middle Name" value={formData.middleName} onChange={(e) => setFormData({ ...formData, middleName: e.target.value })} />
                                <Input className="w-1/3" placeholder="Last Name" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                            </div>
                        </div>

                        <div className="flex flex-row gap-x-2 p-2">
                            <div className="w-1/2 flex flex-col gap-y-2">
                                <label className="font-bold"> School Email </label>
                                <Input value={formData.schoolEmail} onChange={(e) => setFormData({ ...formData, schoolEmail: e.target.value })} />
                            </div>
                            <div className="w-1/2 flex flex-col gap-y-2">
                                <label className="font-bold"> Phone Number </label>
                                <Input value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
                            </div>
                        </div>

                        <div className="flex flex-row gap-x-2 p-2">
                            <div className="w-1/2 flex flex-col gap-y-2">
                                <label className="font-bold"> Date of Birth </label>
                                <Input type="date" value={formData.dateOfBirth} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} />
                            </div>
                            <div className="w-1/2 flex flex-col gap-y-2">
                                <label className="font-bold"> Age </label>
                                <Input type="number" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
                            </div>
                            <div className="w-1/2 flex flex-col gap-y-2">
                                <label className="font-bold"> Sex </label>
                                <Select value={formData.sex} onValueChange={(value) => setFormData({ ...formData, sex: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select sex" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Male"> Male </SelectItem>
                                        <SelectItem value="Female"> Female </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-y-2 p-2">
                            <label className="font-bold"> Address </label>
                            <div className="flex flex-row gap-x-2">
                                <Input className="w-1/3" placeholder="Barangay" value={formData.barangay} onChange={(e) => setFormData({ ...formData, barangay: e.target.value })} />
                                <Input className="w-1/3" placeholder="Street Name" value={formData.streetName} onChange={(e) => setFormData({ ...formData, streetName: e.target.value })} />
                                <Input className="w-1/3" placeholder="House/Unit Number" value={formData.houseNumber} onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })} />
                            </div>
                        </div> 
                    </div>
                );
            case 2:
                return formData.userRole === 'Staff' ? (
                    <StaffProfile formData={formData} setFormData={setFormData} />
                ) : (
                    <StudentProfile formData={formData} setFormData={setFormData} />
                );
            case 3:
                return <EmergencyContact formData={formData} setFormData={setFormData} />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-background-primary w-screen min-h-screen flex flex-row">
            {/* 1st half of the screen */}
            <Navigation />

            {/* 2nd half of the screen */}
            <div className="flex-1 flex-col p-4">
                {/* Navigation */}
                <div className="p-4">
                    {renderBreadcrumb()}
                </div>

                {/* 1st container container */}
                <div className="bg-background-secondary mt-2 min-h-[700px] rounded-[23px] border-outline border-2 p-6 relative">
                    <div className="flex justify-center items-center mb-4">
                        <p className="text-[32px]"> <b> Create New Profile </b> </p>

                    </div>

                    <div className="bg-white mt-2 min-h-[600px] rounded-lg p-4 border-outline border-1"> 

                    {/* Second container inside first container */}
                    {renderStepContent()}

                    {/* Progress Bar and Navigation Buttons */}
                    <div className="flex justify-between items-center mt-6">
                        {/* Progress Bar - Bottom Left */}
                        <div className="flex items-center gap-x-4">
                            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-blue-500 transition-all duration-300"
                                    style={{ width: `${(currentStep / 3) * 100}%` }}
                                />
                            </div>
                            <span className="text-sm font-medium">Page {currentStep} / 3</span>
                        </div>

                        {/* Navigation Buttons - Bottom Right */}
                        <div className="flex gap-x-2">
                            {currentStep > 1 && (
                                <Button 
                                    variant="outline" 
                                    onClick={handleBack}
                                    className="px-6"
                                >
                                    Back
                                </Button>
                            )}
                            <Button 
                                onClick={handleNext}
                                className="px-6 bg-blue-500 hover:bg-blue-600"
                            >
                                {currentStep === 3 ? 'Done' : 'Next'}
                            </Button>
                        </div> 
                        
                    </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateProfile;
