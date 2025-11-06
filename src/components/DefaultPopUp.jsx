import React from "react";

import {
  View,
  Popup,
  Page,
  Navbar,
  NavRight,
  Link,
  Block,
} from "framework7-react";
import PropTypes from "prop-types";

const DefaultPopUp = ({ children, id, title }) => {
  return (
    <Popup id={id}>
      <View>
        <Page>
          <Navbar title={title}>
            <NavRight>
              <Link popupClose>Close</Link>
            </NavRight>
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
