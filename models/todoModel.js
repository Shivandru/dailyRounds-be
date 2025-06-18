const mongoose = require("mongoose");

const todoSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },
    mentions: [
      {
        type: String,
      },
    ],
    notes: [
      {
        user: {
          type: [String],
          default: undefined,
        },
        content: {
          type: String,
          required: true,
        },
        createdBy:{
          type: String,
          required: true
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Todo = mongoose.model("todos", todoSchema);
module.exports = Todo;
