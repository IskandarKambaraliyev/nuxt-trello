import { Document, Schema, model } from "mongoose";

export interface CardDocument extends Document {
  title: string;
  description: string;
  owner: string;
  list: string;
  createdAt: Date;
  updatedAt: Date;
}

const cardSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: null
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    list: {
      type: Schema.Types.ObjectId,
      ref: "List",
      required: true,
    },
  },
  { timestamps: true }
);

export const Card = model<CardDocument>("Card", cardSchema);
