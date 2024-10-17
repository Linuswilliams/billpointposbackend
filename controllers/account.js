const { createAdminAccount, signinAdminAccount, sendEmailOneTimePassword, verifyUserOneTimePassword, changeForgottenPassword, logoutUser } = require('../lib/appwrite');
const customError = require('../customError');
const Admin = require('../models/account')
// Controller to create an admin
async function createAdmin(req, res, next) {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return next(customError({ message: 'Missing some parameters' }));
    }

    // Create the admin account in Appwrite
    const createUserInAppwrite = await createAdminAccount(email, password);

    // Create a new admin in the database
    const newAdmin = new Admin({
      email,
      authId: createUserInAppwrite.userId
    });

    // Save the new admin to the database
    await newAdmin.save();

    // Return a success message
    return res.status(201).json({ message: 'Admin created successfully' });
  } catch (err) {
    console.error(err);
    next(customError(err));
  }
}


async function loginAdmin(req, res, next) {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return next(customError({ message: 'Missing some parameters' }));
    }

    // Check if the admin exists
    const checkIfAdminExists = await Admin.findOne({ email });

    if (!checkIfAdminExists) {
      return next(customError('Admin does not exist'));
    }

    // Sign in the admin account in Appwrite
    const signinUserWithAppwrite = await signinAdminAccount(email, password);

    console.log(signinUserWithAppwrite, 'appwrite')
    // Calculate session expiration time (2 hours from now)
    const sessionDuration = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
    const sessionExpiresAt = new Date(Date.now() + sessionDuration);

    // Update admin's session expiration time in the database

    const updateSession = await Admin.findByIdAndUpdate(checkIfAdminExists._id, {
      sessionExpireAt: sessionExpiresAt,
      authId: signinUserWithAppwrite.userId
    }, {new: true})

    return res.status(200).json({
      message: updateSession,
  
    });
  } catch (err) {
    console.error(err);
    next(customError(err));
  }
}

async function sendEmailOtpForVerification(req, res, next) {
  try {
      const { authId, email } = req.body;

      console.log(authId, email, 'send')

      const sendOtp = await sendEmailOneTimePassword(authId, email);

      return res.json({ message: sendOtp });
  } catch (err) {
      next(customError(err));
  }
}

async function verifyOtpSentToUser(req, res, next) {
  try {
      const { authId, otp } = req.body;

      console.log(authId, otp);

      const verifyOtp = await verifyUserOneTimePassword(authId, otp);

      console.log(verifyOtp);

      return res.json({ message: verifyOtp });
  } catch (err) {
      console.log(err);
      next(customError(err));
  }
}

async function changeForgotPwdAdmin (req, res, next) {
  try {
    const { userId, password } = req.body;

    console.log(userId, 'userId')
    const updatePassword = await changeForgottenPassword(userId, password);

    console.log(updatePassword, 'updated pass');
    return res.json({ message: updatePassword });
} catch (err) {
    console.log(err);
    next(customError(err));
}
}

const isSessionValid = (sessionExpiresAt) => {
  return new Date() < new Date(sessionExpiresAt); // Compare current time with session expiration time
};

async function getSession (req, res, next) {
  try {
    const { email } = req.params

    if (!email) {
      return next(customError({ message: 'Email is required' }))
    }
    // Find the admin by email
    const admin = await Admin.find({ email });

    console.log(admin)
    if (!admin || admin.length === 0) {
      return next(customError('Admin not found' ))
    }

    // Check if the session expiration time exists
    if (!admin[0].sessionExpireAt) {
      return next(customError('No active session found' ))
    }

    // Check if the session is still valid
    const isValid = isSessionValid(admin[0].sessionExpireAt);

    if (!isValid) {
      return next(customError('Session has expired' ))
    }

    return res.status(200).json({
      message: 'Session is still valid',
      sessionExpiresAt: admin[0].sessionExpiresAt,
    });

  } catch (err) {
    console.error(err);
    return next(customError((err)))
  }
};

async function logoutUserSession(req, res, next) {
  try {
      const { authId, userId } = req.body;

      if (!authId || !userId) 
          return next(customError('You have a missing parameter (authId,)'));

      await Promise.all([
        await logoutUser(authId),
        Admin.findByIdAndUpdate(userId,{
          sessionExpireAt:0
        })
      ])

      return res.json({ message: "You have successfully logged out", session: '', status: 200 });
  } catch (err) {
      next(customError(err));
  }
}

async function getUserInfo(req, res, next){
  try{
    const {email} = req.params

    const checkIfEmailExists = await Admin.find({email})

    if(checkIfEmailExists.length === 0) return next(customError('Email does not exist'))

      return res.json({message: checkIfEmailExists[0]})
  }
  catch(err){
    console.log(err)
    next(customError(err))
  }
}
module.exports = {
  createAdmin,
  loginAdmin,
  sendEmailOtpForVerification,
  verifyOtpSentToUser,
  changeForgotPwdAdmin,
  getSession,
  logoutUserSession,
  getUserInfo
}
