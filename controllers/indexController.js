import Building from "../models/Building.js";

const indexController = {
    getIndex: async function(req, res){
        const buildings = await Building.find({}).lean();

        if(req.session.isLoggedIn){
            res.render("index", {
                title: "Labify - Laboratory Reservation",
                css: "index",
                buildings: buildings,
                account: {
                    email: req.session.email,
                    isLoggedIn: req.session.isLoggedIn
                }
            });
        } else
            res.redirect("/login");


    }
};

export default indexController;