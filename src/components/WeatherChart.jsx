import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function WeatherChart({ data, title }) {
  return (
    <div style={{ width: "90%", height: "400px", margin: "20px auto" }}>
      <h3 style={{ textAlign: "center" }}>{title}</h3>
      <ResponsiveContainer>
        <LineChart data={data}>
          <Line type="monotone" dataKey="value" stroke="#2e8b57" strokeWidth={3} />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WeatherChart;