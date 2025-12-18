
import React, { useState } from "react"; 
import { useMutation } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/layout/navigation";
import StaffProfile from "@/components/layout/createProfile/staffProfile";
import StudentProfile from "@/components/layout/createProfile/studentProfile";
import EmergencyContact from "@/components/layout/createProfile/emergencyContact";
import axiosInstance from "@/lib/axiosInstance";

import { Link, useNavigate } from "react-router-dom";
import { 
    Breadcrumb, 
    BreadcrumbList, 
    BreadcrumbItem, 
    BreadcrumbLink, 
    BreadcrumbPage, 
    BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

// API function to add patient
const addPatient = async (patientData) => {
    const { data } = await axiosInstance.post("/patients/add", patientData);
    return data;
};

const CreateProfile = () => {
    const navigate = useNavigate(); // Allows redirection and history manipulation via code
    
    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState({});
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

    // Mutation to add patient
    const addPatientMutation = useMutation({
        mutationFn: addPatient,
        onSuccess: (data) => {
            // Navigate back to records page after successful submission
            navigate('/records');
        },
        onError: (error) => {
            console.error('Error creating patient:', error);
        }
    });

    // Validation functions
    const validateField = (fieldName, value) => {
        const newErrors = { ...errors };

        switch (fieldName) {
            case 'userRole':
                if (!value || value.trim() === '') {
                    newErrors.userRole = 'User role is required';
                } else {
                    delete newErrors.userRole;
                }
                break;
            case 'idNumber':
                if (!value || value.trim() === '') {
                    newErrors.idNumber = 'ID number is required';
                } else if (value.trim().length < 3) {
                    newErrors.idNumber = 'ID number must be at least 3 characters';
                } else {
                    delete newErrors.idNumber;
                }
                break;
            case 'firstName':
                if (!value || value.trim() === '') {
                    newErrors.firstName = 'First name is required';
                } else if (!/^[a-zA-Z\s.-]+$/.test(value)) {
                    newErrors.firstName = 'First name should contain only letters';
                } else if (value.trim().length < 2) {
                    newErrors.firstName = 'First name must be at least 2 characters';
                } else {
                    delete newErrors.firstName;
                }
                break;
            case 'middleName':
                // Middle name is optional but validate if provided
                if (value && value.trim() !== '') {
                    if (!/^[a-zA-Z\s.-]+$/.test(value)) {
                        newErrors.middleName = 'Middle name should contain only letters';
                    } else {
                        delete newErrors.middleName;
                    }
                } else {
                    delete newErrors.middleName;
                }
                break;
            case 'lastName':
                if (!value || value.trim() === '') {
                    newErrors.lastName = 'Last name is required';
                } else if (!/^[a-zA-Z\s.-]+$/.test(value)) {
                    newErrors.lastName = 'Last name should contain only letters';
                } else if (value.trim().length < 2) {
                    newErrors.lastName = 'Last name must be at least 2 characters';
                } else {
                    delete newErrors.lastName;
                }
                break;
            case 'schoolEmail':
                if (!value || value.trim() === '') {
                    newErrors.schoolEmail = 'School email is required';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    newErrors.schoolEmail = 'Please enter a valid email address';
                } else {
                    delete newErrors.schoolEmail;
                }
                break;
            case 'phoneNumber':
                if (!value || value.trim() === '') {
                    newErrors.phoneNumber = 'Phone number is required';
                } else {
                    const digitsOnly = value.replace(/\D/g, '');
                    if (digitsOnly.length < 10) {
                        newErrors.phoneNumber = 'Phone number must be at least 10 digits';
                    } else if (digitsOnly.length > 15) {
                        newErrors.phoneNumber = 'Phone number must not exceed 15 digits';
                    } else {
                        delete newErrors.phoneNumber;
                    }
                }
                break;
            case 'dateOfBirth':
                if (!value || value.trim() === '') {
                    newErrors.dateOfBirth = 'Date of birth is required';
                } else {
                    delete newErrors.dateOfBirth;
                }
                break;
            case 'age':
                if (!value || value.trim() === '') {
                    newErrors.age = 'Age is required';
                } else if (parseInt(value) < 1 || parseInt(value) > 120) {
                    newErrors.age = 'Please enter a valid age (1-120)';
                } else {
                    delete newErrors.age;
                }
                break;
            case 'sex':
                if (!value || value.trim() === '') {
                    newErrors.sex = 'Sex is required';
                } else {
                    delete newErrors.sex;
                }
                break;
            case 'barangay':
                if (!value || value.trim() === '') {
                    newErrors.barangay = 'Barangay is required';
                } else {
                    delete newErrors.barangay;
                }
                break;
            case 'streetName':
                if (!value || value.trim() === '') {
                    newErrors.streetName = 'Street name is required';
                } else {
                    delete newErrors.streetName;
                }
                break;
            case 'houseNumber':
                if (!value || value.trim() === '') {
                    newErrors.houseNumber = 'House/Unit number is required';
                } else {
                    delete newErrors.houseNumber;
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

    const validateStep = (step) => {
        let isValid = true;
        const newErrors = {};

        if (step === 1) {
            // Validate all Step 1 fields
            const requiredFields = ['userRole', 'idNumber', 'firstName', 'lastName', 'schoolEmail', 
                                  'phoneNumber', 'dateOfBirth', 'age', 'sex', 'barangay', 'streetName', 'houseNumber'];
            
            requiredFields.forEach(field => {
                if (!validateField(field, formData[field])) {
                    isValid = false;
                }
            });

            // Validate middle name if provided
            if (formData.middleName) {
                validateField('middleName', formData.middleName);
            }
        } else if (step === 2) {
            // Validate Step 2 fields based on user role
            if (formData.userRole === 'Staff') {
                if (!formData.department) {
                    newErrors.department = 'Department is required';
                    isValid = false;
                }
                if (!formData.position || formData.position.trim() === '') {
                    newErrors.position = 'Position is required';
                    isValid = false;
                }
            } else {
                if (!formData.department) {
                    newErrors.department = 'Department is required';
                    isValid = false;
                }
                if (!formData.course) {
                    newErrors.course = 'Course is required';
                    isValid = false;
                }
                if (!formData.yearLevel) {
                    newErrors.yearLevel = 'Year level is required';
                    isValid = false;
                }
            }
            setErrors({ ...errors, ...newErrors });
        } else if (step === 3) {
            // Validate Step 3 (Emergency Contact)
            const emergencyFields = ['emergencyFirstName', 'emergencyLastName', 'emergencyRelationship', 'emergencyContactNumber'];
            
            emergencyFields.forEach(field => {
                const value = formData[field];
                if (!value || value.trim() === '') {
                    newErrors[field] = 'This field is required';
                    isValid = false;
                }
            });

            // Validate middle name if provided
            if (formData.emergencyMiddleName) {
                if (!/^[a-zA-Z\s.-]+$/.test(formData.emergencyMiddleName)) {
                    newErrors.emergencyMiddleName = 'Middle name should contain only letters';
                    isValid = false;
                }
            }

            setErrors({ ...errors, ...newErrors });
        }

        return isValid;
    };

    const handleNext = () => {
        if (currentStep < 3) {
            if (validateStep(currentStep)) {
                setCurrentStep(currentStep + 1);
            }
        } else {
            // Validate step 3 before submitting
            if (!validateStep(3)) {
                return;
            }

            // Transform formData to match database schema
            const patientData = {
                role: formData.userRole,
                id_number: formData.idNumber,
                first_name: formData.firstName,
                middle_name: formData.middleName,
                last_name: formData.lastName,
                school_email: formData.schoolEmail,
                phone_number: formData.phoneNumber,
                date_of_birth: formData.dateOfBirth,
                age: formData.age ? parseInt(formData.age) : null,
                sex: formData.sex,
                barangay: formData.barangay,
                street_name: formData.streetName,
                house_number: formData.houseNumber,
                department: formData.department,
                course: formData.course,
                year: formData.yearLevel,
                emergency_first_name: formData.emergencyFirstName,
                emergency_middle_name: formData.emergencyMiddleName,
                emergency_last_name: formData.emergencyLastName,
                emergency_relationship: formData.emergencyRelationship,
                emergency_contact_number: formData.emergencyContactNumber
            };

            console.log('Submitting patient data:', patientData);

            // Submit to backend
            addPatientMutation.mutate(patientData);
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
                                <label className="font-bold">User Role <span className="text-red-500">*</span></label>
                                <Select value={formData.userRole} onValueChange={(value) => handleSelectChange('userRole', value)}>
                                    <SelectTrigger className={errors.userRole ? "border-red-500" : ""}>
                                        <SelectValue placeholder="Select position" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Student"> Student </SelectItem>
                                        <SelectItem value="Staff"> Staff</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.userRole && (
                                    <div className="flex items-center gap-1 text-red-500 text-sm">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>{errors.userRole}</span>
                                    </div>
                                )}
                            </div>
                            <div className="w-1/2 flex flex-col gap-y-2">
                                <label className="font-bold">ID Number <span className="text-red-500">*</span></label>
                                <Input 
                                    value={formData.idNumber} 
                                    onChange={(e) => handleInputChange('idNumber', e.target.value)}
                                    className={errors.idNumber ? "border-red-500" : ""}
                                />
                                {errors.idNumber && (
                                    <div className="flex items-center gap-1 text-red-500 text-sm">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>{errors.idNumber}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-y-2 p-2">
                            <label className="font-bold">Full name <span className="text-red-500">*</span></label>
                            <div className="flex flex-row gap-x-2">
                                <div className="w-1/3 flex flex-col gap-y-1">
                                    <Input 
                                        placeholder="First Name" 
                                        value={formData.firstName} 
                                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                                        className={errors.firstName ? "border-red-500" : ""}
                                        maxLength={50}
                                    />
                                    {errors.firstName && (
                                        <div className="flex items-center gap-1 text-red-500 text-xs">
                                            <AlertCircle className="w-3 h-3" />
                                            <span>{errors.firstName}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="w-1/3 flex flex-col gap-y-1">
                                    <Input 
                                        placeholder="Middle Name (Optional)" 
                                        value={formData.middleName} 
                                        onChange={(e) => handleInputChange('middleName', e.target.value)}
                                        className={errors.middleName ? "border-red-500" : ""}
                                        maxLength={50}
                                    />
                                    {errors.middleName && (
                                        <div className="flex items-center gap-1 text-red-500 text-xs">
                                            <AlertCircle className="w-3 h-3" />
                                            <span>{errors.middleName}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="w-1/3 flex flex-col gap-y-1">
                                    <Input 
                                        placeholder="Last Name" 
                                        value={formData.lastName} 
                                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                                        className={errors.lastName ? "border-red-500" : ""}
                                        maxLength={50}
                                    />
                                    {errors.lastName && (
                                        <div className="flex items-center gap-1 text-red-500 text-xs">
                                            <AlertCircle className="w-3 h-3" />
                                            <span>{errors.lastName}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row gap-x-2 p-2">
                            <div className="w-1/2 flex flex-col gap-y-2">
                                <label className="font-bold">School Email <span className="text-red-500">*</span></label>
                                <Input 
                                    type="email"
                                    value={formData.schoolEmail} 
                                    onChange={(e) => handleInputChange('schoolEmail', e.target.value)}
                                    className={errors.schoolEmail ? "border-red-500" : ""}
                                    placeholder="example@adzu.edu.ph"
                                />
                                {errors.schoolEmail && (
                                    <div className="flex items-center gap-1 text-red-500 text-sm">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>{errors.schoolEmail}</span>
                                    </div>
                                )}
                            </div>
                            <div className="w-1/2 flex flex-col gap-y-2">
                                <label className="font-bold">Phone Number <span className="text-red-500">*</span></label>
                                <Input 
                                    value={formData.phoneNumber} 
                                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                    className={errors.phoneNumber ? "border-red-500" : ""}
                                    placeholder="0926-786-1245"
                                    maxLength={20}
                                />
                                {errors.phoneNumber && (
                                    <div className="flex items-center gap-1 text-red-500 text-sm">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>{errors.phoneNumber}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-row gap-x-2 p-2">
                            <div className="w-1/2 flex flex-col gap-y-2">
                                <label className="font-bold">Date of Birth <span className="text-red-500">*</span></label>
                                <Input 
                                    type="date" 
                                    value={formData.dateOfBirth} 
                                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                    className={errors.dateOfBirth ? "border-red-500" : ""}
                                />
                                {errors.dateOfBirth && (
                                    <div className="flex items-center gap-1 text-red-500 text-sm">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>{errors.dateOfBirth}</span>
                                    </div>
                                )}
                            </div>
                            <div className="w-1/2 flex flex-col gap-y-2">
                                <label className="font-bold">Age <span className="text-red-500">*</span></label>
                                <Input 
                                    type="number" 
                                    value={formData.age} 
                                    onChange={(e) => handleInputChange('age', e.target.value)}
                                    className={errors.age ? "border-red-500" : ""}
                                    min="1"
                                    max="120"
                                />
                                {errors.age && (
                                    <div className="flex items-center gap-1 text-red-500 text-sm">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>{errors.age}</span>
                                    </div>
                                )}
                            </div>
                            <div className="w-1/2 flex flex-col gap-y-2">
                                <label className="font-bold">Sex <span className="text-red-500">*</span></label>
                                <Select value={formData.sex} onValueChange={(value) => handleSelectChange('sex', value)}>
                                    <SelectTrigger className={errors.sex ? "border-red-500" : ""}>
                                        <SelectValue placeholder="Select sex" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Male"> Male </SelectItem>
                                        <SelectItem value="Female"> Female </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.sex && (
                                    <div className="flex items-center gap-1 text-red-500 text-sm">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>{errors.sex}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-y-2 p-2">
                            <label className="font-bold">Address <span className="text-red-500">*</span></label>
                            <div className="flex flex-row gap-x-2">
                                <div className="w-1/3 flex flex-col gap-y-1">
                                    <Input 
                                        placeholder="Barangay" 
                                        value={formData.barangay} 
                                        onChange={(e) => handleInputChange('barangay', e.target.value)}
                                        className={errors.barangay ? "border-red-500" : ""}
                                    />
                                    {errors.barangay && (
                                        <div className="flex items-center gap-1 text-red-500 text-xs">
                                            <AlertCircle className="w-3 h-3" />
                                            <span>{errors.barangay}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="w-1/3 flex flex-col gap-y-1">
                                    <Input 
                                        placeholder="Street Name" 
                                        value={formData.streetName} 
                                        onChange={(e) => handleInputChange('streetName', e.target.value)}
                                        className={errors.streetName ? "border-red-500" : ""}
                                    />
                                    {errors.streetName && (
                                        <div className="flex items-center gap-1 text-red-500 text-xs">
                                            <AlertCircle className="w-3 h-3" />
                                            <span>{errors.streetName}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="w-1/3 flex flex-col gap-y-1">
                                    <Input 
                                        placeholder="House/Unit Number" 
                                        value={formData.houseNumber} 
                                        onChange={(e) => handleInputChange('houseNumber', e.target.value)}
                                        className={errors.houseNumber ? "border-red-500" : ""}
                                    />
                                    {errors.houseNumber && (
                                        <div className="flex items-center gap-1 text-red-500 text-xs">
                                            <AlertCircle className="w-3 h-3" />
                                            <span>{errors.houseNumber}</span>
                                        </div>
                                    )}
                                </div>
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

                    {/* Error/Success Messages */}
                    {addPatientMutation.isError && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                            <AlertCircle className="w-5 h-5" />
                            <span>Error creating profile: {addPatientMutation.error?.response?.data?.error || addPatientMutation.error?.message || 'Unknown error'}</span>
                        </div>
                    )}

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
                                    disabled={addPatientMutation.isPending}
                                >
                                    Back
                                </Button>
                            )}
                            <Button 
                                onClick={handleNext}
                                className="px-6 bg-blue-500 hover:bg-blue-600"
                                disabled={addPatientMutation.isPending}
                            >
                                {addPatientMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    currentStep === 3 ? 'Done' : 'Next'
                                )}
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
