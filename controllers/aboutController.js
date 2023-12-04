import Building from "../models/Building.js";

const aboutController = {
    getAbout: function(req, res){
        if(req.session.isLoggedIn){
            res.render("about", {
                title: "About - Laboratory Reservation",
                css: ["about"],
                account: {
                    email: req.session.email,
                    isLoggedIn: req.session.isLoggedIn
                }
            });
        } else
            res.redirect("/login");
    }
};

export default aboutController;