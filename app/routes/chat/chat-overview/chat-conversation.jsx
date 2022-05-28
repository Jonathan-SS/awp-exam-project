import { Form, useActionData, useTransition } from "@remix-run/react";
import { useState, useEffect } from "react";
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

  if (form.get("_action") === "sendMessage") {
    const message = form.get("message");

    await db.models.Chat.findOneAndUpdate(
      { _id: chatId },
      {
        $push: {
          messages: {
            sender: userId,
            message,
            createdAt: new Date(),
          },
        },
      }
    );
  }

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
    console.log("vi er her ", chatId);
    chat = await db.models.Chat.findOne({
      _id: chatId,
    });

    // TODO find a way to return new actionData on change
    db.models.Chat.watch().on("change", async (change) => {
      chat = await db.models.Chat.findOne({
        _id: chatId,
      });
      console.log("chat", chat);
      return chat;
    });
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
            : "403017_avatar_default_head_person_unknown_icon-1653151654690.png",
        },
        {
          userId: participant._id,
          name: `${participant.firstname} ${participant.lastname}`,
          image: participant.image
            ? participant.image.name
            : "403017_avatar_default_head_person_unknown_icon-1653151654690.png",
        },
      ],
    });
    chatId = chat._id;
  }

  return { chat, chatId, user, participant };
}

export default function ChatConversation() {
  const actionData = useActionData();

  let transition = useTransition();
  const [chatId, setChatId] = useState("NA");
  const [chat, setChat] = useState({});
  const [user, setUser] = useState({});
  const [participant, setParticipant] = useState({});

  const buttonText =
    transition.state === "submitting" &&
    transition.submission.formData.get("_action") === "sendMessage"
      ? "Sending..."
      : "Send";

  useEffect(() => {
    setChat(actionData?.chat);
  }, [actionData?.chat]);

  useEffect(() => {
    setParticipant(actionData?.participant);
    setChatId(actionData?.chatId);
    setUser(actionData?.user);
  }, [actionData?.chatId, actionData?.participant, actionData?.user]);

  console.log("chat", chat);
  console.log("chatId", chatId);
  console.log("user", user);
  console.log("participant", participant);

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
                            ? user.image.name
                            : "/403017_avatar_default_head_person_unknown_icon.png"
                          : participant?.image?.name
                          ? participant.image.name
                          : "/403017_avatar_default_head_person_unknown_icon.png"
                      }
                      alt=""
                      className="w-12 h-12 rounded-full "
                    />
                    <div className=" flex-1 ">
                      <p
                        className={
                          "min-h-full p-2 rounded-lg" +
                          (user._id === message.sender
                            ? " bg-green-400 mr-2 "
                            : "bg-slate-100 ml-2 ")
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
                  No message yet, be the first to reach out.bla
                </p>
              </div>
            )}
          </div>

          <Form method="post" className="flex items-end">
            <input
              className=" resize-none p-2 rounded-lg mr-2 border border-gray-200 flex-1"
              name="message"
              placeholder="Message..."
            />
            <input type="hidden" name="_action" value="sendMessage" />
            <input type="hidden" name="chatId" value={chatId} />
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
