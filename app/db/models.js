import { mongoose } from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: [true, "First Name is required"],
      minLength: [3, "That's too short"],
    },
    lastname: {
      type: String,
      required: [true, "Last Name is required"],
      minLength: [3, "That's too short"],
    },
    comapny: {
      type: String,
    },
    userType: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "Password too short"],
    },
    tags: {
      type: [String],
    },
    description: {
      type: String,
      minLength: [10, "That's too short"],
    },
    image: {
      type: Object,
    },
    links: {
      type: [
        {
          name: {
            type: String,
          },
          url: {
            type: String,
          },
        },
      ],
    },
    linksAsText: {
      type: String,
    },
    posts: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Post",
        },
      ],
    },
  },
  { timestamps: true }
);

const postsSchema = new Schema(
  {
    body: {
      type: String,
      minLength: [10, "That's too short for at post"],
    },
    postType: {
      type: String,
    },
    user: {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      userName: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

const chatSchema = new Schema({
  participants: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      name: {
        type: String,
        required: true,
      },
      image: {
        type: String,
      },
    },
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      name: {
        type: String,
        required: true,
      },
      imageLink: {
        type: String,
      },
    },
  ],
  messages: [
    {
      sender: {
        type: Schema.Types.ObjectId,
        ref: "USer",
      },
      message: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

//TODO: nake only one schema for all users

export const models = [
  {
    name: "User",
    schema: userSchema,
    collection: "Users",
  },
  {
    name: "Post",
    schema: postsSchema,
    collection: "posts",
  },
  {
    name: "Chat",
    schema: chatSchema,
    collection: "chats",
  },
];
