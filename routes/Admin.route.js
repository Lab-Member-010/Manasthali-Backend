import express from "express";
import { AdminLogin, AdminSignUp } from "../controller/Admin.controller.js";

const router=express.Router();

router.post("/signUp",AdminSignUp);
router.post("/login",AdminLogin);

export default router;