import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Archive, Calendar } from "lucide-react";

const Visits = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        date: '',
        attendingStaff: '',
        reason: '',
        actionTaken: 'referral-followup'
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = () => {
        console.log('Visit log submitted:', formData);
        setIsModalOpen(false);
        // Reset form
        setFormData({
            date: '',
            attendingStaff: '',
            reason: '',
            actionTaken: 'referral-followup'
        });
    };

    return (
        <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6">
            {/* Component header */}
            <div className="flex justify-between items-center gap-2 mb-6">
                <p className="text-xl font-bold">Clinic Visit Logs</p>
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
                                + Add Visit Log
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Edit Visit Log</DialogTitle>
                            </DialogHeader>
                            
                            <Card>
                                <CardContent className="p-6 space-y-4">
                                    {/* Date and Action Taken */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <Field>
                                            <FieldLabel>Date</FieldLabel>
                                            <FieldContent>
                                                <div className="relative">
                                                    <Input
                                                        type="date"
                                                        value={formData.date}
                                                        onChange={(e) => handleInputChange('date', e.target.value)}
                                                    />
                                                    <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                                                </div>
                                            </FieldContent>
                                        </Field>

                                        <Field>
                                            <FieldLabel>Action Taken</FieldLabel>
                                            <FieldContent>
                                                <Select value={formData.actionTaken} onValueChange={(value) => handleInputChange('actionTaken', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select action" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="referral-followup">Referral/Follow-up</SelectItem>
                                                        <SelectItem value="treatment">Treatment</SelectItem>
                                                        <SelectItem value="consultation">Consultation</SelectItem>
                                                        <SelectItem value="checkup">Check-up</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FieldContent>
                                        </Field>
                                    </div>

                                    {/* Attending Staff and Reason */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <Field>
                                            <FieldLabel>Attending Staff</FieldLabel>
                                            <FieldContent>
                                                <Input
                                                    placeholder="Dr. AC"
                                                    value={formData.attendingStaff}
                                                    onChange={(e) => handleInputChange('attendingStaff', e.target.value)}
                                                />
                                            </FieldContent>
                                        </Field>

                                        <Field>
                                            <FieldLabel>Reason</FieldLabel>
                                            <FieldContent>
                                                <Input
                                                    placeholder="Medical Check"
                                                    value={formData.reason}
                                                    onChange={(e) => handleInputChange('reason', e.target.value)}
                                                />
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
                                    Save Changes
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Visit Records */}
            <div className="space-y-4">
                {/* September 3, 2025 Record */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-3">September 3, 2025</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">Reason: </span>
                                    <span className="text-gray-900">Medical Check</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Attending Staff: </span>
                                    <span className="text-gray-900">Dr. AC</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Action Taken: </span>
                                    <span className="text-gray-900">Referral/Follow-up</span>
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

export default Visits; 