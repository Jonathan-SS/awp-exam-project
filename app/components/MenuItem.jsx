import { NavLink } from "react-router-dom";

export default function MenuItem({ icon, label, to }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        "rounded-full p-2 last-of-type:mt-auto " +
        (isActive
          ? "bg-green-400 shadow-md"
          : "shadow-lg hover:shadow-md bg-white")
      }
    >
      {icon}
      <div className=" absolute left-0">{label}</div>
    </NavLink>
  );
}
