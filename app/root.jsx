import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { useEffect, useState } from "react";

import styles from "~/tailwind.css";
import MenuItem from "./components/MenuItem";
import BurgerMenu from "./icons/BurgerMenu";
import Candidates from "./icons/Candidates";
import Close from "./icons/Close";
import Home from "./icons/Home";
import LogIn from "./icons/LogIn";
import Logo from "./icons/logo";
import Plus from "./icons/PLus";
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
  const [navIsOpen, setNavIsOpen] = useState(false);
  useEffect(() => {
    //checks if the user prefers dark mode
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    }
  });

  function showMobileMenu() {
    const menu = document.getElementById("menu");
    menu.classList.toggle("hidden");
    menu.classList.add("flex");
    menu.classList.toggle("-translate-x-full");
    navIsOpen ? setNavIsOpen(false) : setNavIsOpen(true);
  }

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-slate-100 text-slate-800 font-sans md:flex">
        <aside
          id="menu"
          className=" absolute md:static -translate-x-full hidden md:translate-x-0 md:flex flex-col h-100vh px-1 md:px-3 py-8 gap-6 "
        >
          <MenuItem icon={<Home />} label="Home" to="/" />
          <MenuItem icon={<Posts />} label="Job posts" to="/job-posts" />
          <MenuItem icon={<Candidates />} label="Candidates" to="/candidates" />
          <MenuItem icon={<Profile />} label="Profile" to="/profile" />
          <MenuItem icon={<Tools />} label="Tools" to="/tools" />
          <MenuItem icon={<Plus />} label="Create User" to="/login" />

          <MenuItem icon={<LogIn />} label="LogIn" to="/login" />
        </aside>
        <div className="md:hidden flex justify-center py-1 px-2">
          <div className=" absolute left-0 px-1">
            <button onClick={showMobileMenu}>
              {navIsOpen ? <Close /> : <BurgerMenu />}
            </button>
          </div>

          <Logo className="h-auto w-20" />
        </div>

        <main className="flex-1 px-4 py-7">
          <Outlet />
        </main>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
