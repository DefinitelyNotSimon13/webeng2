import HomePage from "../pages/home.jsx";
import AboutPage from "../pages/about.jsx";
import SettingsPage from "../pages/settings.jsx";

import NotFoundPage from "../pages/404.jsx";

var routes = [
  {
    path: "/",
    component: HomePage,
  },
  {
    path: "/about/",
    component: AboutPage,
  },
  {
    path: "/settings/",
    component: SettingsPage,
  },
  {
    path: "(.*)",
    component: NotFoundPage,
  },
];

export default routes;
