import React from "react";
import { Page, Navbar, Block, BlockTitle } from "framework7-react";

const SettingsPage = () => (
  <Page>
    <Navbar title="Settings" backLink="Back" />
    <BlockTitle>Settings</BlockTitle>
    <Block>
      <p>Do we need settings?</p>
    </Block>
  </Page>
);

export default SettingsPage;
