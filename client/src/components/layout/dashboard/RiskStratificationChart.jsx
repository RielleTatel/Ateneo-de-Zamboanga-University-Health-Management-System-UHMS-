import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Shield } from 'lucide-react';

const RiskStratificationChart = ({ data }) => {
  return (
    <Card className="bg-white shadow-md border-2 border-outline">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Shield className="h-5 w-5" style={{ color: '#0033A0' }} />
          Risk Stratification
        </CardTitle>
        <p className="text-sm text-gray-500">Medical clearance distribution</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-center space-x-6 mt-4">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="text-2xl font-bold mb-1" style={{ color: item.color }}>
                {item.value}
              </div>
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium">{item.name}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskStratificationChart;
