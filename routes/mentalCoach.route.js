import express from "express";
import { MentalCoach } from "../controller/mentalCoach.controller.js";

const router=express.Router();

router.post("/ask",MentalCoach);

export default router;