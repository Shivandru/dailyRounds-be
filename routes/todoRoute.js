const express = require("express");
const todoRouter = express.Router();
const TodoFunctions = require("../functions/todoFunctions");
const auth = require("../middlewares/auth");

const todoFunctions = new TodoFunctions();

todoRouter.post("/create", auth, async (req, res) => {
  try {
    const { status, json } = await todoFunctions.createTodo({
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority,
      mentions: req.body.mentions,
      notes: req.body.notes,
      createdBy: req.userId,
    });
    res.status(status).send(json);
  } catch (error) {
    console.log("error from create todo", error);
    res.status(500).send(error);
  }
});

todoRouter.get("/allTodos", auth, async (req, res) => {
  try {
    const { status, json } = await todoFunctions.getAllTodos();
    res.status(status).send(json);
  } catch (error) {
    res.status(500).send(error);
  }
});

todoRouter.get("/:todoId", auth, async (req, res) => {
  try {
    const { status, json } = await todoFunctions.getTodo({
      todoId: req.params.todoId,
    });
    res.status(status).send(json);
  } catch (error) {
    res.status(500).send(error);
  }
});

todoRouter.get("/userTodo/:userId", auth, async (req, res) => {
  try {
    const { status, json } = await todoFunctions.getUserTodo({
      userId: req.params.userId,
    });
    res.status(status).send(json);
  } catch (error) {
    res.status(500).send(error);
  }
});

todoRouter.patch("/update/:todoId", auth, async (req, res) => {
  try {
    const { status, json } = await todoFunctions.updateTodo({
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority,
      mentions: req.body.mentions,
      notes: req.body.notes,
      createdBy: req.body.createdBy,
      todoId: req.params.todoId,
      userId: req.userId,
    });
    res.status(status).send(json);
  } catch (error) {
    res.status(500).send(error);
  }
});

todoRouter.patch("/notes/:todoId", auth, async (req, res) => {
  try {
    const { status, json } = await todoFunctions.addNotes({
      todoId: req.params.todoId,
      content: req.body.content,
      user: req.body?.user,
      createdBy: req.userId,
    });
    res.status(status).send(json);
  } catch (error) {
    res.status(500).send(error);
  }
});

todoRouter.delete("/delete/:todoId", auth, async (req, res) => {
  try {
    const { status, json } = await todoFunctions.deleteTodo({
      todoId: req.params.todoId,
      userId: req.userId,
    });
    // console.log(json);
    res.status(status).send(json);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = todoRouter;
