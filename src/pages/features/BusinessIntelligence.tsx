import { FeaturePageTemplate } from '@/components/features/FeaturePageTemplate';
import { BarChart3, LineChart, PieChart, TrendingUp } from 'lucide-react';

export default function BusinessIntelligence() {
  return (
    <FeaturePageTemplate
      title="Business Intelligence"
      subtitle="(BI) & Analytics"
      heroDescription="Turn raw industrial data into actionable insights. Leverage AI to forecast demand, uncover bottlenecks, and visualize KPIs."
      capabilities={[
        { icon: BarChart3, title: 'Custom Dashboards', description: 'Build drag-and-drop dashboards tailored to operators, managers, and executives.' },
        { icon: LineChart, title: 'Demand Forecasting', description: 'Use historical data and machine learning to predict future supply and demand.' },
        { icon: TrendingUp, title: 'Bottleneck Analysis', description: 'Automatically identify the slowest nodes in your production lines.' },
        { icon: PieChart, title: 'Cost Allocation', description: 'Track energy, labor, and material costs down to the individual SKU level.' },
      ]}
      benefits={[
        { metric: '+25%', label: 'Profit Margins', icon: TrendingUp },
        { metric: '100%', label: 'Data Visibility', icon: PieChart },
        { metric: '-15%', label: 'Forecast Error', icon: LineChart },
      ]}
      workflows={[
        { title: 'Connect Sources', description: 'Aggregate data from MES, WMS, and ERP.' },
        { title: 'Build Views', description: 'Create custom charts and KPI trackers.' },
        { title: 'Make Decisions', description: 'Use AI insights to steer business strategy.' },
      ]}
    />
  );
}
