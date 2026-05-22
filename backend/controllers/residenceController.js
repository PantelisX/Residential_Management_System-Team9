// backend/controllers/residenceController.js
const residenceModel = require('../models/residenceModel');

/**
 * Get all residences for the authenticated user
 * @param {Object} req - Express request object (req.user added by authMiddleware)
 * @param {Object} res - Express response object
 */
async function getResidencesForUser(req, res) {
  try {
    const userId = req.user.user_id;

    // Fetch residences for the user
    const residences = await residenceModel.getUserResidences(userId);

    res.status(200).json({
      message: 'Residences fetched successfully',
      residences: residences
    });
  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
}

async function createResidence(req, res) {
  try {
    const userId = req.user.user_id;

    const {
      address,
      description
    } = req.body;

    const residenceId = await residenceModel.createResidence(
      userId,
      address,
      description
    );

    res.status(201).json({
      message: 'Residence created successfully',
      residence_id: residenceId
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
}

module.exports = {
  getResidencesForUser,
  createResidence
};
