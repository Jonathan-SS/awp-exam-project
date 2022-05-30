export default function InputField({
  name,
  placeholder,
  actionData,
  defaultValue,
}) {
  console.log(name);

  return (
    <>
      {actionData ? (
        <p className="text-red-500 px-2">{actionData}</p>
      ) : (
        <p className=" -mb-2 px-2 text-slate-400 ">{placeholder}</p>
      )}
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className={
          "w-full py-2 px-4 rounded-full border " +
          (actionData ? "border-red-500" : "  border-gray-300 ")
        }
      />
    </>
  );
}
