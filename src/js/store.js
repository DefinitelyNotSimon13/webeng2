import { createStore } from "framework7/lite";
import { SettingsHelper, SETTINGS_CONFIG } from "../components/settings";

const store = createStore({
  state: {
    settings: [],
  },
  getters: {
    settings({ state }) {
      return state.settings;
    },
  },
  actions: {
    loadSettings({ state }, config) {
      console.debug("[store] loadSettings action called");
      state.settings = SettingsHelper.fromLocalStorage();
      store.dispatch("ensureDefaults", config);
    },
    ensureDefaults({ state }, config) {
      console.debug("[store] ensureDefaults action called");
      const next = { ...state.settings };
      for (const s of SettingsHelper.iterSettings(config)) {
        if (!Object.hasOwn(next, s.id)) {
          next[s.id] = s.default;
        }
      }
      state.settings = next;
      SettingsHelper.saveToLocalStorage(state.settings);
    },
    setSetting({ state }, { id, value }) {
      state.settings = { ...state.settings, [id]: value };
      SettingsHelper.saveToLocalStorage(state.settings);
    },
  },
});

store.dispatch("loadSettings", SETTINGS_CONFIG);

export default store;
