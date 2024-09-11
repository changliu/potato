'use client';

import { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns'; // Import the date adapter

interface SensorData {
  temperature: number;
  humidity: number;
  timestamp: string;
}

const fetchData = async (): Promise<SensorData[]> => {
  const res = await fetch('/api/get-data');
  const data = await res.json();
  return data;
};

export default function Home() {
  const [data, setData] = useState<SensorData[]>([]);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const ctx = document.getElementById('chart') as HTMLCanvasElement;

    if (!chartRef.current) {
      chartRef.current = new Chart(ctx.getContext('2d')!, {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              label: 'Temperature',
              data: [],
              borderColor: 'rgba(255, 99, 132, 0.2)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              fill: false,
            },
            {
              label: 'Humidity',
              data: [],
              borderColor: 'rgba(54, 162, 235, 0.2)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              fill: false,
            },
          ],
        },
        options: {
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'second',
              },
            },
          },
        },
      });
    }

    const updateChart = async () => {
      const fetchedData = await fetchData();
      setData(fetchedData);

      const newTimestamps = fetchedData.map(item => item.timestamp);
      const newTemperatures = fetchedData.map(item => item.temperature);
      const newHumidities = fetchedData.map(item => item.humidity);

      if (chartRef.current) {
        chartRef.current.data.labels = newTimestamps;
        chartRef.current.data.datasets[0].data = newTemperatures;
        chartRef.current.data.datasets[1].data = newHumidities;
        chartRef.current.update();
      }
    };

    updateChart();
    const interval = setInterval(updateChart, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Sensor Data</h1>
      <canvas id="chart" width="400" height="200"></canvas>
    </div>
  );
}
