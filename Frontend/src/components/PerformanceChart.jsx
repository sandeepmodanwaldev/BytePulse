import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const PerformanceChart = ({ times = [], memory = [] }) => {
  // Convert time to milliseconds and memory to MB
  const timeData = times.map(
    (t) => Math.round(parseFloat(t.replace(" s", "")) * 1000) || 0
  );
  const memoryData = memory.map(
    (m) => +(parseInt(m.replace(" KB", "")) / 1024).toFixed(2) || 0
  );

  const totalTimeInSec = (
    timeData.reduce((acc, val) => acc + val, 0) / 1000
  ).toFixed(2);

  // Total memory in MB
  const totalMemoryInMB = memoryData
    .reduce((acc, val) => acc + val, 0)
    .toFixed(2);

  const labels = times.map((_, i) => `Testcase ${i + 1}`);

  const data = {
    labels,
    datasets: [
      {
        label: "Runtime (ms)",
        data: timeData,
        backgroundColor: "rgba(37, 99, 235, 0.7)", // Blue
        yAxisID: "y",
      },
      {
        label: "Memory (MB)",
        data: memoryData,
        backgroundColor: "rgba(16, 185, 129, 0.7)", // Green
        yAxisID: "y1",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: function (ctx) {
            return `${ctx.dataset.label}: ${ctx.raw}`;
          },
        },
      },
    },
    scales: {
      y: {
        type: "linear",
        position: "left",
        beginAtZero: true,
        title: {
          display: true,
          text: "Time (ms)",
        },
      },
      y1: {
        type: "linear",
        position: "right",
        beginAtZero: true,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: "Memory (MB)",
        },
      },
    },
  };

  return (
    <div className="bg-gray-800/10  text-white p-4 rounded-lg">
      {/* Header */}
      <div className="flex flex-wrap justify-between gap-4 mb-4">
        <div>
          <p className="text-sm text-black dark:text-white">
            🕒 <strong>Runtime</strong>
          </p>
          <p className="text-xl font-bold text-black dark:text-white ">
            {totalTimeInSec} ms
          </p>
        </div>
        <div>
          <p className="text-sm text-black dark:text-white">
            💾 <strong>Memory</strong>
          </p>
          <p className="text-xl font-bold text-black dark:text-white">
            {totalMemoryInMB} MB
          </p>
        </div>
      </div>

      {/* Chart */}
      <Bar data={data} options={options} />
    </div>
  );
};

export default PerformanceChart;
