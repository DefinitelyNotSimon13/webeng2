import React from "react";
import { Page, Navbar, Block, BlockTitle, Link } from "framework7-react";

const AboutPage = () => (
  <Page>
    <Navbar title="About" backLink="Back" />
    <BlockTitle>About our site</BlockTitle>
    <Block>
      <p>
        Hi, we are a group of CS students from the DHBW Ravensburg and developed
        this small site as part of our web engineering course. You can set a
        position on the map and see nearby points of interests. You can get more
        information about them from wikipedia. There is also the possibility to
        access a point by longitude and latitude. The first point should be the
        position of your device.
      </p>
      <Link href="https://github.com/DefinitelyNotSimon13/webeng2" external>
        Github repository
      </Link>
    </Block>

    <BlockTitle>Contact</BlockTitle>
    <Block>
      <p>
        Simon Blum &lt;simon21.blum@gmail.com&gt; <br />
        Ben Oeckl &lt;ben@oeckl.com&gt; <br />
        Maximilian Reiner Rodler &lt;maximilian.reiner.rodler@gmail.com&gt;{" "}
        <br />
        Marius Maurer &lt;marius.maurer@freenet.de&gt; <br />
        Paul Stöckler &lt;paul.stoeckle@t-online.de&gt; <br />
      </p>
    </Block>
  </Page>
);

export default AboutPage;
