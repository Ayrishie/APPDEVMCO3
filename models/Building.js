import mongoose from "mongoose";
const {Schema, model} = mongoose;

const buildingSchema = new Schema({
    // buildingCapacity: Number,
    buildingID: String,
    buildingName: String,
    buildingNameLower: String
});

const Building = model("Building", buildingSchema);

export default Building;