const express = require("express")
const router = new express.Router()
const jwt = require("jsonwebtoken")
const Task = require("../models/task.js")
const User = require("../models/user.js")
const frequentlyUsedFunctions = require("../frequentlyUsedFunctions.js")
const auth = frequentlyUsedFunctions.auth


router.post("/newtask", auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      owner: req.user._id
    })
    task.save()
    res.status(200).send(task.details())
  } catch (e) {
    res.status(400).send("bad request")
  }
})

router.delete("/deletetask/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    })
    if (!task) {
      throw new Error()
    }
    res.status(200).send("task deleted successfully")
  } catch (e) {
    res.status(400).send("task not found")
  }

})

router.delete("/deleteall", auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      owner: req.user._id
    })
    if (tasks.length == 0) {
      throw new Error()
    }
    await Task.deleteMany({
      owner: req.user.id
    })
    res.status(200).send("all tasks has been deleted")
  } catch (e) {
    res.status(400).send("no tasks found")
  }
})

router.get("/tasks", auth, async (req, res) => {
  try {
    var match = {}
    var sort = {}
    if (req.query.completion) {
      match.completion = (req.query.completion === "true")
    }
    if(req.query.sortBy){
      const fieldName = (req.query.sortBy.split(":"))[0]
      const order = ((req.query.sortBy.split(":"))[1] === "asc") ? 1 : -1
      sort[fieldName] = order
    }
    const tasks = await Task.find({
      owner: req.user._id,
      ...match
    }, null, {
      skip: parseInt(req.query.skip),
      limit: parseInt(req.query.limit),
      sort:{
        ...sort
      }
    })
    if (tasks.length == 0) {
      throw new Error()
    }
    res.status(200).send(tasks)
  } catch (e) {
    res.status(400).send("no tasks found")
  }
})

router.patch("/updatetask/:id", auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["name", "completion", "description"]
    for (i = 0; i < updates.length; i++) {
      var index = allowedUpdates.indexOf(updates[i])
      if (index == -1) {
        throw new Error("not allowed to update")
      }
    }
    const task = await Task.findOneAndUpdate({
      owner: req.user._id,
      _id: req.params.id
    }, req.body)
    if (!task) {
      throw new Error("task not found")
    }
    res.status(200).send("task updated successfully")
  } catch (e) {
    res.status(404).send(e.toString())
  }
})

module.exports = router
