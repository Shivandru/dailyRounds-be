const Todo = require("../models/todoModel");

class TodoFunctions {
  async createTodo({
    title,
    description,
    priority,
    mentions,
    notes,
    createdBy,
  }) {
    try {
      if (!title || !createdBy) {
        return {
          status: 400,
          json: {
            success: true,
            message: "Missing required fields",
          },
        };
      }
      const todo = await Todo.create({
        title,
        description,
        priority,
        mentions,
        notes,
        createdBy,
      });
      return {
        status: 200,
        json: {
          success: true,
          message: "Todo created successfully",
          todo,
        },
      };
    } catch (error) {
      console.log("error from create Todo", error);
      return {
        status: 500,
        json: {
          success: false,
          message: "Internal Server Error",
        },
      };
    }
  }

  async getAllTodos() {
    try {
      const todos = await Todo.find();
      console.log(todos);
      return {
        status: 200,
        json: {
          success: true,
          todos,
        },
      };
    } catch (error) {
      console.log("error from get all Todos", error);
      return {
        status: 500,
        json: {
          success: false,
          message: "Internal Server Error",
        },
      };
    }
  }

  async getTodo({ todoId }) {
    try {
      if (!todoId) {
        return {
          status: 400,
          json: {
            success: true,
            message: "Missing required fields",
          },
        };
      }
      const todo = await Todo.findById(todoId);
      return {
        status: 200,
        json: {
          success: true,
          todo,
        },
      };
    } catch (error) {
      console.log("error from get Todo", error);
      return {
        status: 500,
        json: {
          success: false,
          message: "Internal Server Error",
        },
      };
    }
  }

  async getUserTodo({ userId }) {
    try {
      if (!userId) {
        return {
          status: 400,
          json: {
            success: true,
            message: "Missing required fields",
          },
        };
      }
      const todos = await Todo.find({ createdBy: userId });
      return {
        status: 200,
        json: {
          success: true,
          todos,
        },
      };
    } catch (error) {
      console.log("error from get user Todo", error);
      return {
        status: 500,
        json: {
          success: false,
          message: "Internal Server Error",
        },
      };
    }
  }

  async updateTodo({
    title,
    description,
    priority,
    mentions,
    notes,
    createdBy,
    todoId,
    userId,
  }) {
    try {
      if (!todoId) {
        return {
          status: 400,
          json: {
            success: false,
            message: "Missing required fields",
          },
        };
      }

      const foundTodo = await Todo.findById(todoId);
      if (!foundTodo) {
        return {
          status: 404,
          json: {
            success: false,
            message: "Todo not found",
          },
        };
      }
      console.log(foundTodo.createdBy.toString(), userId);
      if (foundTodo.createdBy.toString() !== userId) {
        return {
          status: 401,
          json: {
            success: false,
            message: "Unauthorized",
          },
        };
      }

      const updateQuery = {};
      if (title) updateQuery.title = title;
      if (description) updateQuery.description = description;
      if (priority) updateQuery.priority = priority;

      const updateOps = {};
      if (mentions && mentions.length > 0) {
        updateOps.$addToSet = { mentions: { $each: mentions } };
      }

      const finalUpdate = {
        ...updateQuery,
        ...updateOps,
      };

      const todo = await Todo.findByIdAndUpdate(todoId, finalUpdate, {
        new: true,
      });

      return {
        status: 200,
        json: {
          success: true,
          message: "Todo updated successfully",
          todo,
        },
      };
    } catch (error) {
      console.log("error from update Todo", error);
      return {
        status: 500,
        json: {
          success: false,
          message: "Internal Server Error",
        },
      };
    }
  }

  async addNotes({ todoId, content, user, createdBy }) {
    try {
      if (!todoId || !content) {
        return {
          status: 400,
          json: {
            success: false,
            message: "Missing required fields",
          },
        };
      }

      const todo = await Todo.findById(todoId);
      if (!todo) {
        return {
          status: 404,
          json: {
            success: false,
            message: "Todo not found",
          },
        };
      }
      const noteData = {
        content,
        createdBy,
        createdAt: new Date(),
      };
      if (user && Array.isArray(user) && user.length > 0) {
        noteData.user = user;
      }
      const updated = await Todo.findByIdAndUpdate(
        todoId,
        { $push: { notes: noteData } },
        { new: true }
      );
      return {
        status: 200,
        json: {
          success: true,
          message: "Notes added successfully",
          todo: updated,
        },
      };
    } catch (error) {
      console.log("error from add notes", error);
      return {
        status: 500,
        json: {
          success: false,
          message: "Internal Server Error",
        },
      };
    }
  }

  async deleteTodo({ todoId, userId }) {
    try {
      if (!todoId || !userId) {
        return {
          status: 400,
          json: {
            success: false,
            message: "Missing required fields",
          },
        };
      }

      const todo = await Todo.findById(todoId);
      if (!todo) {
        return {
          status: 404,
          json: {
            success: false,
            message: "Todo not found",
          },
        };
      }
      if (todo.createdBy.toString() !== userId) {
        return {
          status: 401,
          json: {
            success: false,
            message: "Unauthorized",
          },
        };
      }
      await Todo.findByIdAndDelete(todoId);
      return {
        status: 200,
        json: {
          success: true,
          message: "Todo deleted successfully",
        },
      };
    } catch (error) {
      console.log("error from add notes", error);
      return {
        status: 500,
        json: {
          success: false,
          message: "Internal Server Error",
        },
      };
    }
  }
}
module.exports = TodoFunctions;
