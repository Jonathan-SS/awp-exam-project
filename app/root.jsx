import { redirect } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
} from "@remix-run/react";
import { useEffect, useState } from "react";

import styles from "~/tailwind.css";
import MenuItem from "./components/MenuItem";

import BurgerMenu from "./icons/BurgerMenu";
import Candidates from "./icons/Candidates";
import Close from "./icons/Close";
import Home from "./icons/Home";
import LogIn from "./icons/LogIn";
import Logo from "./icons/Logo";
import Plus from "./icons/Plus";
import Posts from "./icons/Posts";
import Profile from "./icons/Profile";
import Tools from "./icons/Tools";
import LogOut from "./icons/LogOut";
import Chat from "./icons/Chat";
import { getSession } from "./sessions.server";
import { Link } from "react-router-dom";
import Bug from "./illustrations/Bug";

export const links = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
  {
    rel: "apple-touch-icon",
    href: "/apple-touch-icon.png",
    sizes: "180x180",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: "/favicon-32x32.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "16x16",
    href: "/favicon-16x16.png",
  },
  {
    rel: "mask-icon",
    href: "/safari-pinned-tab.svg",
    color: "#5bbad5",
  },
  {
    rel: "manifest",
    href: "/site.webmanifest",
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

export async function loader({ request }) {
  const cookie = request.headers.get("Cookie");
  const session = await getSession(cookie);
  if (session.has("userId")) {
    return true;
  }
  return false;
}

export default function App() {
  const status = useLoaderData();
  const [loggedin, setLoggedin] = useState(false);

  useEffect(() => {
    //checks if the user prefers dark mode
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    }
    setLoggedin(status);
  }, [status]);

  return (
    <Layout loggedin={loggedin}>
      <Outlet />
    </Layout>
  );
}

export function Layout({ children, ...rest }) {
  const [navIsOpen, setNavIsOpen] = useState(false);
  const { loggedin } = rest;
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
          className=" z-50 absolute md:fixed -translate-x-full hidden md:translate-x-0 md:flex flex-col h-100vh px-1 md:px-3 py-8 gap-6 "
        >
          <MenuItem icon={<Home />} label="Home" to="/" />
          <MenuItem icon={<Posts />} label="Job posts" to="/job-posts" />
          <MenuItem icon={<Candidates />} label="Candidates" to="/candidates" />
          {loggedin ? (
            <>
              <MenuItem icon={<Profile />} label="Profile" to="/profile" />
              <MenuItem icon={<Chat />} label="Chat" to="/chat" />
            </>
          ) : null}

          {!loggedin ? (
            <MenuItem icon={<Plus />} label="Create User" to="/create-user" />
          ) : null}

          {loggedin ? (
            <MenuItem icon={<LogOut />} label="Logout" to="/logout" />
          ) : (
            <MenuItem icon={<LogIn />} label="Login" to="/login" />
          )}
        </aside>
        <div className="md:hidden flex justify-center py-1 px-2">
          <div className=" absolute left-0 px-1">
            <button onClick={showMobileMenu}>
              {navIsOpen ? <Close /> : <BurgerMenu />}
            </button>
          </div>

          <Logo className="h-auto w-20" />
        </div>

        <main className="flex-1 px-4 py-7 ml-14 z-20">{children}</main>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <Layout>
      <main className=" flex justify-center items-center col-span-5 flex-col ">
        <Bug />
        <h1 className=" text-5xl font-bold">{caught.statusText}</h1>
        <Link
          className="text-white flex items-center h-fit  bg-green-400 px-3 py-2 rounded-full hover:bg-green-300 shadow-lg hover:shadow-md mt-4"
          to="/"
        >
          Go to the home page
        </Link>
      </main>
    </Layout>
  );
}

export function ErrorBoundary({ error }) {
  return (
    <Layout>
      <main className=" flex justify-center items-center col-span-5 flex-col ">
        <Bug />
        <h1 className="text-red-500 font-bold">
          {error.name}: {error.message}
        </h1>
        <Link
          className="text-white flex items-center h-fit  bg-green-400 px-3 py-2 rounded-full hover:bg-green-300 shadow-lg hover:shadow-md mt-4"
          to="/"
        >
          Go to the home page
        </Link>
      </main>
    </Layout>
  );
}
//TODOne add catch and ERROR boundry to everything
//TODOne add a 404 page
//TODO make it work on mobile
// TODOne: find a way to check if the user is logged in for the Navbar
//TODO: add ability to report bugs maybe?
