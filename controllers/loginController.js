import Account from "../models/Account.js";

const loginController = {
    getLogin: function(req, res){
        res.render("login", {
            title: "Log In - Labify",
            css: ["access"],
            // js: "login",
            exclude_header: true
        });
    },

    postLogin: async function(req, res){
        const account = await Account.findOne({
            email: req.body.email,
            password: req.body.password
        });

        if(account) {
            req.session.email = account.email;
            req.session.isTechnician = account.isTechnician;
            req.session.isLoggedIn = true;

            res.redirect("/");
        }
        else
            res.render("login", {
                title: "Log In - Labify",
                css: ["access"],
                // js: "login",
                exclude_header: true,
                error: "Invalid login. Please try again."
            })
    }
};

export default loginController;
/*
import Account from "../models/Account.js";

const loginController = {
    getLogin: function(req, res) {
        res.render("login", {
            title: "Log In - Labify",
            css: "access",
            exclude_header: true
        });
    },

    postLogin: async function(req, res) {
        const { email, password } = req.body;
        console.log("Login attempt with email: ", email);
        console.log("Login attempt with password: ", password);

        try {
            const account = await Account.findOne({ email, password });
            console.log("Account found: ", account);

            if (account) {
                req.session.email = account.email;
                req.session.isTechnician = account.isTechnician;
                req.session.isLoggedIn = true;
                console.log("this should go to labpage: ", account);
                res.redirect('http://localhost:3000');
            } else {
                res.json({ success: false, error: "Invalid login. Please try again." });
            }
        } catch (error) {
            console.error("Error during login: ", error);
            res.json({ success: false, error: "An error occurred during login." });
        }
    }
};

export default loginController;
*/