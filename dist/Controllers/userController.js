"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAlive = exports.feedbackUser = void 0;
const feedbackModel_1 = require("@/Models/feedbackModel");
const feedbackUser = async (req, res) => {
    try {
        const feedback = await feedbackModel_1.Feedback.create({
            Name: req.body.name,
            Email: req.body.email,
            Subject: req.body.subject,
            Content: req.body.content,
            Time: Date.now()
        });
        res.status(200).json({
            status: "Success....",
            feedbackData: feedback
        });
    }
    catch (e) {
        res.status(500).json({
            status: "Something went wrong...",
            error: e
        });
    }
};
exports.feedbackUser = feedbackUser;
const isAlive = async (req, res) => {
    try {
        res.status(200).json({
            status: "Success",
            message: "Server is Alive..."
        });
    }
    catch (err) {
        res.status(500).json({
            status: "Something went wrong...",
            error: err
        });
    }
};
exports.isAlive = isAlive;
