import { Form, useActionData } from "@remix-run/react";
import { useEffect } from "react";
import useJs from "../../hooks/useJs";
export default function Chats() {
  let hasJs = useJs();
  const allParams = useActionData();

  return (
    <div className="flex gap-4 h-screen -my-8 py-8">
      <div className="bg-white p-4 rounded-xl shadow-lg w-80 flex flex-col gap-2 max-h-screen overflow-y-scroll">
        <h1 className=" font-semibold text-2xl ">Chats</h1>
        <Form>
          <input
            className=" p-2 rounded-full mr-2 border border-gray-200"
            type="search"
            name="name"
            placeholder="Search..."
            defaultValue={allParams?.name}
          />
          {!hasJs && (
            <button
              type="submit"
              className="  bg-green-400 px-3 py-2 rounded-full hover:bg-green-300 shadow-lg hover:shadow-md mr-4"
            >
              Search
            </button>
          )}
        </Form>
        <div className="flex border-b py-2">
          <img
            src="/403017_avatar_default_head_person_unknown_icon.png"
            alt=""
            className="w-12 h-12 rounded-full mr-2"
          />
          <div>
            <h3 className=" text-xl font-semibold">Name</h3>
            <p className=" text-slate-400 text-xs">Den seneste besked...</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-lg flex-1 flex flex-col justify-between ">
        <h2 className=" text-lg font-medium">Chat with name</h2>
        <div className=" ">
          <div className=" py-4  overflow-y-scroll max-h-[calc(100vh-200px)] flex flex-col gap-4">
            <div className="flex w-1/2 pr-4 items-end">
              <img
                src="/403017_avatar_default_head_person_unknown_icon.png"
                alt=""
                className="w-12 h-12 rounded-full mr-2"
              />
              <div className=" flex-1 ">
                <p className=" bg-slate-100 min-h-full p-2 rounded-lg">
                  Den seneste besked...
                </p>
              </div>
            </div>
            <div className="flex flex-row-reverse  w-1/2 pl-4 self-end items-end">
              <img
                src="/403017_avatar_default_head_person_unknown_icon.png"
                alt=""
                className="w-12 h-12 rounded-full ml-2"
              />
              <div className=" flex-1 ">
                <p className="  bg-green-400 min-h-full p-2 rounded-lg">
                  Den seneste besked...
                </p>
              </div>
            </div>
          </div>

          <Form className="flex items-end">
            <textarea
              className=" resize-none p-2 rounded-lg mr-2 border border-gray-200 flex-1"
              type="search"
              name="name"
              placeholder="Message..."
            />

            <button
              type="submit"
              className="  bg-green-400 px-3 py-2 rounded-full hover:bg-green-300 shadow-lg hover:shadow-md mr-4"
            >
              Search
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}

//TODO set up a chat with a user
