import Building from "../models/Building.js";
import reservationController from "../controllers/reservationController.js";
import express from "express";

const searchController = {
    getSearch: async function(req, res){
        const building = await Building.findOne({buildingNameLower: req.query.building.toLowerCase()}).lean();

        res.render("search", {
            css: "search",
            js: "search",
            building: building
        });
    }
};

export default searchController;
