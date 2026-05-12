const express = require("express");

const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// GET TASKS

router.get(
  "/",
  authMiddleware,
  async (req, res) => {

    try {

      const tasks = await Task.find({
        userId: req.userId,
      });

      res.json(tasks);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }
  }
);


// ADD TASK

router.post(
  "/",
  authMiddleware,
  async (req, res) => {

    try {

      const task = await Task.create({

        title: req.body.title,

        priority: req.body.priority,

        deadline: req.body.deadline,

        completed: false,

        userId: req.userId,

      });

      res.status(201).json(task);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }
  }
);


// TOGGLE TASK

router.put(
  "/:id",
  authMiddleware,
  async (req, res) => {

    try {

      const task =
        await Task.findById(req.params.id);

      if (!task) {

        return res.status(404).json({
          message: "Task not found",
        });

      }

      task.completed =
        !task.completed;

      await task.save();

      res.json(task);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }
  }
);


// EDIT TASK

router.patch(
  "/:id",
  authMiddleware,
  async (req, res) => {

    try {

      const updatedTask =
        await Task.findByIdAndUpdate(

          req.params.id,

          {
            title: req.body.title,

            priority: req.body.priority,

            deadline : req.body.deadline,
          },

          {
            new: true,
          }
        );

      res.json(updatedTask);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }
  }
);


// DELETE TASK

router.delete(
  "/:id",
  authMiddleware,
  async (req, res) => {

    try {

      await Task.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message: "Task deleted",
      });

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }
  }
);


module.exports = router;