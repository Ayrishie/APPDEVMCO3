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
                js: ["reservation"],
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
    const { building, reservationDate, reservationTime, reservationTimeStart, reservationTimeEnd, seatID } = req.body;
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
                    reservationTimeStart,
                    reservationTimeEnd,
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
                reservationTimeStart,
                reservationTimeEnd,
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
            const { building, reservedBy, reservationDate, reservationTime, reservationTimeStart, reservationTimeEnd, seatID } = req.body;
            const current_time = new Date().getHours() * 60 * 60 * 1000;

            if(current_time >= reservationTimeStart + (10 * 60 * 1000)) {
                await Reservation.deleteOne({
                    building,
                    reservedBy,
                    reservationDate,
                    reservationTime,
                    reservationTimeStart,
                    reservationTimeEnd,
                    seatID
                });
                res.sendStatus(200);
            } else
                res.sendStatus(403);
        } else {
            res.status(403).json({ message: 'Unauthorized' });
        }
    },

    getAkinBaTo: function(req, res){
        if((req.query.reservedBy === req.session.email) || req.session.isTechnician)
            res.send({result: true});
        else
            res.send({result: false});
    },

    postEditReservation: async function(req, res){
        const {
            building,
            reservedBy,
            reservationDate,
            reservationTime,
            reservationTimeStart,
            reservationTimeEnd,
            seatID,
            newReservationTime,
            newReservationTimeStart,
            newReservationTimeEnd
        } = req.body;

        const result = await Reservation.updateOne({
            building,
            reservedBy,
            reservationDate,
            reservationTime,
            reservationTimeStart,
            reservationTimeEnd,
            seatID,
        },
        {
            reservationTime: newReservationTime,
            reservationTimeStart: newReservationTimeStart,
            reservationTimeEnd: newReservationTimeEnd
        });

        console.log("result: " + result);

        if(result)
            res.sendStatus(200);
        else
            res.sendStatus(422);
    }
};

export default reservationController;