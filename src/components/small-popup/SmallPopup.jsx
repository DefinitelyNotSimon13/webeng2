import React from "react";
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
  const show = () => {
    const popup = document.getElementById(id);
    popup.classList.add("small-popup-visible");
  };

  const hide = () => {
    const popup = document.getElementById(id);
    popup.classList.remove("small-popup-visible");
  };

  return (
    <Popup
      id={id}
      className="small-popup-container"
      onPopupOpen={show}
      onPopupClose={hide}
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
