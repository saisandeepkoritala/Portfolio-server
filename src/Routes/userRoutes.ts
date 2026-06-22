import express from 'express';
import {saveInfo, feedbackUser,} from "@/Controllers/userController";
import { askBot } from '@/Controllers/askBotController';

export const router = express.Router();


router.route("/saveInfo").post(saveInfo); 
router.route("/feedbackUser").post(feedbackUser);
router.route("/askBot").post(askBot)
