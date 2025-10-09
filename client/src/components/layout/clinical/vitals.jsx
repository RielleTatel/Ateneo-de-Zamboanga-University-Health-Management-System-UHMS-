import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Archive, Calendar } from "lucide-react";

const Vitals = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        dateTaken: '',
        bloodPressure: '',
        temperature: '',
        weight: '',
        height: '',
        heartRate: '',
        respiratoryRate: ''
    });
    const [errors, setErrors] = useState({});

    const validateNumericInput = (value, min, max, fieldName) => {
        if (!value) return `${fieldName} is required`;
        const num = parseFloat(value);
        if (isNaN(num)) return `${fieldName} must be a valid number`;
        if (min !== undefined && num < min) return `${fieldName} must be at least ${min}`;
        if (max !== undefined && num > max) return `${fieldName} must be at most ${max}`;
        return '';
    };

    const validateBloodPressure = (value) => {
        if (!value) return 'Blood pressure is required';
        const bpPattern = /^\d{2,3}\/\d{2,3}$/;
        if (!bpPattern.test(value)) return 'Blood pressure must be in format: 120/80';
        
        const [systolic, diastolic] = value.split('/').map(Number);
        if (systolic < 70 || systolic > 250) return 'Systolic pressure must be between 70-250';
        if (diastolic < 40 || diastolic > 150) return 'Diastolic pressure must be between 40-150';
        if (systolic <= diastolic) return 'Systolic must be higher than diastolic';
        return '';
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Date validation
        if (!formData.dateTaken) {
            newErrors.dateTaken = 'Date is required';
        } else {
            const takenDate = new Date(formData.dateTaken);
            const today = new Date();
            if (takenDate > today) {
                newErrors.dateTaken = 'Date cannot be in the future';
            }
        }
        
        // Blood pressure validation
        const bpError = validateBloodPressure(formData.bloodPressure);
        if (bpError) newErrors.bloodPressure = bpError;
        
        // Temperature validation (Celsius)
        const tempError = validateNumericInput(formData.temperature, 30, 45, 'Temperature');
        if (tempError) newErrors.temperature = tempError;
        
        // Weight validation (kg)
        const weightError = validateNumericInput(formData.weight, 1, 500, 'Weight');
        if (weightError) newErrors.weight = weightError;
        
        // Height validation (cm)
        const heightError = validateNumericInput(formData.height, 30, 300, 'Height');
        if (heightError) newErrors.height = heightError;
        
        // Heart rate validation (bpm)
        const hrError = validateNumericInput(formData.heartRate, 30, 250, 'Heart rate');
        if (hrError) newErrors.heartRate = hrError;
        
        // Respiratory rate validation (breaths per minute)
        const rrError = validateNumericInput(formData.respiratoryRate, 5, 60, 'Respiratory rate');
        if (rrError) newErrors.respiratoryRate = rrError;
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleSubmit = () => {
        if (validateForm()) {
            console.log('Vitals submitted:', formData);
            setIsModalOpen(false);
            // Reset form
            setFormData({
                dateTaken: '',
                bloodPressure: '',
                temperature: '',
                weight: '',
                height: '',
                heartRate: '',
                respiratoryRate: ''
            });
            setErrors({});
        }
    };

    return (
        <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6">
            {/* Component header */}
            <div className="flex justify-between items-center gap-2 mb-6">
                <p className="text-xl font-bold">Vitals</p>
                <div className="flex items-center gap-4">
                    <Select defaultValue="recent">
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Most Recent" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="recent">Most Recent</SelectItem>
                            <SelectItem value="oldest">Oldest First</SelectItem>
                            <SelectItem value="date">By Date</SelectItem>
                        </SelectContent>
                    </Select>
                    
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="modify">
                                + Add Vitals
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg max-w-[95vw] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Add Vitals</DialogTitle>
                            </DialogHeader>
                            
                            <Card>
                                <CardContent className="p-4 sm:p-6 space-y-4">
                                    {/* Date Taken */}
                                    <Field>
                                        <FieldLabel>Date Taken *</FieldLabel>
                                        <FieldContent>
                                            <div className="relative">
                                                <Input
                                                    type="date"
                                                    value={formData.dateTaken}
                                                    onChange={(e) => handleInputChange('dateTaken', e.target.value)}
                                                    className={errors.dateTaken ? 'border-red-500' : ''}
                                                />
                                                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                                            </div>
                                            {errors.dateTaken && (
                                                <p className="text-red-500 text-sm mt-1">{errors.dateTaken}</p>
                                            )}
                                        </FieldContent>
                                    </Field>

                                    {/* Vital Signs Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Field>
                                            <FieldLabel>Blood Pressure *</FieldLabel>
                                            <FieldContent>
                                                <Input
                                                    placeholder="120/80"
                                                    value={formData.bloodPressure}
                                                    onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
                                                    className={errors.bloodPressure ? 'border-red-500' : ''}
                                                />
                                                {errors.bloodPressure && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.bloodPressure}</p>
                                                )}
                                            </FieldContent>
                                        </Field>

                                        <Field>
                                            <FieldLabel>Temperature *</FieldLabel>
                                            <FieldContent>
                                                <Input
                                                    type="number"
                                                    step="0.1"
                                                    min="30"
                                                    max="45"
                                                    placeholder="36.5"
                                                    value={formData.temperature}
                                                    onChange={(e) => handleInputChange('temperature', e.target.value)}
                                                    className={errors.temperature ? 'border-red-500' : ''}
                                                />
                                                {errors.temperature && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.temperature}</p>
                                                )}
                                            </FieldContent>
                                        </Field>

                                        <Field>
                                            <FieldLabel>Weight *</FieldLabel>
                                            <FieldContent>
                                                <Input
                                                    type="number"
                                                    step="0.1"
                                                    min="1"
                                                    max="500"
                                                    placeholder="65.0"
                                                    value={formData.weight}
                                                    onChange={(e) => handleInputChange('weight', e.target.value)}
                                                    className={errors.weight ? 'border-red-500' : ''}
                                                />
                                                {errors.weight && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.weight}</p>
                                                )}
                                            </FieldContent>
                                        </Field>

                                        <Field>
                                            <FieldLabel>Height *</FieldLabel>
                                            <FieldContent>
                                                <Input
                                                    type="number"
                                                    step="0.1"
                                                    min="30"
                                                    max="300"
                                                    placeholder="170.0"
                                                    value={formData.height}
                                                    onChange={(e) => handleInputChange('height', e.target.value)}
                                                    className={errors.height ? 'border-red-500' : ''}
                                                />
                                                {errors.height && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.height}</p>
                                                )}
                                            </FieldContent>
                                        </Field>

                                        <Field>
                                            <FieldLabel>Heart Rate *</FieldLabel>
                                            <FieldContent>
                                                <Input
                                                    type="number"
                                                    min="30"
                                                    max="250"
                                                    placeholder="72"
                                                    value={formData.heartRate}
                                                    onChange={(e) => handleInputChange('heartRate', e.target.value)}
                                                    className={errors.heartRate ? 'border-red-500' : ''}
                                                />
                                                {errors.heartRate && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.heartRate}</p>
                                                )}
                                            </FieldContent>
                                        </Field>

                                        <Field>
                                            <FieldLabel>Respiratory Rate *</FieldLabel>
                                            <FieldContent>
                                                <Input
                                                    type="number"
                                                    min="5"
                                                    max="60"
                                                    placeholder="16"
                                                    value={formData.respiratoryRate}
                                                    onChange={(e) => handleInputChange('respiratoryRate', e.target.value)}
                                                    className={errors.respiratoryRate ? 'border-red-500' : ''}
                                                />
                                                {errors.respiratoryRate && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.respiratoryRate}</p>
                                                )}
                                            </FieldContent>
                                        </Field>
                                    </div>
                                </CardContent>
                            </Card>

                            <DialogFooter className="gap-2">
                                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSubmit}>
                                    Add
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Vitals Records */}
            <div className="space-y-4">
                {/* September 3, 2025 Record */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="font-semibold text-gray-900 text-lg">September 3, 2025</h3>
                        <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <Edit className="w-4 h-4 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <Archive className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>
                    </div>
                    
                    {/* Vital Signs Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">Blood Pressure</p>
                            <p className="font-medium text-gray-900">120/80</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">Weight</p>
                            <p className="font-medium text-gray-900">65kg</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">Height</p>
                            <p className="font-medium text-gray-900">170cm</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">BMI</p>
                            <p className="font-medium text-gray-900">22.5</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">Heart Rate</p>
                            <p className="font-medium text-gray-900">72 bpm</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">Temperature</p>
                            <p className="font-medium text-gray-900">36.8 °C</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">Respiratory Rate</p>
                            <p className="font-medium text-gray-900">16</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Vitals; 