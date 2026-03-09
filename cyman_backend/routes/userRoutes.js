import express from "express";
import {
  getAllUsers,
  makeAdmin,
  removeAdmin,
  deleteUser
} from "../controllers/userController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getAllUsers);
router.put("/make-admin/:id", protect, adminOnly, makeAdmin);
router.put("/remove-admin/:id", protect, adminOnly, removeAdmin);
router.delete("/:id", protect, adminOnly, deleteUser);

export default router;