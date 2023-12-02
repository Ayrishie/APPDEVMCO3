import Account from "../models/Account.js";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
const salt_rounds = 10;

const signupController = {
    getSignup: function(req, res){
        res.render("signup", {
            title: "Sign Up - Labify",
            css: ["access"],
            js: ["validator.min", "signup", "session"],
            exclude_header: true
        });
    },

    postSignup: function (req, res) {
        if(!validationResult(req).isEmpty()) {
            const validation_errors = validationResult(req).errors;
            let errors = {};

            for(let i = 0; i < validation_errors.length; i++)
                errors["error_" + validation_errors[i].path] = validation_errors[i].msg;

            res.render("signup", {
                title: "Sign Up - Labify",
                css: ["access"],
                js: ["validator.min", "signup"],
                exclude_header: true,
                errors
            });
        } else
            bcrypt.hash(req.body.password, salt_rounds, (err, hash) => {
                Account.create({
                    email: req.body.email,
                    password: hash,
                    isTechnician: req.body.isTechnician === "on"
                }).then(() => {
                    res.redirect("/login");
                });
            });

        /*
        const account = await Account.findOne({email: req.body.email});

        if(!account){
            Account.create({
                email: req.body.email,
                password: req.body.password,
                isTechnician: req.body.isTechnician === "on"
            }).then(() => {
                res.redirect("/login");
            });
        } else
            res.render("signup", {
                title: "Sign Up - Labify",
                css: "access",
                js: "signup",
                exclude_header: true,
                error: "This email is already registered."
            })
        */
    },

    checkEmail: async function(req, res){
        const data = await Account.findOne({email: req.query.email});

        res.send(data);
    }
};

export default signupController;
/*
import Account from "../models/Account.js";

const signupController = {
    getSignup: function(req, res) {
        res.render("signup", {
            title: "Sign Up - Labify",
            css: "access",
            exclude_header: true
        });
    },

    postSignup: async function(req, res) {
        const { email, password } = req.body;
        console.log("Signup attempt with email: ", email);
        console.log("Signup attempt with password: ", password);

        const existingAccount = await Account.findOne({ email });
        console.log("Checking account :", existingAccount);
        if (existingAccount) {
            console.log("email already exists: ", existingAccount);
            return res.render("signup", {
                title: "Sign Up - Labify",
                css: "access",
                exclude_header: true,
                error: "This email is already registered."
            });
        }

        const newAccount = await Account.create({ email, password });
        console.log("New account created: ", newAccount);

        res.redirect("/login");
    }
};

export default signupController;
*/