const express = require("express");
const {saveInfo}= require("../Controllers/userController");

const Router = express.Router();


Router.route("/saveInfo").post(saveInfo); 


module.exports = Router;