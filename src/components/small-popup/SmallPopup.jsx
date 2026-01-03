import React, { useState } from "react";
import {
  Page,
  Navbar,
  NavLeft,
  NavTitle,
  Link,
  Block,
  Popup,
} from "framework7-react";
import "./SmallPopup.css";
import PropTypes from "prop-types";

const SmallPopup = ({ id, title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popup
      id={id}
      className={`small-popup-container${isOpen ? " small-popup-visible" : ""}`}
      onPopupOpen={() => setIsOpen(true)}
      onPopupClose={() => setIsOpen(false)}
    >
      <Page>
        <Navbar>
          <NavLeft>
            <Link iconIos="f7:close" iconMd="material:close" popupClose />
          </NavLeft>
          <NavTitle>{title}</NavTitle>
        </Navbar>
        <Block className="popup-content-block">{children}</Block>
      </Page>
    </Popup>
  );
};

SmallPopup.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default SmallPopup;
