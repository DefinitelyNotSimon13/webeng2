import React from "react";
import { useSettings } from ".";

import "./ExampleSettingsUsage.css";

export default function ExampleSettingsUsage() {
  const settings = useSettings();
  console.log("Settings: ", settings);
  return (
    <>
      <div className="settings-example-list">
        <h2 className="settings-example-title">Settings Example</h2>
        <h3>Current Settings</h3>
        {Object.keys(settings).map((key) => (
          <p key={key}>
            {key}: {settings[key]}
          </p>
        ))}
        <h3>Access a specific setting</h3>
        <p>Language: {settings.language}</p>
      </div>
    </>
  );
}
