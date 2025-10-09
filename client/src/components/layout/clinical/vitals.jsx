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

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = () => {
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
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Add Vitals</DialogTitle>
                            </DialogHeader>
                            
                            <Card>
                                <CardContent className="p-6 space-y-4">
                                    {/* Date Taken */}
                                    <Field>
                                        <FieldLabel>Date Taken:</FieldLabel>
                                        <FieldContent>
                                            <div className="relative">
                                                <Input
                                                    type="date"
                                                    value={formData.dateTaken}
                                                    onChange={(e) => handleInputChange('dateTaken', e.target.value)}
                                                />
                                                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                                            </div>
                                        </FieldContent>
                                    </Field>

                                    {/* Vital Signs Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <Field>
                                            <FieldLabel>Blood Pressure</FieldLabel>
                                            <FieldContent>
                                                <Input
                                                    placeholder="Systolic/Diastolic"
                                                    value={formData.bloodPressure}
                                                    onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
                                                />
                                            </FieldContent>
                                        </Field>

                                        <Field>
                                            <FieldLabel>Temperature</FieldLabel>
                                            <FieldContent>
                                                <Input
                                                    placeholder="Celsius"
                                                    value={formData.temperature}
                                                    onChange={(e) => handleInputChange('temperature', e.target.value)}
                                                />
                                            </FieldContent>
                                        </Field>

                                        <Field>
                                            <FieldLabel>Weight</FieldLabel>
                                            <FieldContent>
                                                <Input
                                                    placeholder="Kilograms"
                                                    value={formData.weight}
                                                    onChange={(e) => handleInputChange('weight', e.target.value)}
                                                />
                                            </FieldContent>
                                        </Field>

                                        <Field>
                                            <FieldLabel>Height</FieldLabel>
                                            <FieldContent>
                                                <Input
                                                    placeholder="Centimeters"
                                                    value={formData.height}
                                                    onChange={(e) => handleInputChange('height', e.target.value)}
                                                />
                                            </FieldContent>
                                        </Field>

                                        <Field>
                                            <FieldLabel>Heart Rate</FieldLabel>
                                            <FieldContent>
                                                <Input
                                                    placeholder="Beats per Minute"
                                                    value={formData.heartRate}
                                                    onChange={(e) => handleInputChange('heartRate', e.target.value)}
                                                />
                                            </FieldContent>
                                        </Field>

                                        <Field>
                                            <FieldLabel>Respiratory Rate</FieldLabel>
                                            <FieldContent>
                                                <Input
                                                    placeholder="Breaths per Minute"
                                                    value={formData.respiratoryRate}
                                                    onChange={(e) => handleInputChange('respiratoryRate', e.target.value)}
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