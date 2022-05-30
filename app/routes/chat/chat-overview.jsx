import { Form, useLoaderData, useSubmit } from "@remix-run/react";

import { getSession, requireSession } from "../../sessions.server";
import useJs from "../../hooks/useJs";
import connectDb from "~/db/connectDb.server";
import { Outlet } from "react-router";
import Close from "../../icons/Close";

//please do test out the chat functionality
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

  return { userId, chats, nameSearch };
}

export async function action({ request }) {
  const form = await request.formData();
  const db = await connectDb();
  if (form.get("_action") === "deleteChat") {
    const chatId = form.get("chatId");
    await db.models.Chat.findOneAndDelete({ _id: chatId });
  }
  return null;
}

export default function Chat() {
  let hasJs = useJs();
  const submit = useSubmit();
  function handleChange(event) {
    submit(event.currentTarget, { replace: true });
  }
  let { chats, nameSearch, userId } = useLoaderData();

  chats.forEach((chat) => {
    chat.participants = chat.participants.filter((participant) => {
      return participant.userId !== userId;
    });
  });

  return (
    <div className="flex flex-col md:flex-row gap-4 h-screen -my-8 py-8 ">
      <div className="bg-white p-4 rounded-xl shadow-md h-1/2 md:h-full w-full md:w-80 flex flex-col gap-2  scrollbar:hidden">
        <h1 className=" font-semibold text-2xl ">Chats</h1>
        <Form method="get" onChange={handleChange}>
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
              className="  bg-green-400 px-3 py-2 rounded-full hover:bg-green-300 shadow-md hover:shadow-md mr-4"
            >
              Search
            </button>
          )}
        </Form>

        <div className="h-full max-w-40 overflow-y-auto">
          {chats
            ? chats.map((chat) => (
                <div key={chat._id} className="relative">
                  <Form method="post">
                    <input type="hidden" name="chatId" value={chat._id} />
                    <button
                      className="flex flex-row-reverse bg-red-500 items-end ml-auto rounded-full hover:bg-red-400 p-1 absolute right-1 top-1/2 -translate-y-1/2"
                      type="submit"
                      name="_action"
                      value="deleteChat"
                    >
                      <Close className="h-4 w-4" />
                    </button>
                  </Form>
                  <Form
                    method="post"
                    action="/chat/chat-overview/chat-conversation"
                    className=" border-b py-2 w-full "
                  >
                    <input type="hidden" name="chatId" value={chat._id} />

                    <button className="flex" type="submit">
                      <input
                        type="hidden"
                        name="participantId"
                        value={chat.participants[0].userId}
                      />

                      <img
                        src={
                          chat.participants[0].image
                            ? `/uploads/${chat.participants[0].image}`
                            : "/403017_avatar_default_head_person_unknown_icon.png"
                        }
                        alt=""
                        className="w-12 h-12 rounded-full mr-2 object-cover"
                      />
                      <div className=" text-left">
                        <h3 className=" text-xl font-semibold">
                          {chat.participants[0].name}
                        </h3>
                        <p className=" text-slate-400 text-xs max-w-1/2 truncate">
                          {chat.messages.length > 0
                            ? chat.messages[
                                chat.messages.length - 1
                              ].message.slice(0, 25) + "..."
                            : "No messages yet"}
                        </p>
                      </div>
                    </button>
                  </Form>
                </div>
              ))
            : null}
        </div>
      </div>
      <Outlet />
    </div>
  );
}
