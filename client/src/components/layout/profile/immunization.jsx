import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Archive, Calendar } from "lucide-react";

const Immunization = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        vaccineType: '',
        lastAdministered: '',
        nextDue: '',
        complianceStatus: 'up-to-date'
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = () => {
        console.log('Form submitted:', formData);
        setIsModalOpen(false);
        // Reset form
        setFormData({
            vaccineType: '',
            lastAdministered: '',
            nextDue: '',
            complianceStatus: 'up-to-date'
        });
    };

    return (
                    <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6">

                    {/* Component header */}
                        <div className="flex justify-between items-center gap-2">
                                <p> <b> Immunization Records </b> </p> 

                                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="modify">
                                            + Add Immunization
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>Add Immunization</DialogTitle>
                                        </DialogHeader>
                                        
                                        <Card>
                                            <CardContent className="p-6 space-y-4">
                                                {/* Vaccine Type */}
                                                <Field>
                                                    <FieldLabel>Vaccine Type</FieldLabel>
                                                    <FieldContent>
                                                        <Input
                                                            placeholder="COVID - 19 (PFIZER)"
                                                            value={formData.vaccineType}
                                                            onChange={(e) => handleInputChange('vaccineType', e.target.value)}
                                                        />
                                                    </FieldContent>
                                                </Field>

                                                {/* Date Fields */}
                                                <div className="grid grid-cols-2 gap-4">
                                                    <Field>
                                                        <FieldLabel>Last Administered</FieldLabel>
                                                        <FieldContent>
                                                            <div className="relative">
                                                                <Input
                                                                    type="date"
                                                                    value={formData.lastAdministered}
                                                                    onChange={(e) => handleInputChange('lastAdministered', e.target.value)}
                                                                />
                                                                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                                                            </div>
                                                        </FieldContent>
                                                    </Field>

                                                    <Field>
                                                        <FieldLabel>Next Due (if applicable)</FieldLabel>
                                                        <FieldContent>
                                                            <div className="relative">
                                                                <Input
                                                                    type="date"
                                                                    value={formData.nextDue}
                                                                    onChange={(e) => handleInputChange('nextDue', e.target.value)}
                                                                />
                                                                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                                                            </div>
                                                        </FieldContent>
                                                    </Field>
                                                </div>

                                                {/* Compliance Status */}
                                                <Field>
                                                    <FieldLabel>Compliance Status</FieldLabel>
                                                    <FieldContent>
                                                        <Select value={formData.complianceStatus} onValueChange={(value) => handleInputChange('complianceStatus', value)}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select status" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="up-to-date">Up-to-date</SelectItem>
                                                                <SelectItem value="completed">Completed</SelectItem>
                                                                <SelectItem value="overdue">Overdue</SelectItem>
                                                                <SelectItem value="missed">Missed</SelectItem>
                                                            </SelectContent>
                                                        </Select>
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

                    {/* Immunization Records */}
                    <div className="space-y-4 mt-6">
                        {/* COVID-19 Record */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">COVID - 19 (PFIZER)</h3>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
                                        <span>Last Administered: August 5, 2022</span>
                                        <span className="hidden sm:inline">•</span>
                                        <span className="text-green-600 font-medium">Compliance Status: Completed</span>
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

                        {/* Hepatitis B Record */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">Hepatitis B</h3>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
                                        <span>Last Administered: July 5, 2007</span>
                                        <span className="hidden sm:inline">•</span>
                                        <span className="text-green-600 font-medium">Compliance Status: Completed</span>
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

                        {/* Influenza Record */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">Influenza</h3>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
                                        <span>Last Administered: August 23, 2024</span>
                                        <span className="hidden sm:inline">•</span>
                                        <span className="text-orange-600 font-medium">Compliance Status: Overdue</span>
                                    </div>
                                    <div className="mt-1 text-sm text-red-600">
                                        Due Next: August 23, 2025 (Missed)
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

export default Immunization; 

