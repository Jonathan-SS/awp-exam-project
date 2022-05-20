import { mongoose } from "mongoose";

const { Schema } = mongoose;

const candiateSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
      minLength: [3, "That's too short"],
    },
    lastname: {
      type: String,
      required: true,
      minLength: [3, "That's too short"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "That's too short"],
    },
    tags: {
      type: [String],
    },
    description: {
      type: String,
      minLength: [10, "That's too short"],
    },
    image: {
      type: String,
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
  },
  { timestamps: true }
);
const recruiterSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: [3, "That's too short"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "That's too short"],
    },
    company: {
      type: String,
      required: true,
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
];
