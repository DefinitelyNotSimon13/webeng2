import React from "react";
import {
  Page,
  Navbar,
  NavLeft,
  NavTitle,
  NavTitleLarge,
  NavRight,
  Link,
  Toolbar,
  Block,
  BlockTitle,
  List,
  ListItem,
  Button,
} from "framework7-react";
import PoiList from "../components/poi-list";

const HomePage = () => (
  <Page name="home">
    {/* Top Navbar */}
    <Navbar large sliding={false}>
      <NavLeft>
        <Link iconIos="f7:menu" iconMd="material:menu" panelOpen="left" />
      </NavLeft>
      <NavTitle sliding>My App</NavTitle>
      <NavRight>
        <Link iconIos="f7:menu" iconMd="material:menu" panelOpen="right" />
      </NavRight>
      <NavTitleLarge>My App</NavTitleLarge>
    </Navbar>
    {/* Toolbar */}
    <Toolbar bottom>
      <Link>Left Link</Link>
      <Link>Right Link</Link>
    </Toolbar>
    {/* Page content */}
    <Block>
      <p>Here is your blank Framework7 app. Let's see what we have here.</p>
    </Block>
    <BlockTitle>Navigation</BlockTitle>
    <List strong inset dividersIos>
      <ListItem link="/about/" title="About" />
      <ListItem link="/form/" title="Form" />
    </List>

    <BlockTitle>Modals</BlockTitle>
    <Block className="grid grid-cols-2 grid-gap">
      <Button fill popupOpen="#my-popup">
        Popup
      </Button>
      <Button fill loginScreenOpen="#my-login-screen">
        Login Screen
      </Button>
    </Block>

    <BlockTitle>Panels</BlockTitle>
    <Block className="grid grid-cols-2 grid-gap">
      <Button fill panelOpen="left">
        Left Panel
      </Button>
      <Button fill panelOpen="right">
        Right Panel
      </Button>
    </Block>

    <List strong inset dividersIos>
      <ListItem
        title="Dynamic (Component) Route"
        link="/dynamic-route/blog/45/post/125/?foo=bar#about"
      />
      <ListItem
        title="Default Route (404)"
        link="/load-something-that-doesnt-exist/"
      />
      <ListItem
        title="Request Data & Load"
        link="/request-and-load/user/123456/"
      />
    </List>

    <PoiList
      items={[
        {
          title: "POI 1",
          description: "Description for POI 1",
          image:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/TestingCup-Polish-Championship-in-Software-Testing-Katowice-2016.jpg/250px-TestingCup-Polish-Championship-in-Software-Testing-Katowice-2016.jpg",
          link: "https://google.com",
        },
        {
          title: "POI 2",
          description: "Description for POI 2",
          image:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Catherine_Connolly%2C_Dec_2024_%2854197775560%29_%28cropped%29.jpg/250px-Catherine_Connolly%2C_Dec_2024_%2854197775560%29_%28cropped%29.jpg",
          link: "https://google.com",
        },
        {
          title: "POI 3",
          description: "Description for POI 3",
          image: "https://via.placeholder.com/150",
          link: "https://google.com",
        },
      ]}
    />
  </Page>
);
export default HomePage;
