import {
  Form,
  useActionData,
  useTransition,
  useFetcher,
} from "@remix-run/react";
import { useState, useEffect, useRef } from "react";
import connectDb from "~/db/connectDb.server";
import { getSession } from "../../../sessions.server";

export async function action({ request }) {
  const db = await connectDb();
  const form = await request.formData();
  const cookie = request.headers.get("Cookie");
  const session = await getSession(cookie);
  const userId = session.get("userId");
  let chatId = form.get("chatId");
  const user = await db.models.User.findById(userId);
  const participant = await db.models.User.findById(form.get("participantId"));
  let chat = {};

  //Checks if the action is to send a message
  if (form.get("_action") === "sendMessage") {
    const message = form.get("message");

    await db.models.Chat.findOneAndUpdate(
      { _id: chatId },
      {
        $push: {
          messages: {
            sender: userId,
            message,
          },
        },
      }
    );
    await db.models.Chat.updateOne(
      {
        _id: chatId,

        "participants.userId": {
          $ne: userId,
        },
      },
      {
        $set: { "participants.$.hasRead": false },
      }
    );
  }
  //Checks if there is an existing chat with the participants
  async function exsistingChatCheck(userId, participantId) {
    return await db.models.Chat.findOne({
      $and: [
        {
          participants: {
            $elemMatch: { userId },
          },
        },
        {
          participants: {
            $elemMatch: { userId: participantId },
          },
        },
      ],
    });
  }

  if (chatId) {
    chat = await db.models.Chat.findOne({
      _id: chatId,
    });
    //function below checks for changes in char collection, and returns chat if there is
    // db.models.Chat.watch().on("change", async (change) => {
    //   chat = await db.models.Chat.findOne({
    //     _id: chatId,
    //   });

    //   return chat;
    // });
  } else {
    chat = await exsistingChatCheck(userId, form.get("participantId"));
  }

  if (!chat) {
    chat = await db.models.Chat.create({
      participants: [
        {
          userId: user._id,
          name: `${user.firstname} ${user.lastname}`,
          image: user.image?.name
            ? user.image.name
            : "403017_avatar_default_head_person_unknown_icon.png",
        },
        {
          userId: participant._id,
          name: `${participant.firstname} ${participant.lastname}`,
          image: participant.image
            ? participant.image.name
            : "403017_avatar_default_head_person_unknown_icon.png",
        },
      ],
    });
    chatId = chat._id;
  }
  await db.models.Chat.updateOne(
    {
      _id: chatId,
      "participants.userId": userId,
    },
    {
      $set: { "participants.$.hasRead": true },
    }
  );

  return { chat, chatId, user, participant };
}

export async function loader({ request }) {
  const db = await connectDb();
  const url = new URL(request.url);
  const chatId = url.searchParams.get("chatId");

  if (
    chatId !== "unknown" &&
    chatId !== "" &&
    chatId !== null &&
    chatId !== "undefined"
  ) {
    return await db.models.Chat.findOne({
      _id: chatId,
    });
  }

  return null;
}

export default function ChatConversation() {
  const actionData = useActionData();
  const fetcher = useFetcher();
  const formRef = useRef();
  let transition = useTransition();
  const [chatId, setChatId] = useState();
  const [chat, setChat] = useState({});
  const [user, setUser] = useState({});
  const [participant, setParticipant] = useState({});
  let sending =
    transition.state === "submitting" &&
    transition.submission.formData.get("_action") === "sendMessage";

  const buttonText = sending ? "Sending..." : "Send";

  useEffect(() => {
    setChat(actionData?.chat);
  }, [actionData?.chat]);

  useEffect(() => {
    setParticipant(actionData?.participant);
    setChatId(actionData?.chatId);
    setUser(actionData?.user);
  }, [actionData?.chatId, actionData?.participant, actionData?.user]);

  useEffect(() => {
    if (!sending) {
      formRef.current?.reset();
    }
  }, [sending]);

  //useEffect below used to keep the chat up to date by refetching it every third second
  //It would be optimal with websockts here, but I don't have time to implement them(or learn how to)
  useEffect(() => {
    const interval = setInterval(() => {
      if (
        document.visibilityState === "visible" &&
        chatId !== "unknown" &&
        chatId !== "" &&
        chatId !== null &&
        chatId !== "undefined" &&
        chatId !== undefined
      ) {
        fetcher.submit(
          {
            chatId: chatId,
          },
          {
            method: "get",
          }
        );
      }
    }, 3000);
    return () => clearInterval(interval);
  });

  useEffect(() => {
    if (fetcher.data) {
      setChat(fetcher.data);
    }
  }, [fetcher.data]);

  return (
    <div
      className="bg-white p-4  rounded-xl shadow-md flex-1  flex-col justify-between flex
    "
    >
      {chat ? (
        <>
          <h2 className=" text-lg font-medium">
            Chat with {participant?.firstname}
          </h2>
          <div className=" flex-1 py-4 px-2 overflow-y-auto  h-full flex-col-reverse  flex gap-4  ">
            {chat?.messages?.length > 0 ? (
              chat.messages
                .slice(0)
                .reverse()
                .map((message) => (
                  <div
                    key={message._id}
                    className={
                      "flex w-1/2 h-content" +
                      (user._id === message.sender
                        ? " flex-row-reverse pl-4 self-end items-end "
                        : "  pr-4 items-end")
                    }
                  >
                    <img
                      src={
                        user._id === message.sender
                          ? user?.image?.name
                            ? `/uploads/${user.image.name}`
                            : "/403017_avatar_default_head_person_unknown_icon.png"
                          : participant?.image?.name
                          ? `/uploads/${participant.image.name}`
                          : "/403017_avatar_default_head_person_unknown_icon.png"
                      }
                      alt=""
                      className="w-12 h-12 rounded-full object-cover "
                    />
                    <div className=" flex-1 ">
                      <p
                        className={
                          "min-h-full p-2 rounded-lg" +
                          (user._id === message.sender
                            ? " bg-green-400 mr-2 "
                            : " bg-slate-100 ml-2 ")
                        }
                      >
                        {message.message}
                      </p>
                    </div>
                  </div>
                ))
            ) : (
              <div className=" -mb-2 w-1/2 px-2">
                <p className="min-h-full rounded-lg text-slate-400">
                  No message yet, be the first to reach out.
                </p>
              </div>
            )}
          </div>

          <Form method="post" className="flex items-end" ref={formRef}>
            <input
              className=" resize-none p-2 rounded-lg mr-2 border border-gray-200 flex-1"
              name="message"
              placeholder="Message..."
            />
            <input type="hidden" name="_action" value="sendMessage" />
            <input
              type="hidden"
              name="chatId"
              value={chatId ? chatId : "unknown"}
            />
            <input type="hidden" name="participantId" value={participant._id} />

            <button
              disabled={
                transition.state === "submitting" &&
                transition.submission.formData.get("_action") === "sendMessage"
              }
              type="submit"
              className="  bg-green-400 px-3 py-2 rounded-full hover:bg-green-300 shadow-md hover:shadow-md mr-4"
            >
              {buttonText}
            </button>
          </Form>
        </>
      ) : (
        <h2 className=" text-lg font-medium">Select someone to chat with</h2>
      )}
    </div>
  );
}
