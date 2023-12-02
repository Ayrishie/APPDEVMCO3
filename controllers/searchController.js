import Building from "../models/Building.js";
import reservationController from "../controllers/reservationController.js";
import express from "express";

const searchController = {
    getSearch: async function(req, res){
        const searchQuery = req.query.building.toLowerCase();
        const buildings = await Building.find({ buildingNameLower: { $regex: searchQuery, $options: 'i' } }).lean();

        res.render("search", {
            css: ["search"],
            js: ["search"],
            buildings: buildings
        });
    }
};

export default searchController;