// buildingController.js

import Building from '../models/Building.js'; // Import your Building model or schema

export const getBuildingPage = async (req, res) => {
  try {
    // Retrieve the building ID from the request parameters
    const { id } = req.params;

    // Find the building by ID in your database
    const building = await Building.findById(id);

    // Check if the building exists
    if (!building) {
      return res.status(404).send('Building not found');
    }

    // Render the building page using a template (e.g., building.hbs)
    res.render('building', { building });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
