const customError = require("../customError");
const PosApplications = require("../models/posApplications");


// Controller function to handle GET request for fetching users
async function getUsers (req, res, next) {
  try {
    // Query for POS applications, selecting only 'email' and 'fullName'
    const users = await PosApplications.find({})
      .sort({ createdAt: -1 })  // Sort by creation date in descending order
      .select('email fullName'); // Select only email and fullName fields

    // If no users found, return 404 response
    if (users.length === 0) {
      return next(customError('Users not found' ));
    }

    // Respond with the found users
    return res.status(200).json({ message: users });

  } catch (error) {
    console.error(error);
    // Respond with error message in case of failure
    return next(customError( error ));
  }
};


module.exports = {
    getUsers
}