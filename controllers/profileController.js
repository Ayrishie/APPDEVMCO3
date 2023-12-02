import Account from "../models/Account.js";
import Reservation from "../models/Reservation.js";
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads"); // Set the destination folder for uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname); // Set the file name to be unique
    },
});

const upload = multer({ storage: storage });
const profileController = {
    getProfile: async function(req, res){
        if(req.session.isLoggedIn){
            const result = await Account.findOne({email: req.params.email}).lean();

            if(result){
                const reservations = await Reservation.find({reservedBy: result.email}).lean();

                const isOwnProfile = req.session.email === req.params.email;

                res.render("profile", {
                    title: req.params.email + " - Labify",
                    css: ["profile"],
                    js: ["profile", "session"],
                    account: {
                        email: req.session.email,
                        isLoggedIn: req.session.isLoggedIn
                    },
                    result: result,
                    reservations,
                    isOwnProfile 
                });
            } else
                res.render("profile", {
                    title: "Profile - Labify",
                    css: ["profile"],
                    js: ["profile"],
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
        const email = req.session.email;
        const description = req.body.description;
        
        let updateData = { description };
    
        // Check if a file was uploaded
        if (req.file) {
            const profilePicture = '/uploads/' + req.file.filename;
            updateData.profilePicture = profilePicture;
        }
        
        // Update the user's profile
        await Account.findOneAndUpdate({ email: email }, updateData);
        
        // Redirect to the user's profile page after the update
        res.redirect(`/profile/${email}`);
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