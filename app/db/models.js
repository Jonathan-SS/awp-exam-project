import { mongoose } from "mongoose";

const { Schema } = mongoose;

const candiateSchema = new Schema(
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
      data: Buffer,
      contentType: String,
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
  },
  { timestamps: true }
);

const recruiterSchema = new Schema(
  {
    company: {
      type: String,
      required: [true, "Company is required"],
      minLength: [3, "That's too short"],
    },
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
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "That's too short"],
    },

    image: {
      type: String,
      required: true,
    },
    links: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

export const models = [
  {
    name: "Candidate",
    schema: candiateSchema,
    collection: "candidates",
  },
  {
    name: "Recruiter",
    schema: recruiterSchema,
    collection: "recruiters",
  },
  {
    name: "Post",
    schema: postsSchema,
    collection: "posts",
  },
];
