import mongoose from "mongoose";
const {Schema, model} = mongoose;

const accountSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isTechnician: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        default: "This user has not placed a description yet."
    },
    profilePicture: {
        type: String,
        default: "https://fakeimg.pl/400x400?text=+"
    }
});

const Account = model("Account", accountSchema);
export default Account;