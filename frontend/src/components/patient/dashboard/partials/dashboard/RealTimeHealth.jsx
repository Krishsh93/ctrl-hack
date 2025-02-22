import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";



export default function RealTimeHealth() {
    const socket = io("http://localhost:4000", {
        transports: ["websocket"], // Forces WebSocket transport
        reconnection: true,  // Ensures reconnection attempts
        reconnectionAttempts: 10, // Max attempts
        reconnectionDelay: 5000, // Delay between attempts
      });
  const [data, setData] = useState([]);
  const [prediction, setPrediction] = useState("Normal");
  socket.on("connect", () => {
    console.log("Connected to Socket.IO Server");
  });
  
  useEffect(() => {
    socket.on("healthData", (newData) => {
      setData((prev) => [...prev.slice(-20), { time: new Date().toLocaleTimeString(), ...newData }]);
    });

    socket.on("prediction", (pred) => {
      setPrediction(pred.risk);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="p-4 bg-white shadow-lg rounded-xl">
      <h2 className="text-lg font-semibold">📊 Real-Time Patient Monitoring</h2>
      <p>Risk Prediction: <strong className={prediction === "High Risk" ? "text-red-600" : "text-green-600"}>{prediction}</strong></p>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="heartRate" stroke="red" name="Heart Rate" />
          <Line type="monotone" dataKey="systolicBP" stroke="blue" name="Systolic BP" />
          <Line type="monotone" dataKey="diastolicBP" stroke="green" name="Diastolic BP" />
          <Line type="monotone" dataKey="spo2" stroke="orange" name="SPO2" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
