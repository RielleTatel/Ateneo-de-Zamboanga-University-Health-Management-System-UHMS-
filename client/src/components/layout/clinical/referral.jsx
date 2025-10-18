import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Edit, Archive, CheckCircle, AlertCircle, Send, Calendar, AlertTriangle, FileText } from "lucide-react";

// Mock data for referrals
const initialReferralData = [
    {
        id: 1,
        type: "Follow-up",
        clinicVisitDate: "2025-08-15",
        followUpDate: "2025-09-03",
        reason: "Routine check-up after medication",
        status: "Pending",
        notes: "Patient to return for blood pressure monitoring."
    },
    {
        id: 2,
        type: "Referral",
        clinicVisitDate: "2025-09-03",
        referredTo: "Ciudad Medical Zamboanga",
        reason: "Urinary Analysis",
        status: "Resolved",
        notes: "Results received and reviewed."
    }
];

const blankForm = {
    type: "Referral",
    clinicVisitDate: "",
    followUpDate: "",
    referredTo: "",
    reason: "",
    status: "Pending",
    notes: ""
};

const Referral = () => {
    const [referrals, setReferrals] = useState(initialReferralData);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewEditModalOpen, setIsViewEditModalOpen] = useState(false);
    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [selectedReferral, setSelectedReferral] = useState(null);

    const [formData, setFormData] = useState(blankForm);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        const data = isEditing ? selectedReferral : formData;

        if (!data.clinicVisitDate) newErrors.clinicVisitDate = 'Clinic visit date is required';
        if (data.type === 'Follow-up' && !data.followUpDate) newErrors.followUpDate = 'Follow-up date is required';
        if (data.type === 'Referral' && !data.referredTo.trim()) newErrors.referredTo = 'Referred to is required';
        if (!data.reason.trim()) newErrors.reason = 'Reason is required';

        // Date logic
        if (data.clinicVisitDate) {
             const visitDate = new Date(data.clinicVisitDate);
             const today = new Date();
             today.setHours(0, 0, 0, 0); // Normalize
             if (visitDate > today && visitDate.toDateString() !== today.toDateString()) {
                 newErrors.clinicVisitDate = 'Date cannot be in the future';
             }
        }
        if (data.type === 'Follow-up' && data.followUpDate && data.clinicVisitDate) {
            const followUpDate = new Date(data.followUpDate);
            const visitDate = new Date(data.clinicVisitDate);
            if (followUpDate <= visitDate) {
                newErrors.followUpDate = 'Follow-up date must be after visit date';
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field, value) => {
        const updater = isEditing ? setSelectedReferral : setFormData;
        updater(prev => ({ ...prev, [field]: value }));
        
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSubmit = () => {
        if (validateForm()) {
            if (isEditing) {
                setReferrals(referrals.map(r => r.id === selectedReferral.id ? selectedReferral : r));
            } else {
                setReferrals([{ ...formData, id: Date.now() }, ...referrals]);
            }
            setIsAddModalOpen(false);
            setIsViewEditModalOpen(false);
            setIsEditing(false);
            setSelectedReferral(null);
            setFormData(blankForm);
            setErrors({});
        }
    };
    
    const handleOpenAddModal = () => {
        setIsEditing(false);
        setFormData(blankForm);
        setErrors({});
        setIsAddModalOpen(true);
    };

    const handleOpenViewModal = (referral) => {
        setSelectedReferral(referral);
        setIsEditing(false);
        setIsViewEditModalOpen(true);
    };
    
    const handleOpenEditModal = (e, referral) => {
        e.stopPropagation();
        setSelectedReferral({ ...referral });
        setIsEditing(true);
        setErrors({});
        setIsViewEditModalOpen(true);
    };

    const handleOpenArchiveModal = (e, referral) => {
        e.stopPropagation();
        setSelectedReferral(referral);
        setIsArchiveModalOpen(true);
    };

    const handleArchive = () => {
        setReferrals(referrals.filter(r => r.id !== selectedReferral.id));
        setIsArchiveModalOpen(false);
        setSelectedReferral(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
        });
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Resolved': return 'text-green-600';
            case 'Pending': return 'text-orange-600';
            default: return 'text-gray-600';
        }
    };

    // --- Reusable Form ---
    const ReferralFormFields = ({ data, onInputChange }) => (
        <Card>
            <CardContent className="p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field>
                        <FieldLabel>Log Type *</FieldLabel>
                        <FieldContent>
                            <Select value={data.type} onValueChange={(value) => onInputChange('type', value)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Referral">Referral</SelectItem>
                                    <SelectItem value="Follow-up">Follow-up</SelectItem>
                                </SelectContent>
                            </Select>
                        </FieldContent>
                    </Field>
                    <Field>
                        <FieldLabel>Status *</FieldLabel>
                        <FieldContent>
                            <Select value={data.status} onValueChange={(value) => onInputChange('status', value)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Resolved">Resolved</SelectItem>
                                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </FieldContent>
                    </Field>
                </div>
                <Field>
                    <FieldLabel>Clinic Visit Date *</FieldLabel>
                    <FieldContent>
                        <div className="relative">
                            <Input type="date" value={data.clinicVisitDate} onChange={(e) => onInputChange('clinicVisitDate', e.target.value)} className={errors.clinicVisitDate ? 'border-red-500' : ''} />
                            <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                        {errors.clinicVisitDate && <p className="text-red-500 text-sm mt-1">{errors.clinicVisitDate}</p>}
                    </FieldContent>
                </Field>

                {data.type === 'Referral' ? (
                    <Field>
                        <FieldLabel>Referred To *</FieldLabel>
                        <FieldContent>
                            <Input placeholder="Ciudad Medical Zamboanga" value={data.referredTo} onChange={(e) => onInputChange('referredTo', e.target.value)} className={errors.referredTo ? 'border-red-500' : ''} />
                            {errors.referredTo && <p className="text-red-500 text-sm mt-1">{errors.referredTo}</p>}
                        </FieldContent>
                    </Field>
                ) : (
                    <Field>
                        <FieldLabel>Follow-up Date *</FieldLabel>
                        <FieldContent>
                            <div className="relative">
                                <Input type="date" value={data.followUpDate} onChange={(e) => onInputChange('followUpDate', e.target.value)} className={errors.followUpDate ? 'border-red-500' : ''} />
                                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                            {errors.followUpDate && <p className="text-red-500 text-sm mt-1">{errors.followUpDate}</p>}
                        </FieldContent>
                    </Field>
                )}

                <Field>
                    <FieldLabel>Reason *</FieldLabel>
                    <FieldContent>
                        <Textarea placeholder="Details about the referral or follow-up reason..." value={data.reason} onChange={(e) => onInputChange('reason', e.target.value)} rows={2} className={errors.reason ? 'border-red-500' : ''} />
                        {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
                    </FieldContent>
                </Field>
                <Field>
                    <FieldLabel>Notes</FieldLabel>
                    <FieldContent>
                        <Textarea placeholder="Additional notes..." value={data.notes} onChange={(e) => onInputChange('notes', e.target.value)} rows={2} />
                    </FieldContent>
                </Field>
            </CardContent>
        </Card>
    );

    // --- Reusable View ---
    const ReferralView = ({ item }) => (
        <Card>
            <CardHeader>
                <CardTitle>{item.type} Log from {formatDate(item.clinicVisitDate)}</CardTitle>
                <CardDescription className={`font-semibold ${getStatusClass(item.status)}`}>
                    Status: {item.status}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {item.type === 'Referral' ? (
                    <div className="flex items-start gap-3">
                        <Send className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                        <div><p className="text-sm text-gray-500">Referred to</p><p className="font-semibold">{item.referredTo}</p></div>
                    </div>
                ) : (
                    <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                        <div><p className="text-sm text-gray-500">Follow-up Date</p><p className="font-semibold">{formatDate(item.followUpDate)}</p></div>
                    </div>
                )}
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                    <div><p className="text-sm text-gray-500">Reason</p><p className="font-semibold">{item.reason}</p></div>
                </div>
                <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
                    <div><p className="text-sm text-gray-500">Notes</p><p className="font-semibold">{item.notes || "N/A"}</p></div>
                </div>
            </CardContent>
        </Card>
    );


    return (
        <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6">
            {/* Component header */}
            <div className="flex justify-between items-center gap-2 mb-6">
                <p className="text-xl font-bold">Follow-up/Referral Logs</p>
                <div className="flex items-center gap-4">
                    <Select defaultValue="recent">
                        <SelectTrigger className="w-40"><SelectValue placeholder="Most Recent" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="recent">Most Recent</SelectItem>
                            <SelectItem value="oldest">Oldest First</SelectItem>
                            <SelectItem value="date">By Date</SelectItem>
                        </SelectContent>
                    </Select>
                    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="modify" onClick={handleOpenAddModal}>
                                + Add Log
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg max-w-[95vw] max-h-[90vh] overflow-y-auto">
                            <DialogHeader><DialogTitle>Add Follow-up/Referral Log</DialogTitle></DialogHeader>
                            <ReferralFormFields data={formData} onInputChange={handleInputChange} />
                            <DialogFooter className="gap-2">
                                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                                <Button onClick={handleSubmit}>Add Log</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Referral/Follow-up Records */}
            <div className="space-y-4">
                {referrals.length > 0 ? (
                    referrals.map((item) => (
                        <div 
                            key={item.id} 
                            className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors"
                            onClick={() => handleOpenViewModal(item)}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-3">{item.type} - {formatDate(item.clinicVisitDate)}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 text-sm">
                                        {item.type === 'Referral' ? (
                                            <div><span className="text-gray-500">Referred to: </span>{item.referredTo}</div>
                                        ) : (
                                            <div><span className="text-gray-500">Follow-up: </span>{formatDate(item.followUpDate)}</div>
                                        )}
                                        <div><span className="text-gray-500">Reason: </span>{item.reason}</div>
                                        <div><span className="text-gray-500">Status: </span><span className={`font-medium ${getStatusClass(item.status)}`}>{item.status}</span></div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => handleOpenEditModal(e, item)} title="Edit Log">
                                        <Edit className="w-4 h-4 text-gray-600" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => handleOpenArchiveModal(e, item)} title="Archive Log">
                                        <Archive className="w-4 h-4 text-gray-600" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center">No follow-up or referral logs found.</p>
                )}
            </div>

            {/* --- VIEW/EDIT MODAL --- */}
            <Dialog open={isViewEditModalOpen} onOpenChange={setIsViewEditModalOpen}>
                <DialogContent className="sm:max-w-lg max-w-[95vw] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? 'Edit Log' : 'Log Details'}</DialogTitle>
                    </DialogHeader>
                    
                    {selectedReferral && (
                        isEditing ? (
                            <ReferralFormFields data={selectedReferral} onInputChange={handleInputChange} />
                        ) : (
                            <ReferralView item={selectedReferral} />
                        )
                    )}

                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsViewEditModalOpen(false)}>
                            {isEditing ? 'Cancel' : 'Close'}
                        </Button>
                        {isEditing && (
                            <Button onClick={handleSubmit}>
                                Save Changes
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* --- ARCHIVE CONFIRMATION MODAL --- */}
            <Dialog open={isArchiveModalOpen} onOpenChange={setIsArchiveModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            Archive Log
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to archive this {selectedReferral?.type.toLowerCase()} log from {formatDate(selectedReferral?.clinicVisitDate)}?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsArchiveModalOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleArchive}>Archive</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Referral;