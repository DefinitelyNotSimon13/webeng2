import { f7, useStore } from "framework7-react";
import { SETTINGS_CONFIG } from "./settings-config";

/** Storage key for settings */
const STORAGE_KEY = "app:settings";

/**
 * Class: SettingsHelper
 */
export class SettingsHelper {
  /**
   * Retrieve settings from local storage
   * @returns {Object}
   */
  static fromLocalStorage() {
    console.debug("[SettingsHelper] Retrieving settings from local storage");
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.error(
        "[SettingsHelper] failed to retrieve settings from local storage",
        e,
      );
      return {};
    }
  }

  /**
   * Save values to local storage
   * @param {Object} values
   */
  static saveToLocalStorage(values) {
    console.debug("[SettingsHelper] Saving settings to local storage");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
  }

  /**
   * Initialize settings into the global store
   */
  static initSettingsStore() {
    f7.store.dispatch("loadSettings", SETTINGS_CONFIG);
  }

  /**
   * Update a single setting in the store
   * @param {string} id
   * @param {*} value
   */
  static updateSetting(id, value) {
    f7.store.dispatch("setSetting", { id, value });
  }

  /**
   * Iterate over settings items (flattens groups)
   * @param {Array} settings
   */
  static *iterSettings(settings = []) {
    for (const s of settings) {
      if (s?.type === "group") {
        yield* this.iterSettings(s.members);
      } else if (s) {
        yield s;
      }
    }
  }
}

/**
 * Hook: useSettingsStore
 * @returns {*} store
 */
export function useSettings() {
  return useStore("settings");
}
