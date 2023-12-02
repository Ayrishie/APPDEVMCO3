import Building from "../models/Building.js";
import Reservation from "../models/Reservation.js";

const reservationController = {
    getReservation: async function (req, res) {
        try {
            console.log("Incoming request to getReservation:", req.url);
            const building = await Building.findOne({ buildingID: req.params.buildingID }).lean();
    
            if (!building) {
                // Handle the case where no building is found
                console.log("Building not found");
                return res.status(404).send("Building not found");
            }
    
            console.log("Building found:", building);
    
            res.render("reservation", {
                title: building.buildingName + " - Labify",
                css: ["reservation"],
                js: ["reservation", "session"],
                building: building,
                account: {
                    email: req.session.email,
                    isLoggedIn: req.session.isLoggedIn,
                    isTechnician: req.session.isTechnician
                }
            });
        } catch (error) {
            // Handle other errors, log them, or send an appropriate response
            console.error("Error in getReservation:", error);
            res.status(500).send("Internal Server Error");
        }
    },
   

    getReservations: async function(req, res){
        const reservations = await Reservation.find({
            building: req.query.building,
            reservationDate: req.query.reservationDate,
            reservationTime: req.query.reservationTime
        }).lean();

        res.send(reservations);
    }
,

// New method for handling both regular and anonymous reservations
postReservation: async function (req, res) {
    const { building, reservationDate, reservationTime, seatID } = req.body;
    const isAnonymous = req.body.isAnonymous === 'true';
    console.log("isAnonymous:", isAnonymous);
    
    try {
        console.log("Received reservation request with isAnonymous:", isAnonymous);

        let reservation;
        if (isAnonymous) {
            // Handle anonymous reservation logic
            console.log("Processing anonymous reservation");
            // Handle anonymous reservation logic
                reservation = await Reservation.create({
                    building,
                    reservationDate,
                    reservationTime,
                    seatID,
                    isAnonymous: true,
                    reservedBy: isAnonymous ? "Anonymous" : req.session.email
                });

        }        
         else {
            // Handle regular reservation logic
            console.log("Processing regular reservation");
            reservation = await Reservation.create({
                building,
                reservedBy: req.session.email,
                reservationDate,
                reservationTime,
                seatID,
                isAnonymous: false
            });
        }

        console.log("Reservation processed successfully:", reservation);

        res.status(200).send({ reservation, isAnonymous });
    } catch (error) {
        console.error("Error processing reservation:", error);
        console.error("Error stack trace:", error.stack);
        res.status(500).send("Internal Server Error");
    }
},

    deleteReservation: async function (req, res) {
        if (req.session.isTechnician) {
            const { building, reservedBy, reservationDate, reservationTime, seatID } = req.body;
            await Reservation.deleteOne({ building, reservedBy, reservationDate, reservationTime, seatID });
            res.sendStatus(200);
        } else {
            res.status(403).json({ message: 'Unauthorized' });
        }
    }
};

export default reservationController;