import connectDb from "~/db/connectDb.server";

export async function action({ request }) {
  const db = await connectDb();
  const form = await request.formData();
  let chatId = form.get("chatId");
  let chat = {};

  chat = await db.models.Chat.findOne({
    _id: chatId,
  });

  return chat;
}
