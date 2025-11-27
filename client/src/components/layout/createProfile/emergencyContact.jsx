import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";

const EmergencyContact = ({ formData, setFormData }) => {
    const [errors, setErrors] = useState({});

    const validateField = (fieldName, value) => {
        const newErrors = { ...errors };

        switch (fieldName) {
            case 'emergencyFirstName':
                if (!value || value.trim() === '') {
                    newErrors.emergencyFirstName = 'First name is required';
                } else if (!/^[a-zA-Z\s.-]+$/.test(value)) {
                    newErrors.emergencyFirstName = 'First name should contain only letters';
                } else if (value.trim().length < 2) {
                    newErrors.emergencyFirstName = 'First name must be at least 2 characters';
                } else if (value.trim().length > 50) {
                    newErrors.emergencyFirstName = 'First name must not exceed 50 characters';
                } else {
                    delete newErrors.emergencyFirstName;
                }
                break;
            case 'emergencyMiddleName':
                // Middle name is optional but if provided, validate
                if (value && value.trim() !== '') {
                    if (!/^[a-zA-Z\s.-]+$/.test(value)) {
                        newErrors.emergencyMiddleName = 'Middle name should contain only letters';
                    } else if (value.trim().length > 50) {
                        newErrors.emergencyMiddleName = 'Middle name must not exceed 50 characters';
                    } else {
                        delete newErrors.emergencyMiddleName;
                    }
                } else {
                    delete newErrors.emergencyMiddleName;
                }
                break;
            case 'emergencyLastName':
                if (!value || value.trim() === '') {
                    newErrors.emergencyLastName = 'Last name is required';
                } else if (!/^[a-zA-Z\s.-]+$/.test(value)) {
                    newErrors.emergencyLastName = 'Last name should contain only letters';
                } else if (value.trim().length < 2) {
                    newErrors.emergencyLastName = 'Last name must be at least 2 characters';
                } else if (value.trim().length > 50) {
                    newErrors.emergencyLastName = 'Last name must not exceed 50 characters';
                } else {
                    delete newErrors.emergencyLastName;
                }
                break;
            case 'emergencyRelationship':
                if (!value || value.trim() === '') {
                    newErrors.emergencyRelationship = 'Relationship is required';
                } else if (!/^[a-zA-Z\s-]+$/.test(value)) {
                    newErrors.emergencyRelationship = 'Relationship should contain only letters';
                } else if (value.trim().length < 2) {
                    newErrors.emergencyRelationship = 'Relationship must be at least 2 characters';
                } else if (value.trim().length > 50) {
                    newErrors.emergencyRelationship = 'Relationship must not exceed 50 characters';
                } else {
                    delete newErrors.emergencyRelationship;
                }
                break;
            case 'emergencyContactNumber':
                if (!value || value.trim() === '') {
                    newErrors.emergencyContactNumber = 'Contact number is required';
                } else {
                    // Remove all non-digit characters for validation
                    const digitsOnly = value.replace(/\D/g, '');
                    
                    if (digitsOnly.length < 10) {
                        newErrors.emergencyContactNumber = 'Contact number must be at least 10 digits';
                    } else if (digitsOnly.length > 15) {
                        newErrors.emergencyContactNumber = 'Contact number must not exceed 15 digits';
                    } else if (!/^[0-9\s()+-]+$/.test(value)) {
                        newErrors.emergencyContactNumber = 'Invalid contact number format';
                    } else {
                        delete newErrors.emergencyContactNumber;
                    }
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

    return (
        <div>
            <div className="flex justify-center items-center mb-8">
                <p className="text-[23px]"> <b> Emergency Contact </b> </p>
            </div>

            <div className="flex flex-col gap-y-4 p-2 mx-auto">
                <div className="flex flex-col gap-y-2">
                    <label className="font-bold">Full Name <span className="text-red-500">*</span></label>
                    <div className="flex flex-row gap-x-2">
                        <div className="w-1/3 flex flex-col gap-y-1">
                            <Input 
                                placeholder="First Name" 
                                value={formData.emergencyFirstName || ''}
                                onChange={(e) => handleInputChange('emergencyFirstName', e.target.value)}
                                className={errors.emergencyFirstName ? "border-red-500" : ""}
                                maxLength={50}
                            />
                            {errors.emergencyFirstName && (
                                <div className="flex items-center gap-1 text-red-500 text-xs">
                                    <AlertCircle className="w-3 h-3" />
                                    <span>{errors.emergencyFirstName}</span>
                                </div>
                            )}
                        </div>
                        <div className="w-1/3 flex flex-col gap-y-1">
                            <Input 
                                placeholder="Middle Name" 
                                value={formData.emergencyMiddleName || ''}
                                onChange={(e) => handleInputChange('emergencyMiddleName', e.target.value)}
                                className={errors.emergencyMiddleName ? "border-red-500" : ""}
                                maxLength={50}
                            />
                            {errors.emergencyMiddleName && (
                                <div className="flex items-center gap-1 text-red-500 text-xs">
                                    <AlertCircle className="w-3 h-3" />
                                    <span>{errors.emergencyMiddleName}</span>
                                </div>
                            )}
                        </div>
                        <div className="w-1/3 flex flex-col gap-y-1">
                            <Input 
                                placeholder="Last Name" 
                                value={formData.emergencyLastName || ''}
                                onChange={(e) => handleInputChange('emergencyLastName', e.target.value)}
                                className={errors.emergencyLastName ? "border-red-500" : ""}
                                maxLength={50}
                            />
                            {errors.emergencyLastName && (
                                <div className="flex items-center gap-1 text-red-500 text-xs">
                                    <AlertCircle className="w-3 h-3" />
                                    <span>{errors.emergencyLastName}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-y-2">
                    <label className="font-bold">Relationship <span className="text-red-500">*</span></label>
                    <Input 
                        placeholder="e.g., Parent, Spouse, Sibling"
                        value={formData.emergencyRelationship || ''}
                        onChange={(e) => handleInputChange('emergencyRelationship', e.target.value)}
                        className={errors.emergencyRelationship ? "border-red-500" : ""}
                        maxLength={50}
                    />
                    {errors.emergencyRelationship && (
                        <div className="flex items-center gap-1 text-red-500 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.emergencyRelationship}</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-y-2">
                    <label className="font-bold">Contact Number <span className="text-red-500">*</span></label>
                    <Input 
                        placeholder="e.g., 0926-786-1245 or +63 926 786 1245"
                        value={formData.emergencyContactNumber || ''}
                        onChange={(e) => handleInputChange('emergencyContactNumber', e.target.value)}
                        className={errors.emergencyContactNumber ? "border-red-500" : ""}
                        maxLength={20}
                    />
                    {errors.emergencyContactNumber && (
                        <div className="flex items-center gap-1 text-red-500 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.emergencyContactNumber}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmergencyContact;

