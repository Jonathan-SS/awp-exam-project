import { NavLink } from "react-router-dom";

export default function MenuItem({ icon, label, to, onClick }) {
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
        "rounded-full p-2 md:last-of-type:mt-auto menuItem " +
        (isActive
          ? "bg-green-400 shadow-lg"
          : "shadow-md hover:shadow-md bg-white")
      }
      onClick={onClick}
    >
      {icon}
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
