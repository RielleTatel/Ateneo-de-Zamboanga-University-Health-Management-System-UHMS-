import express from "express";
import Debugging from "../controllers/controllerDebugging.js";

const router = express.Router(); 

router.get("/test-supabase", Debugging.testSupabase);
router.get("/check-user/:userId", Debugging.checkUserStatus);

export default router; 