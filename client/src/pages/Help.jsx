import React from "react";
import Navigation from "../components/layout/navigation.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LayoutDashboard, 
  Users2, 
  Shield, 
  UserPlus, 
  FileText, 
  Activity,
  Clock,
  CheckCircle
} from "lucide-react";

const Help = () => {
  const helpSections = [
    {
      title: "Overview Dashboard",
      icon: <LayoutDashboard className="w-6 h-6 text-blue-600" />,
      description: "Your main dashboard provides a quick overview of system statistics and activities.",
      steps: [
        "View total number of registered patients",
        "Monitor recent consultations and encounters",
        "Track vital sign measurements",
        "Review laboratory results summary"
      ]
    },
    {
      title: "Patient Records Management",
      icon: <Users2 className="w-6 h-6 text-green-600" />,
      description: "Manage and access all patient information in one centralized location.",
      steps: [
        "Search for patients by name, ID, or email",
        "View detailed patient profiles and medical history",
        "Access consultation records and treatment plans",
        "Review laboratory results and vital signs",
        "Update patient information when needed"
      ]
    },
    {
      title: "Admin Control Panel",
      icon: <Shield className="w-6 h-6 text-yellow-600" />,
      description: "Complete control over user accounts and system access. (Admin only)",
      steps: [
        "Review and approve pending registration requests",
        "Create new user accounts manually",
        "Assign roles: Admin, Doctor, Nurse, or Staff",
        "Remove users from the system",
        "Monitor all registered users"
      ]
    },
    {
      title: "User Registration Process",
      icon: <UserPlus className="w-6 h-6 text-purple-600" />,
      description: "How new users join the system and get access.",
      steps: [
        "New users submit a registration request",
        "Request goes to Admin's 'Pending Registrations' tab",
        "Admin reviews the applicant's details",
        "Admin approves or rejects the request",
        "Approved users can access the system"
      ]
    },
    {
      title: "Clinical Documentation",
      icon: <FileText className="w-6 h-6 text-indigo-600" />,
      description: "Record and manage patient encounters and consultations.",
      steps: [
        "Create new consultation records",
        "Document chief complaints and symptoms",
        "Record physical examination findings",
        "Enter diagnosis and treatment plans",
        "Generate prescriptions and recommendations"
      ]
    },
    {
      title: "Vital Signs & Lab Work",
      icon: <Activity className="w-6 h-6 text-red-600" />,
      description: "Track patient vital signs and laboratory results.",
      steps: [
        "Record vital signs: BP, temperature, pulse, etc.",
        "Enter laboratory test results",
        "View historical trends and patterns",
        "Flag abnormal values for follow-up",
        "Generate reports for review"
      ]
    }
  ];

  const quickTips = [
    {
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      tip: "Use the search function to quickly find patient records"
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      tip: "All changes are automatically saved to maintain data integrity"
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      tip: "Admin approval is required for all new user registrations"
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      tip: "Access levels vary by role: Admin > Doctor > Nurse > Staff"
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      tip: "Always logout when finished to maintain system security"
    }
  ];

  return (
    <div className="bg-background-primary w-screen min-h-screen flex flex-row">
      <Navigation />

      {/* Main Content */}
      <div className="flex-1 flex-col p-4">
        <div className="min-w-full p-3">
          <p className="text-[20px]">
            <b> Help & Documentation </b>
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Learn how to use the ADZU Health Management System
          </p>
        </div>

        <div className="bg-background-secondary mt-2 min-h-[700px] rounded-[23px] border-outline border-2 p-7">
          {/* Introduction */}
          <div className="mb-8">
            <h1 className="text-[32px] font-bold mb-4">
              Welcome to ADZU Health Management System
            </h1>
            <p className="text-gray-700 text-base leading-relaxed">
              This system is designed to streamline healthcare management at Ateneo de Zamboanga University. 
              It provides comprehensive tools for patient record management, clinical documentation, user administration, 
              and healthcare analytics. Below you'll find detailed guides on how to use each feature of the system.
            </p>
          </div>

          {/* Help Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {helpSections.map((section, index) => (
              <Card key={index} className="border-outline border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    {section.icon}
                    {section.title}
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    {section.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-blue-600 font-bold mt-0.5">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Tips */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-blue-600" />
              Quick Tips
            </h2>
            <div className="space-y-3">
              {quickTips.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  {item.icon}
                  <p className="text-gray-700">{item.tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Support Information */}
          <div className="mt-8 bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Need Additional Help?</h2>
            <p className="text-gray-700 mb-4">
              If you encounter any issues or have questions not covered in this guide, please contact:
            </p>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>IT Support:</strong> support@adzu.edu.ph
              </p>
              <p>
                <strong>System Administrator:</strong> admin@adzu.edu.ph
              </p>
              <p>
                <strong>Office Hours:</strong> Monday - Friday, 8:00 AM - 5:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;

