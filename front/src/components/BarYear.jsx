// import React from 'react'
import { Bar } from "react-chartjs-2";
import { useSelector } from "react-redux";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  // PointElement,
  // LineElement,
  BarElement,
  // Title,
  // Tooltip,
  // Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import { axiosIns2 } from "../config/axios";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement
  // PointElement,
  // LineElement,
  // Title,
  // Tooltip,
  // Legend
);

function BarChart() {
  const user = useSelector((state) => state.user.user);
  const [data, setData] = useState(null);
  const getData = async () => {
    try {
      const res = await axiosIns2.get(`/graph1/${user._id}`);
      setData(res.data.data);
    } catch (err) {
      console.log(err.response.data.message);
    }
  };
  const barData = {
    labels: data?.year,
    datasets: [
      {
        label: "Year wise Income",
        data: data?.income,
        borderWidth: 1,
        backgroundColor: "white",
        borderColor: "pink",
      },
      {
        label: "Year wise expense",
        data: data?.expense,
        borderWidth: 1,
        backgroundColor: "pink",
        borderColor: "white",
      },
    ],
  };

  const options = {
    scales: {
      x: {
        ticks: {
          color: "orange", // X-axis label color
        },
      },
      y: {
        ticks: {
          color: "orange", // Y-axis label color
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "white", // Legend label color
        },
      },
    },
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    data && (
      <div className="overflow-x-auto">
        <Bar options={options} data={barData} />{" "}
      </div>
    )
  );
}

export default BarChart;
