import mongoose from "mongoose";
const {Schema, model} = mongoose;

const reservationSchema = new Schema({
    building: {
        type: String,
        required: true
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    reservedBy: {
        type: String,
        required: true
    },
    reservationDate: {
        type: String,
        required: true
    },
    reservationTime: {
        type: String,
        required: true
    },
    reservationTimeStart: {
        type: Number,
        required: true
    },
    reservationTimeEnd: {
        type: Number,
        required: true
    },
    seatID: {
        type: Number,
        required: true
    }
});

const Reservation = model("Reservation", reservationSchema);

export default Reservation;