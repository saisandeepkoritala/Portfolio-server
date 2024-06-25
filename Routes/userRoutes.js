const express = require("express");
const {saveInfo,feedbackUser}= require("../Controllers/userController");

const Router = express.Router();


Router.route("/saveInfo").post(saveInfo); 
Router.route("/feedbackUser").post(feedbackUser)


module.exports = Router;