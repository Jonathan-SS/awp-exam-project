import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { useEffect } from "react";

import styles from "~/tailwind.css";
import MenuItem from "./components/MenuItem";
import BurgerMenu from "./icons/BurgerMenu";
import Candidates from "./icons/Candidates";
import Home from "./icons/Home";
import LogIn from "./icons/LogIn";
import Posts from "./icons/Posts";
import Profile from "./icons/Profile";
import Tools from "./icons/Tools";

export const links = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
  {
    rel: "apple-touch-icon",
    href: "assets/apple-touch-icon.png",
    sizes: "180x180",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: "assets/favicon-32x32.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "16x16",
    href: "assets/favicon-16x16.png",
  },
  {
    rel: "mask-icon",
    href: "assets/safari-pinned-tab.svg",
    color: "#5bbad5",
  },
  {
    rel: "manifest",
    href: "assets/site.webmanifest",
  },
];

export function meta() {
  return {
    charset: "utf-8",
    title: "Cnnect - ",
    viewport: "width=device-width,initial-scale=1",
    robots: "noindex,nofollow",
    "msapplication-TileColor": "content=#15803d",
    "theme-color": "content=#15803d",
  };
}

export default function App() {
  useEffect(() => {
    //checks if the user prefers dark mode
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    }
  });
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-slate-100 text-slate-800 font-sans flex">
        <div className="md:hidden">
          <BurgerMenu />
        </div>
        <aside className="flex flex-col h-100vh px-3 py-8 gap-6 ">
          <MenuItem icon={<Home />} label="Home" to="/" />
          <MenuItem icon={<Posts />} label="Job posts" to="/job-posts" />
          <MenuItem icon={<Candidates />} label="Candidates" to="/candidates" />
          <MenuItem icon={<Profile />} label="Profile" to="/profile" />
          <MenuItem icon={<Tools />} label="Tools" to="/tools" />
          <MenuItem icon={<LogIn />} label="LogIn" to="/login" />
        </aside>

        <main className="flex-1">
          <Outlet />
        </main>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
