import React from "react";

import {
  View,
  Popup,
  Page,
  Navbar,
  NavLeft,
  Link,
  Block,
  NavTitle,
} from "framework7-react";
import PropTypes from "prop-types";

const DefaultPopUp = ({ children, id, title }) => {
  return (
    <Popup id={id}>
      <View>
        <Page>
          <Navbar>
            <NavLeft>
              <Link iconIos="f7:close" iconMd="material:close" popupClose />
            </NavLeft>
            <NavTitle>{title}</NavTitle>
          </Navbar>
          <Block>{children}</Block>
        </Page>
      </View>
    </Popup>
  );
};

DefaultPopUp.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string,
  title: PropTypes.string,
};

export default DefaultPopUp;
