import { Router } from "express";
import { createTransaction } from "../controllers/transaction.controller.js";
import { verifyJWT } from "../middlewares/auth.Middleware.js";

const router = Router();

router.route("/transactions").post(verifyJWT, createTransaction);

export default router;