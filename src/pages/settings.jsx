import React from "react";
import { Page, Navbar, Block, BlockTitle } from "framework7-react";
import { SettingsForm, SETTINGS_CONFIG } from "../components/settings";

const SettingsPage = () => (
  <Page>
    <Navbar title="Settings" backLink="Back" />
    <BlockTitle>Settings</BlockTitle>

    <Block>
      <SettingsForm config={SETTINGS_CONFIG} />
    </Block>
  </Page>
);

export default SettingsPage;
