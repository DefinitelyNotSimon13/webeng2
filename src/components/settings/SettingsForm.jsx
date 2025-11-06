import React, { useState } from "react";
import { List, ListItem, ListInput, Toggle, Block } from "framework7-react";
import { SettingsHelper, useSettings } from "./settings-helper";
import { SettingsConfigPropType } from "./settings-config";

import "./SettingsForm.css";

/**
 * Component: SettingsForm
 * @param {{config: Array}} props - Component props
 * @param {Array} props.config - Settings configuration array
 */
function SettingsForm({ config }) {
  const settings = useSettings();

  /**
   * Update a single setting value
   * @param {string} id
   * @param {*} value
   */
  const updateSetting = (id, value) => {
    SettingsHelper.updateSetting(id, value);
  };

  return (
    <>
      <List dividers>
        {config.map((s) =>
          renderItem(s, settings, settings[s.id], updateSetting),
        )}
      </List>
    </>
  );
}

/**
 * Render a settings item based on its type
 * @param {Object} item - Settings item
 * @param {Object} currentSettings - All current settings
 * @param {*} currentValue - Current value for the item
 * @param {Function} updateSetting - Callback to update the setting
 */
function renderItem(item, currentSettings, currentValue, updateSetting) {
  switch (item.type) {
    case "dropdown":
      return renderDropdownOption(item, currentValue, updateSetting);
    case "checkbox":
      return renderCheckboxOption(item, currentValue, updateSetting);
    case "text":
      return renderTextOption(item, currentValue, updateSetting);
    case "group":
      return renderGroup(item, currentSettings, updateSetting);
    default:
      console.error("Invalid settings item", item);
      return <></>;
  }
}

/**
 * Render dropdown option
 * @param {Object} dropdown - Dropdown settings item
 * @param {*} currentValue - Current selected value
 * @param {Function} updateSetting - Callback to update the setting
 */
function renderDropdownOption(dropdown, currentValue, updateSetting) {
  const [value, setValue] = useState(currentValue);
  return (
    <ListItem
      key={dropdown.id}
      title={dropdown.title}
      smartSelect
      smartSelectParams={{
        openIn: "popover",
        closeOnSelect: true,
      }}
    >
      <select
        name={dropdown.id}
        value={value}
        onChange={onSettingsChange(dropdown.id, setValue, updateSetting)}
      >
        {dropdown.options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.display}
          </option>
        ))}
      </select>
    </ListItem>
  );
}

/**
 * Render checkbox option
 * @param {Object} checkbox - Checkbox settings item
 * @param {boolean} currentValue - Current checked state
 * @param {Function} updateSetting - Callback to update the setting
 */
function renderCheckboxOption(checkbox, currentValue, updateSetting) {
  const [value, setValue] = useState(currentValue);
  const onCheckboxChange = (e) => {
    const val = e.target.checked;
    setValue(val);
    updateSetting(checkbox.id, val);
  };
  return (
    <ListItem key={checkbox.id}>
      <span>{checkbox.title}</span>
      <Toggle
        value={value}
        defaultChecked={currentValue}
        onChange={onCheckboxChange}
      />
    </ListItem>
  );
}

/**
 * Render text option
 * @param {Object} text - Text input settings item
 * @param {string} currentValue - Current text value
 * @param {Function} updateSetting - Callback to update the setting
 */
function renderTextOption(text, currentValue, updateSetting) {
  console.log(text);
  console.log(currentValue);
  const [value, setValue] = useState(currentValue);
  return (
    <ListInput
      key={text.id}
      type="text"
      placeholder={text.placeholder}
      label={text.title}
      value={value}
      onChange={onSettingsChange(text.id, setValue, updateSetting)}
    ></ListInput>
  );
}

/**
 * Render a group of settings
 * @param {Object} group - Group settings item
 * @param {Object} currentSettings - All current settings
 * @param {Function} updateSetting - Callback to update the setting
 */
function renderGroup(group, currentSettings, updateSetting) {
  return (
    <ListItem key={group.id} className="settings-group-list-item">
      <div>
        <p>{group.title}</p>
        <Block strong className="settings-block">
          <List className="settings-group-list">
            {group.members.map((s) =>
              renderItem(
                s,
                currentSettings,
                currentSettings[s.id],
                updateSetting,
              ),
            )}
          </List>
        </Block>
      </div>
    </ListItem>
  );
}

/**
 * Create change handler for settings inputs
 * @param {string} id - Setting ID
 * @param {Function} setState - State setter function
 * @param {Function} updateSetting - Callback to update the setting
 * @returns {Function} Change event handler
 */
function onSettingsChange(id, setState, updateSetting) {
  return (e) => {
    const val = e.target.value;
    setState(val);
    updateSetting(id, val);
  };
}

SettingsForm.propTypes = {
  config: SettingsConfigPropType.isRequired,
};

export default SettingsForm;
