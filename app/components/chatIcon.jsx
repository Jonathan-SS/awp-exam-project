import { NavLink } from "react-router-dom";

export default function ChatIcon({ icon, label, to, onClick, unRead }) {
  console.log("unRead", unRead);
  function showToolTip(item) {
    const tooltip = document.getElementById(`${item}-ToolTip`);

    tooltip.classList.toggle("md:hidden");
  }
  function hideToolTip(item) {
    const tooltip = document.getElementById(`${item}-ToolTip`);
    tooltip.classList.toggle("md:hidden");
  }

  return (
    <NavLink
      onMouseEnter={() => {
        showToolTip(label);
      }}
      onMouseLeave={() => {
        hideToolTip(label);
      }}
      to={to}
      className={({ isActive }) =>
        "rounded-full p-2 md:last-of-type:mt-auto menuItem relative " +
        (isActive
          ? "bg-green-400 shadow-lg"
          : "shadow-md hover:shadow-md bg-white")
      }
      onClick={onClick}
    >
      {icon}
      {Number(unRead) > 0 && (
        <p className=" absolute bg-green-400 w-4 h-4 rounded-full flex text-center  justify-center text-xs top-0 right-0  ">
          {unRead}
        </p>
      )}

      <div className="relative">
        <div
          id={`${label}-ToolTip`}
          className=" whitespace-nowrap line w-fit md:hidden absolute left-9 -bottom-1 bg-white rounded-full px-3 py-1 z-50"
        >
          {label}
        </div>
      </div>
    </NavLink>
  );
}
