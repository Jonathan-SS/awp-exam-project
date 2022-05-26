import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { useState, useEffect } from "react";
import { getSession, requireSession } from "../../sessions.server";
import useJs from "../../hooks/useJs";
import connectDb from "~/db/connectDb.server";
import { Outlet } from "react-router";

export async function loader({ request, params }) {
  await requireSession(request);
  const db = await connectDb();
  const cookie = request.headers.get("Cookie");
  const session = await getSession(cookie);
  const userId = session.get("userId");
  const url = new URL(request.url);
  const nameSearch = url.searchParams.get("name");

  const chats = await db.models.Chat.find(
    nameSearch
      ? {
          $and: [
            {
              participants: {
                $elemMatch: { userId },
              },
            },
            {
              "participants.name": { $regex: new RegExp(nameSearch, "i") },
            },
          ],
        }
      : {
          participants: {
            $elemMatch: { userId },
          },
        }
  ).sort({ updatedAt: -1 });
  console.log(nameSearch);

  return { userId, chats, nameSearch };
}

export default function Chat() {
  let hasJs = useJs();
  let { chats, nameSearch, userId } = useLoaderData();

  chats.forEach((chat) => {
    chat.participants = chat.participants.filter((participant) => {
      return participant.userId !== userId;
    });
  });

  return (
    <div className="flex gap-4 h-screen -my-8 py-8 ">
      <div className="bg-white p-4 rounded-xl shadow-lg w-80 flex flex-col gap-2  scrollbar:hidden">
        <h1 className=" font-semibold text-2xl ">Chats</h1>
        <Form method="get">
          <input
            className=" p-2 rounded-full mr-2 border border-gray-200"
            type="search"
            name="name"
            placeholder="Search..."
            defaultValue={nameSearch}
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

        <div className="h-full max-w-40 overflow-y-scroll">
          {chats
            ? chats.map((chat) => (
                <Form
                  key={chat._id}
                  method="post"
                  action="/chat/chat-overview/chat-conversation"
                  className=" border-b py-2 w-full"
                >
                  <button
                    className="flex"
                    type="submit"
                    name="chatId"
                    value={chat._id}
                  >
                    <input
                      type="hidden"
                      name="participantId"
                      value={chat.participants[0].userId}
                    />

                    <img
                      src={
                        chat.participants.image
                          ? chat.participants.image
                          : "/403017_avatar_default_head_person_unknown_icon.png"
                      }
                      alt=""
                      className="w-12 h-12 rounded-full mr-2"
                    />
                    <div className=" text-left">
                      <h3 className=" text-xl font-semibold">
                        {chat.participants[0].name}
                      </h3>
                      <p className=" text-slate-400 text-xs max-w-1/2 truncate">
                        {chat.messages[chat.messages.length - 1].message.slice(
                          0,
                          25
                        ) + "..."}
                      </p>
                    </div>
                  </button>
                </Form>
              ))
            : null}
        </div>
      </div>
      <div className="bg-white p-4 h-full  rounded-xl shadow-lg flex-1 flex flex-col justify-between ">
        <h2 className=" text-lg font-medium">Chat with name</h2>
        <Outlet />
      </div>
    </div>
  );
}

//TODO add image to users
//TODO Add ability to delete messages
// TODO fix overflow of messages with no scroll

// TODOne next, fix whole chat logic to new schema
// TODO fix this bug

// TODO find a way to get the info of the participant who is not the user
