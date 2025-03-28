// import React from 'react'
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(Tooltip, Legend, ArcElement);
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { axiosIns2 } from "../config/axios";
import toast from "react-hot-toast";
function PieChart() {
  const user = useSelector((state) => state.user.user);
  const [data, setData] = useState(null);
  const getData = async () => {
    try {
      const res = await axiosIns2.get(`/graph4/${user?._id}`);
      setData(res.data.data);
    } catch (err) {
      console.log(err.response.data.message);
      toast.error(err.response.data.message);
    }
  };

  const options = {
    responsive: true, // Makes the chart responsive
    maintainAspectRatio: false, // Prevents default aspect ratio
    plugins: {
      legend: {
        position: "bottom", // Position of legend (top, bottom, left, right)
        labels: {
          color: "white", // Legend text color
          font: {
            size: 14, // Font size
          },
        },
      },
      tooltip: {
        enabled: true, // Enables tooltips
        // backgroundColor: "rgba(0,0,0,0.7)", // Tooltip background color
        titleColor: "white", // Tooltip title color
        bodyColor: "white", // Tooltip body text color
      },
    },
  };

  const pieData = {
    labels: data?.categories,
    datasets: [
      {
        label: "Category-wise Expense",
        data: data?.expense,
        backgroundColor: [
          "#FF6384", // Red
          "#36A2EB", // Blue
          "#FFCE56", // Yellow
          "#4BC0C0", // Teal
          "#9966FF", // Purple
          "#FF9F40", // Orange
          "#E7E9ED", // Gray
          "#76A346", // Green
        ],
        borderColor: "#fff",
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  useEffect(() => {
    getData();
  }, [user]);

  return <Pie options={options} data={pieData} />;
}

export default PieChart;
