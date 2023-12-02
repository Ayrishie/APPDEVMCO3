import express from "express";
import indexController from "../controllers/indexController.js";
import loginController from "../controllers/loginController.js";
import logoutController from "../controllers/logoutController.js";
import profileController from "../controllers/profileController.js";
import reservationController from "../controllers/reservationController.js";
import searchController from "../controllers/searchController.js";
import signupController from "../controllers/signupController.js";
import buildingController from '../controllers/buildingController';
import multer from "multer";
import path from "path";
import validation from "../helpers/validation.js";
const routes = express.Router();

// Set up storage for Multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

// Initialize Multer with the storage configuration
const upload = multer({ storage: storage });

/* Index */
routes.route("/").get(indexController.getIndex);

// Add a route for building pages
routes.route('/building/:id').get(buildingController.getBuildingPage);

/* Login */
routes.route("/login").get(loginController.getLogin);
routes.route("/login").post(loginController.postLogin);

/* Logout */
routes.route("/logout").get(logoutController.getLogout);

/* Profile */
routes.route("/profile/:email").get(profileController.getProfile);
routes.post('/profile/update', upload.single('profilePicture'), profileController.updateProfile);
routes.route("/profile/:email/deleteAccount").delete(profileController.deleteAccount);

/* Reservation */
routes.route("/reservation/:buildingID").get(reservationController.getReservation);
routes.route("/reservation/:buildingID").post(reservationController.postReservation);
routes.route("/reservation/:buildingID/getReservations").get(reservationController.getReservations);
routes.route("/reservation/:buildingID/deleteReservation").delete(reservationController.deleteReservation);

/* Search  */
routes.route("/search").get(searchController.getSearch);

/* Signup */
routes.route("/signup").get(signupController.getSignup);
routes.route("/signup").post(validation.signupValidation(), signupController.postSignup);
routes.route("/checkEmail").get(signupController.checkEmail);

export default routes;