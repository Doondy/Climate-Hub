import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const Lifestyle = ({ weather }) => {
  if (!weather) return null;

  const { temp, humidity } = weather.main;
  const description = weather.weather[0].main.toLowerCase();

  // --- Clothing Suggestion ---
  let clothing = "Normal clothes are fine today.";
  if (temp < 10) clothing = "It's quite cold 🥶 – wear a jacket and warm clothes.";
  else if (temp >= 10 && temp < 20) clothing = "Mild weather 🌤 – a light sweater or jacket should work.";
  else if (temp >= 20 && temp < 30) clothing = "Comfortable weather 😎 – T-shirt and jeans are fine.";
  else if (temp >= 30) clothing = "Hot day 🥵 – wear light, breathable clothes.";

  // --- Activity Suggestion ---
  let activity = "A nice day for normal activities!";
  if (description.includes("rain")) activity = "Rainy day 🌧 – carry an umbrella or stay indoors.";
  else if (description.includes("clear")) activity = "Clear skies ☀️ – perfect for a walk, run, or picnic.";
  else if (description.includes("snow")) activity = "Snowy weather ❄️ – good for indoor activities, dress warm!";
  else if (description.includes("storm")) activity = "Stormy ⚡ – better to stay inside today.";

  // --- Health Suggestion ---
  let health = "";
  if (humidity > 80) health = "High humidity 🫁 – may feel uncomfortable, drink water.";
  if (temp > 35) health = "Extreme heat alert 🔥 – stay hydrated, avoid long outdoor exposure.";
  if (temp < 5) health = "Cold alert 🧣 – keep warm, risk of catching a cold.";

  return (
    <Card className="mt-6 shadow-lg rounded-2xl p-4 bg-gradient-to-r from-blue-100 to-blue-200">
      <CardContent>
        <h2 className="text-xl font-bold mb-4 text-blue-900">🌟 Lifestyle Tips</h2>
        <ul className="space-y-3 text-base text-gray-700">
          <li><strong>👕 Clothing:</strong> {clothing}</li>
          <li><strong>🎯 Activity:</strong> {activity}</li>
          {health && <li><strong>❤️ Health:</strong> {health}</li>}
        </ul>
      </CardContent>
    </Card>
  );
};

export default Lifestyle;