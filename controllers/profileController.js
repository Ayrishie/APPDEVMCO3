import Account from "../models/Account.js";
import Reservation from "../models/Reservation.js";

const profileController = {
    getProfile: async function(req, res){
        if(req.session.isLoggedIn){
            const result = await Account.findOne({email: req.params.email}).lean();

            if(result){
                const reservations = await Reservation.find({reservedBy: result.email}).lean();

                const isOwnProfile = req.session.email === req.params.email; // Add this line

                res.render("profile", {
                    title: req.params.email + " - Labify",
                    css: "profile",
                    js: "profile",
                    account: {
                        email: req.session.email,
                        isLoggedIn: req.session.isLoggedIn
                    },
                    result: result,
                    reservations,
                    isOwnProfile // Add this line
                });
            } else
                res.render("profile", {
                    title: "Profile - Labify",
                    css: "profile",
                    js: "profile",
                    account: {
                        email: req.session.email,
                        isLoggedIn: req.session.isLoggedIn
                    },
                    error: "This user does not exist."
                });
        } else
            res.redirect("/login");
    },


    updateProfile: async function (req, res) {
        try {
            const email = req.session.email; // Get email from session
            const description = req.body.description;
            const profilePicture = req.file ? '/uploads/' + req.file.filename : undefined; // Check if a file was uploaded
    
            const updateData = { description };
            if (profilePicture) {
                updateData.profilePicture = profilePicture;
            }
    
            // Update the user's profile in the database
            await Account.findOneAndUpdate({ email: email }, updateData);
    
            // Redirect to the user's profile page after the update
            res.redirect(`/profile/${email}`);
        } catch (error) {
            res.status(500).json({ message: 'Error updating profile', error: error });
        }
    },

    deleteAccount: async function (req, res) {
        const email = req.session.email;

        // Delete reservations associated with the user
        await Reservation.deleteMany({ reservedBy: email });

        // Delete the user account
        await Account.deleteOne({ email: email });

        // Logout the user and redirect to the home page
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
            }
            res.sendStatus(200);
        });
    }
    
    
    

};

export default profileController;
