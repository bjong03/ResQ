import React, { useEffect, useState } from "react";
import { DeviceStatusApi } from "./DeviceStatusApi";
import "./SmartDeviceAlertWidget.scss";

interface FireAlert {
  deviceId: string;
  alert: string;
  type: "fire" | "no-signal" | "exit-blocked";
}

interface EmergencyContact {
  name: string;
  role: string;
  phone: string;
}

interface Person {
  Name: string;
  DOB: string;
  Unit: number;
  "Medical Conditions": string;
}

const mockContacts: EmergencyContact[] = [
  { name: "John Smith", role: "Fire Chief", phone: "555-123-4567" },
  { name: "Emily Chen", role: "Safety Officer", phone: "555-987-6543" },
  { name: "Liam Patel", role: "Building Manager", phone: "555-234-5678" },
];

export const SmartDeviceAlertWidget = () => {
  const [fireAlerts, setFireAlerts] = useState<FireAlert[]>([]);
  const [directory, setDirectory] = useState<Person[]>([]);
  const [activeTab, setActiveTab] = useState<"alerts" | "directory" | "contacts">("alerts");

  useEffect(() => {
    const fetchData = async () => {
      const data = await DeviceStatusApi.getData();
      const alerts: FireAlert[] = [];
      const people: Person[] = [];

      for (const [key, status] of Object.entries(data)) {
        if (key.startsWith("person")) {
          people.push(status as Person);
        } else {
          const unit = status["Unit"];
          if (status["Fire Detected"] === true && status["Is Exit"] === false) {
            alerts.push({
              deviceId: key,
              alert: `Unit ${unit}, ${key}: Fire Detected`,
              type: "fire",
            });
          } else if (status["Is On"] === false) {
            alerts.push({
              deviceId: key,
              alert: `Unit ${unit}, ${key}: No Signal`,
              type: "no-signal",
            });
          } else if (status["Fire Detected"] === true && status["Is Exit"] === true) {
            alerts.push({
              deviceId: key,
              alert: `Unit ${unit}, ${key}: Exit Blocked`,
              type: "exit-blocked",
            });
          }
        }
      }

      setFireAlerts(alerts);
      setDirectory(people);
    };

    fetchData();
  }, []);

  const getPersonIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "mobility":
        return "personmobility.png";
      case "vision":
        return "personvision.png";
      case "hearing":
        return "personhearing.png";
      default:
        return "person.png";
    }
  };

  return (
    <div className="smart-alert-widget">
      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "alerts" ? "tab active" : "tab"}
          onClick={() => setActiveTab("alerts")}
        >
          Alerts
        </button>
        <button
          className={activeTab === "directory" ? "tab active" : "tab"}
          onClick={() => setActiveTab("directory")}
        >
          Directory
        </button>
        <button
          className={activeTab === "contacts" ? "tab active" : "tab"}
          onClick={() => setActiveTab("contacts")}
        >
          Emergency Contacts
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "alerts" ? (
        fireAlerts.map((alert) => (
          <div
            key={alert.deviceId}
            className={`alert-line ${
              alert.type === "no-signal"
                ? "no-signal"
                : alert.type === "exit-blocked"
                ? "exit-blocked"
                : ""
            }`}
          >
            <img
              src={
                alert.type === "fire"
                  ? "firedetected.png"
                  : alert.type === "no-signal"
                  ? "nosignal.png"
                  : "exitblocked.png"
              }
              alt={alert.alert}
              className="alert-icon"
            />
            <span className="alert-text">{alert.alert}</span>
          </div>
        ))
      ) : activeTab === "directory" ? (
        <div className="directory-list">
          {directory.map((person, index) => (
            <div key={index} className="person-line">
              <img
                src={getPersonIcon(person["Medical Conditions"])}
                alt="Person"
                className="alert-icon"
              />
              <div className="person-details">
                Name: {person.Name} <br />
                Unit: {person.Unit} <br />
                Date of Birth: {person.DOB} <br />
                Medical Conditions: {person["Medical Conditions"]}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="contacts-list">
          {mockContacts.map((contact, index) => (
            <div key={index} className="contact-line">
              <strong>{contact.name}</strong> – {contact.role} <br />
              📞 {contact.phone}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
