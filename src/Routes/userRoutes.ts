import express from 'express';
import {saveInfo, feedbackUser,} from "@/Controllers/userController";

export const router = express.Router();


router.route("/saveInfo").post(saveInfo); 
router.route("/feedbackUser").post(feedbackUser);
