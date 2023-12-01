const logoutController = {
    getLogout: function(req, res){
        req.session.destroy();
        res.redirect("/login");
    }
};

export default logoutController;