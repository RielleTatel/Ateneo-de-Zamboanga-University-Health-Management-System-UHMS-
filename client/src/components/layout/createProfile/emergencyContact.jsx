import React from "react";
import { Input } from "@/components/ui/input";

const EmergencyContact = ({ formData, setFormData }) => {
    return (
        <div>
            <div className="flex justify-center items-center mb-8">
                <p className="text-[23px]"> <b> Emergency Contact </b> </p>
            </div>

            <div className="flex flex-col gap-y-4 p-2 mx-auto">
                <div className="flex flex-col gap-y-2">
                    <label className="font-bold">Full Name <span className="text-red-500">*</span></label>
                    <div className="flex flex-row gap-x-2">
                        <Input 
                            className="w-1/3" 
                            placeholder="Roberta" 
                            value={formData.emergencyFirstName || ''}
                            onChange={(e) => setFormData({ ...formData, emergencyFirstName: e.target.value })}
                        />
                        <Input 
                            className="w-1/3" 
                            placeholder="Lim" 
                            value={formData.emergencyMiddleName || ''}
                            onChange={(e) => setFormData({ ...formData, emergencyMiddleName: e.target.value })}
                        />
                        <Input 
                            className="w-1/3" 
                            placeholder="Ramos" 
                            value={formData.emergencyLastName || ''}
                            onChange={(e) => setFormData({ ...formData, emergencyLastName: e.target.value })}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-y-2">
                    <label className="font-bold">Relationship <span className="text-red-500">*</span></label>
                    <Input 
                        placeholder="Husband"
                        value={formData.emergencyRelationship || ''}
                        onChange={(e) => setFormData({ ...formData, emergencyRelationship: e.target.value })}
                    />
                </div>

                <div className="flex flex-col gap-y-2">
                    <label className="font-bold">Contact Number <span className="text-red-500">*</span></label>
                    <Input 
                        placeholder="0926-786-1245"
                        value={formData.emergencyContactNumber || ''}
                        onChange={(e) => setFormData({ ...formData, emergencyContactNumber: e.target.value })}
                    />
                </div>
            </div>
        </div>
    );
};

export default EmergencyContact;

