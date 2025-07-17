import React, { useState } from "react";
import "./SmartChatWidget.scss";
import { DeviceStatusApi } from "./DeviceStatusApi";
import { IModelDataApi } from "./IModelDataApi";

const SmartChatWidget = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("Ask me something about the building.");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    setLoading(true);
    const jsonData = await DeviceStatusApi.getData();
    const iModelData = await IModelDataApi.getSmartDevices();

    const context = `
      Here is sensor data from a digital twin:
      JSON Device Data: ${JSON.stringify(jsonData, null, 2)}
      iModel Devices: ${JSON.stringify(iModelData, null, 2)}
      Question: ${question}
    `;

    const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        //Add API Key
        //Authorization: "Bearer Add_API_Key",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemma-3-27b-it:free",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that summarizes emergency alerts, smart sensors, and occupancy from a digital twin model.",
          },
          { role: "user", content: context },
        ],
      }),
    });

    const result = await aiResponse.json();
    setResponse(result?.choices?.[0]?.message?.content || "No response.");
    setLoading(false);
  };

  return (
    <div className="smart-chat-widget">
      <h3>Ask about your building</h3>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="e.g. List all fire alarms"
      />
      <button onClick={askAI} disabled={loading}>
        {loading ? "Thinking..." : "Ask"}
      </button>
      <div className="response-box">{response}</div>
    </div>
  );
};

export default SmartChatWidget;
