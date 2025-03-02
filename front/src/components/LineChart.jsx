// import React from 'react'
import { Line } from "react-chartjs-2";
import { useSelector } from "react-redux";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import { axiosIns2 } from "../config/axios";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
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

function LineChart() {
  const user = useSelector((state) => state.user.user);
  const [data, setData] = useState(null);
  const getData = async () => {
    try {
      const res = await axiosIns2.get(`/graph3/${user._id}`);
      setData(res.data.data);
    } catch (err) {
      console.log(err.response.data.message);
    }
  };
  const lineData = {
    labels: data?.day,
    datasets: [
      {
        label: "Day wise Income",
        data: data?.income,
        borderWidth: 1,
        backgroundColor: "white",
        borderColor: "rgb(217,1,102)",
      },
      {
        label: "Day wise expense",
        data: data?.expense,
        borderWidth: 1,
        backgroundColor: "pink",
        borderColor: "white",
      },
    ],
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    data && (
      <div className="overflow-x-auto">
        <Line options={options} data={lineData} />{" "}
      </div>
    )
  );
}

export default LineChart;
