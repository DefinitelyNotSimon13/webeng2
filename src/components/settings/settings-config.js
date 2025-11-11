import PropTypes from "prop-types";
import { FRIEDRICHSHAFEN_COORDS } from "../../consts";

/**
 * @typedef {Object} SettingsOption
 * @property {string} value
 * @property {string} display
 */

/**
 * @typedef {Object} SettingsItem
 * @property {string} id
 * @property {string} title
 * @property {'dropdown'|'checkbox'|'text'|'group'} type
 * @property {*} [default]
 * @property {string} [placeholder]
 * @property {SettingsOption[]} [options]
 * @property {SettingsItem[]} [members]
 */

/** Config: SETTINGS_CONFIG */
export const SETTINGS_CONFIG = [
  {
    id: "language",
    title: "Wikipedia Language",
    type: "dropdown",
    options: [
      { value: "en", display: "English" },
      { value: "de", display: "German" },
      { value: "fr", display: "French" },
    ],
    default: "en",
  },
  {
    id: "location",
    title: "Use User Location",
    type: "checkbox",
    default: true,
  },
  {
    id: "default",
    title: "Fallback location",
    type: "group",
    members: [
      //!TODO Change default to fn!
      {
        id: "lat",
        title: "Latitude",
        type: "text",
        placeholder: "e.g. 48.137",
        default: `${FRIEDRICHSHAFEN_COORDS.lat}`,
      },
      {
        id: "long",
        title: "Longitude",
        type: "text",
        placeholder: "e.g. 11.575",
        default: `${FRIEDRICHSHAFEN_COORDS.long}`,
      },
    ],
  },
];

/** PropType: SettingsConfigPropType */
export const SettingsConfigPropType = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["dropdown", "checkbox", "text", "group"]).isRequired,
    default: PropTypes.any,
    placeholder: PropTypes.string,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
        display: PropTypes.string.isRequired,
      }),
    ),
    members: PropTypes.array,
  }),
);
