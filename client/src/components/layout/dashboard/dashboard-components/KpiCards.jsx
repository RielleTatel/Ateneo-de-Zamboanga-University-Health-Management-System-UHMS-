import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Droplet, Activity, Scale } from 'lucide-react';

const KPI_CONFIGS = [
  {
    key: 'hypertensive',
    title: 'Hypertensive Crisis',
    icon: Heart,
    iconColor: 'text-red-600',
    threshold: 'BP > 140/90 mmHg',
    description: 'Requires immediate attention',
    dataKey: 'hypertensiveCount'
  },
  {
    key: 'cholesterol',
    title: 'High Cholesterol',
    icon: Droplet,
    iconColor: 'text-orange-600',
    threshold: 'LDL > 130 mg/dL',
    description: 'High cardiovascular risk',
    dataKey: 'criticalLDLCount'
  },
  {
    key: 'diabetic',
    title: 'Diabetic Watch',
    icon: Activity,
    iconColor: 'text-purple-600',
    threshold: 'HbA1c > 6.5%',
    description: 'Elevated diabetes risk',
    dataKey: 'diabeticWatchCount'
  },
  {
    key: 'obesity',
    title: 'Obesity Alert',
    icon: Scale,
    iconColor: 'text-amber-600',
    threshold: 'BMI > 30 kg/m²',
    description: 'Weight management needed',
    dataKey: 'obesityCount'
  }
];

const KpiCard = ({ title, icon: Icon, iconColor, threshold, description, value }) => (
  <Card className="bg-white shadow-md border-2" style={{ borderColor: '#0033A0' }}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-5 w-5 ${iconColor}`} />
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold">{value}</div>
      <p className={`text-xs mt-2 ${iconColor}`}>{threshold}</p>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </CardContent>
  </Card>
);

const KpiCards = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {KPI_CONFIGS.map(config => (
        <KpiCard
          key={config.key}
          title={config.title}
          icon={config.icon}
          iconColor={config.iconColor}
          threshold={config.threshold}
          description={config.description}
          value={data[config.dataKey]}
        />
      ))}
    </div>
  );
};

export default KpiCards;
