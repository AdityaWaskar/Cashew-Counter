import React, { useState, useEffect } from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Line } from "react-chartjs-2";
import "./graph.css";
import { useSelector } from "react-redux";

const Graph = (props) => {
  const { workerList } = useSelector((state) => state.workers);
  let GetTop5Workers = () => {
    let sortedEntries = Object.entries(props.workerData).sort(
      (a, b) => b[1] - a[1]
    );
    sortedEntries = sortedEntries.slice(0, 5); // for top 5 entries
    return sortedEntries;
  };

  return (
    <div>
      <div>Top 5 Workers</div>
      <Line
        data={{
          labels: GetTop5Workers()?.map((d) => workerList[d[0]]["name"]),
          datasets: [
            {
              label: "Cahew Count",
              data: GetTop5Workers()?.map((d) => d[1]),
              backgroundColor: "rgba(75,192,192,0.2)",
              borderColor: "rgba(75,192,192,1)",
              fill: true,
            },
          ],
        }}
      />
    </div>
  );
};

export default Graph;
