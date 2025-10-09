import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Archive } from "lucide-react";

const Referral = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        clinicVisitDate: 'September 3, 2025',
        type: 'referral',
        status: 'ongoing',
        reason: ''
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        
        // Clinic Visit Date validation
        if (!formData.clinicVisitDate) {
            newErrors.clinicVisitDate = 'Clinic visit date is required';
        }
        
        // Reason validation
        if (!formData.reason.trim()) {
            newErrors.reason = 'Reason is required';
        } else if (formData.reason.trim().length < 10) {
            newErrors.reason = 'Reason must be at least 10 characters';
        } else if (formData.reason.trim().length > 500) {
            newErrors.reason = 'Reason must not exceed 500 characters';
        }
        
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
            console.log('Referral submitted:', formData);
            setIsModalOpen(false);
            // Reset form
            setFormData({
                clinicVisitDate: 'September 3, 2025',
                type: 'referral',
                status: 'ongoing',
                reason: ''
            });
            setErrors({});
        }
    };

    return (
        <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6">
            {/* Component header */}
            <div className="flex justify-between items-center gap-2 mb-6">
                <p className="text-xl font-bold">Follow-up/Referral Logs</p>
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
                    <Select defaultValue="all">
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="followup">Follow-up</SelectItem>
                            <SelectItem value="referral">Referral</SelectItem>
                        </SelectContent>
                    </Select>
                    
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="modify">
                                +Add
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md max-w-[95vw] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Add Follow-up/Referral</DialogTitle>
                            </DialogHeader>
                            
                            <Card>
                                <CardContent className="p-4 sm:p-6 space-y-4">
                                    {/* Date of Clinic Visit */}
                                    <Field>
                                        <FieldLabel>Date of Clinic Visit *</FieldLabel>
                                        <FieldContent>
                                            <Select value={formData.clinicVisitDate} onValueChange={(value) => handleInputChange('clinicVisitDate', value)}>
                                                <SelectTrigger className={errors.clinicVisitDate ? 'border-red-500' : ''}>
                                                    <SelectValue placeholder="Select date" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="September 3, 2025">September 3, 2025</SelectItem>
                                                    <SelectItem value="August 15, 2025">August 15, 2025</SelectItem>
                                                    <SelectItem value="July 20, 2025">July 20, 2025</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.clinicVisitDate && (
                                                <p className="text-red-500 text-sm mt-1">{errors.clinicVisitDate}</p>
                                            )}
                                        </FieldContent>
                                    </Field>

                                    {/* Type and Status */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Field>
                                            <FieldLabel>Type</FieldLabel>
                                            <FieldContent>
                                                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="referral">Referral</SelectItem>
                                                        <SelectItem value="followup">Follow-up</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FieldContent>
                                        </Field>

                                        <Field>
                                            <FieldLabel>Status</FieldLabel>
                                            <FieldContent>
                                                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="ongoing">Ongoing</SelectItem>
                                                        <SelectItem value="resolved">Resolved</SelectItem>
                                                        <SelectItem value="pending">Pending</SelectItem>
                                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FieldContent>
                                        </Field>
                                    </div>

                                    {/* Reason */}
                                    <Field>
                                        <FieldLabel>Reason *</FieldLabel>
                                        <FieldContent>
                                            <Textarea
                                                placeholder="Provide detailed reason for referral or follow-up (minimum 10 characters)"
                                                value={formData.reason}
                                                onChange={(e) => handleInputChange('reason', e.target.value)}
                                                rows={4}
                                                maxLength={500}
                                                className={errors.reason ? 'border-red-500' : ''}
                                            />
                                            <div className="flex justify-between items-center mt-1">
                                                {errors.reason && (
                                                    <p className="text-red-500 text-sm">{errors.reason}</p>
                                                )}
                                                <p className="text-gray-400 text-xs ml-auto">
                                                    {formData.reason.length}/500
                                                </p>
                                            </div>
                                        </FieldContent>
                                    </Field>
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

            {/* Referral/Follow-up Records */}
            <div className="space-y-4">
                {/* Follow-Up Record */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-3">Follow-Up - September 3, 2025</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">Date of Follow-up: </span>
                                    <span className="text-gray-900">November 3, 2025</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Status: </span>
                                    <span className="text-orange-600 font-medium">Ongoing</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                            <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <Edit className="w-4 h-4 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <Archive className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Referral Record */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-3">Referral - September 3, 2025</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">Referred to: </span>
                                    <span className="text-gray-900">Ciudad Medical Zamboanga</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Reason for Referral: </span>
                                    <span className="text-gray-900">Urinary Analysis</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Status: </span>
                                    <span className="text-green-600 font-medium">Resolved</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                            <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <Edit className="w-4 h-4 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <Archive className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Referral; 