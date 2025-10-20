import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const Encounters = () => { 


    
    return (
        <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6"> 
            <div className="flex justify-between items-center gap-2 mb-6"> 
                <p className="text-xl font-bold"> Notes </p> 

                <div className="flex items-center gap-4"> 
                    {/* --- Drop down button --- */}  
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

                    {/* --- ADD MODAL --- */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="modify">
                                +Add Report
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl max-w-[95vw] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Add Report </DialogTitle>
                            </DialogHeader>
                                
                            <DialogFooter className="gap-2">
                                <Button variant="outline" >Cancel</Button>
                                <Button >Add</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog> 

                </div>

            </div> 
        </div>
    )
} 

export default Encounters; 

