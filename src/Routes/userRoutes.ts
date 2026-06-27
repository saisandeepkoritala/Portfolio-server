import express from 'express';
import {feedbackUser,isAlive} from "@/Controllers/userController";

export const router = express.Router();

router.route("/isAlive").get(isAlive)
router.route("/feedbackUser").post(feedbackUser);
