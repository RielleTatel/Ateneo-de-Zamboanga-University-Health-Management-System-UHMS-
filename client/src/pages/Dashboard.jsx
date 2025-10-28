import React from "react";
import Navigation from "../components/layout/navigation.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Users, Calendar, FileText, Activity, TrendingUp, AlertCircle } from "lucide-react";

const Dashboard = () => {
    // Sample data for charts
    const monthlyVisitsData = [
        { month: 'Jan', visits: 45 },
        { month: 'Feb', visits: 52 },
        { month: 'Mar', visits: 48 },
        { month: 'Apr', visits: 61 },
        { month: 'May', visits: 55 },
        { month: 'Jun', visits: 67 },
    ];

    const healthMetricsData = [
        { metric: 'Normal', count: 156, color: '#22c55e' },
        { metric: 'At Risk', count: 23, color: '#f59e0b' },
        { metric: 'Critical', count: 8, color: '#ef4444' },
    ];

    const weeklyAppointmentsData = [
        { day: 'Mon', appointments: 12 },
        { day: 'Tue', appointments: 15 },
        { day: 'Wed', appointments: 8 },
        { day: 'Thu', appointments: 18 },
        { day: 'Fri', appointments: 14 },
        { day: 'Sat', appointments: 6 },
        { day: 'Sun', appointments: 3 },
    ];

    return (
        <div className="bg-background-primary w-screen min-h-screen flex flex-row">

            <Navigation/>  

            {/* Main Content */}
            <div className="flex-1 flex-col"> 
                <div className="flex-1 flex-col p-4"> 
                    <div className="min-w-full p-3"> 
                        <p className="text-[20px]"> <b> Dashboard </b> </p>
                    </div> 

                    <div className="bg-background-secondary mt-2 min-h-[700px] rounded-[23px] border-outline border-2 p-7"> 
                        {/* Welcome Section */}

                        <div className="mb-8 flex flex-col gap-y-2">
                            <h1 className="text-[36px] font-bold">Dashboard Overview </h1>
                            <p className="text-[15px] text-gray-600">Welcome back, John Doe</p>
                        </div>

                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <Card className="bg-white shadow-sm border-outline">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                                    <Users className="h-4 w-4 text-blue-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">1,247</div>
                                    <p className="text-xs text-green-600 flex items-center">
                                        <TrendingUp className="h-3 w-3 mr-1" />
                                        +12% from last month
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-white shadow-sm border-outline">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Appointments Today</CardTitle>
                                    <Calendar className="h-4 w-4 text-green-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">24</div>
                                    <p className="text-xs text-gray-600">
                                        18 completed, 6 pending
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-white shadow-sm border-outline">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Lab Reports</CardTitle>
                                    <FileText className="h-4 w-4 text-purple-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">89</div>
                                    <p className="text-xs text-gray-600">
                                        Pending review
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-white shadow-sm border-outline">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">3</div>
                                    <p className="text-xs text-red-600">
                                        Requires immediate attention
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            {/* Monthly Visits Chart */}
                            <Card className="bg-white shadow-sm border-outline">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">Monthly Clinic Visits</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={monthlyVisitsData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip />
                                            <Line 
                                                type="monotone" 
                                                dataKey="visits" 
                                                stroke="#1B7EEC" 
                                                strokeWidth={2}
                                                dot={{ fill: '#1B7EEC', strokeWidth: 2, r: 4 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Health Status Distribution */}
                            <Card className="bg-white shadow-sm border-outline">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">Patient Health Status</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={healthMetricsData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={5}
                                                dataKey="count"
                                            >
                                                {healthMetricsData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="flex justify-center space-x-4 mt-4">
                                        {healthMetricsData.map((item, index) => (
                                            <div key={index} className="flex items-center">
                                                <div 
                                                    className="w-3 h-3 rounded-full mr-2" 
                                                    style={{ backgroundColor: item.color }}
                                                ></div>
                                                <span className="text-sm">{item.metric}: {item.count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Weekly Appointments Chart */}
                        <Card className="bg-white shadow-sm border-outline">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">Weekly Appointments</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={weeklyAppointmentsData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="day" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="appointments" fill="#1B7EEC" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div> 
    );
}

export default Dashboard; 