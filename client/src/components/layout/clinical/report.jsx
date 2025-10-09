import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Archive, FileText, Calendar } from "lucide-react";

const Report = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        date: '',
        medicalClearanceStatus: 'fit',
        clinicalFindings: '',
        diagnosis: '',
        chronicRiskFactors: '',
        treatmentPlan: '',
        medicationPrescribed: '',
        lifestyleAdvice: '',
        nextCheckupDate: ''
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = () => {
        console.log('Report submitted:', formData);
        setIsModalOpen(false);
        // Reset form 
        
        setFormData({
            date: '',
            medicalClearanceStatus: 'fit',
            clinicalFindings: '',
            diagnosis: '',
            chronicRiskFactors: '',
            treatmentPlan: '',
            medicationPrescribed: '',
            lifestyleAdvice: '',
            nextCheckupDate: ''
        });
    };

    return (
        <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6">
            {/* Component header */}
            <div className="flex justify-between items-center gap-2 mb-6">
                <p className="text-xl font-bold">Doctor Report</p>
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
                                +Add Report
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Edit Report</DialogTitle>
                            </DialogHeader>
                            
                            <Card>
                                <CardContent className="p-6 space-y-4">
                                    {/* Date and Medical Clearance Status */}
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
                                            <FieldLabel>Medical Clearance Status</FieldLabel>
                                            <FieldContent>
                                                <Select value={formData.medicalClearanceStatus} onValueChange={(value) => handleInputChange('medicalClearanceStatus', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="fit">Fit</SelectItem>
                                                        <SelectItem value="unfit">Unfit</SelectItem>
                                                        <SelectItem value="conditional">Conditional</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FieldContent>
                                        </Field>
                                    </div>

                                    {/* Clinical Findings */}
                                    <Field>
                                        <FieldLabel>Clinical Findings</FieldLabel>
                                        <FieldContent>
                                            <Textarea
                                                placeholder="Slight wheezing in lungs"
                                                value={formData.clinicalFindings}
                                                onChange={(e) => handleInputChange('clinicalFindings', e.target.value)}
                                                rows={2}
                                            />
                                        </FieldContent>
                                    </Field>

                                    {/* Diagnosis */}
                                    <Field>
                                        <FieldLabel>Diagnosis</FieldLabel>
                                        <FieldContent>
                                            <Textarea
                                                placeholder="Asthma - Mild"
                                                value={formData.diagnosis}
                                                onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                                                rows={2}
                                            />
                                        </FieldContent>
                                    </Field>

                                    {/* Chronic Risk Factors */}
                                    <Field>
                                        <FieldLabel>Chronic Risk Factors</FieldLabel>
                                        <FieldContent>
                                            <Textarea
                                                placeholder="No Significant Factors"
                                                value={formData.chronicRiskFactors}
                                                onChange={(e) => handleInputChange('chronicRiskFactors', e.target.value)}
                                                rows={2}
                                            />
                                        </FieldContent>
                                    </Field>

                                    {/* Treatment Plan */}
                                    <Field>
                                        <FieldLabel>Treatment Plan</FieldLabel>
                                        <FieldContent>
                                            <Textarea
                                                placeholder="Continue current Asthma controller, follow-up if worse"
                                                value={formData.treatmentPlan}
                                                onChange={(e) => handleInputChange('treatmentPlan', e.target.value)}
                                                rows={2}
                                            />
                                        </FieldContent>
                                    </Field>

                                    {/* Medication Prescribed */}
                                    <Field>
                                        <FieldLabel>Medication Prescribed</FieldLabel>
                                        <FieldContent>
                                            <Textarea
                                                placeholder="Fluticasone inhaler — 1 puff BID for maintenance"
                                                value={formData.medicationPrescribed}
                                                onChange={(e) => handleInputChange('medicationPrescribed', e.target.value)}
                                                rows={2}
                                            />
                                        </FieldContent>
                                    </Field>

                                    {/* Lifestyle Advice */}
                                    <Field>
                                        <FieldLabel>Lifestyle Advice</FieldLabel>
                                        <FieldContent>
                                            <Textarea
                                                placeholder="Avoid allergens like dust or pollen, continue regular exercise"
                                                value={formData.lifestyleAdvice}
                                                onChange={(e) => handleInputChange('lifestyleAdvice', e.target.value)}
                                                rows={2}
                                            />
                                        </FieldContent>
                                    </Field>

                                    {/* Next Checkup Date */}
                                    <Field>
                                        <FieldLabel>Next Checkup Date</FieldLabel>
                                        <FieldContent>
                                            <div className="relative">
                                                <Input
                                                    type="date"
                                                    value={formData.nextCheckupDate}
                                                    onChange={(e) => handleInputChange('nextCheckupDate', e.target.value)}
                                                />
                                                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
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

            {/* Doctor Report Records */}
            <div className="space-y-4">
                {/* September 3, 2025 Report */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="p-2 bg-gray-200 rounded-full">
                                <FileText className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Report on September 3, 2025</h3>
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

export default Report; 