import express from "express";
import Transaction from "../models/Transaction.js";
const router = express.Router();

router.post("/", async (req, res) => {
  const data = new Transaction(req.body);
  await data.save();
  res.json(data);
});

router.get("/", async (req, res) => {
  const list = await Transaction.find().sort({ createdAt: -1 });
  res.json(list);
});

router.put("/:id", async (req, res) => {
  const updated = await Transaction.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;