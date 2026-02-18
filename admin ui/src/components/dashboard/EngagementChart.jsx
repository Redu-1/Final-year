// src/components/dashboard/EngagementChart.jsx
import { useEffect, useState } from 'react';

const EngagementChart = ({ herbs = [], timeRange = 'today' }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Generate chart data based on herbs creation dates
    const now = new Date();
    const data = [];
    
    // Get last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      // Count herbs created on this date
      const count = herbs.filter(herb => {
        const created = new Date(herb.createdAt);
        return created.toDateString() === date.toDateString();
      }).length;
      
      data.push({
        day: dateStr,
        herbs: count,
        interactions: Math.floor(count * (Math.random() * 3 + 2)) // Simulated interactions
      });
    }
    
    setChartData(data);
  }, [herbs, timeRange]);

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No data available
      </div>
    );
  }

  const maxHerbs = Math.max(...chartData.map(d => d.herbs), 1);

  return (
    <div className="h-64">
      <div className="flex items-end justify-between h-48 mb-2">
        {chartData.map((item, index) => (
          <div key={index} className="flex flex-col items-center w-1/7">
            <div className="relative w-full flex justify-center">
              <div 
                className="w-8 bg-emerald-500 rounded-t-lg transition-all duration-500 hover:bg-emerald-600"
                style={{ height: `${(item.herbs / maxHerbs) * 150}px` }}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700">
                  {item.herbs}
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-600 mt-2">{item.day}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-4">
        <span>Herbs added per day</span>
        <span>Total: {herbs.length} herbs</span>
      </div>
    </div>
  );
};

export default EngagementChart;