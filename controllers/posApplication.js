const nodemailer = require('nodemailer');
const PosApplications = require('../models/posApplications');
const customError = require('../customError');
const Notifications = require('../models/notification');


// Controller to get all POS applications
async function getPosApplications (req, res, next){
  try {
    const applications = await PosApplications.find({}).sort({ createdAt: -1 });

    if (!applications || applications.length === 0) {
      return next(customError('Applications not found' ));
    }

    return res.status(200).json({ message: applications });
  } catch (error) {
    // console.error(error);
    next(customError(error)); // Custom error handler or use res.status(500)
  }
};

// Controller to handle new POS application submission
async function submitPosApplication (req, res, next) {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      posType,
      businessName,
      areYouAMerchant,
      address,
      state,
      additionalComments,
      imageUrl,
    } = req.body;

    // Save application to the database
    const newPosApplication = new PosApplications({
      fullName,
      email,
      phoneNumber,
      posType,
      businessName,
      areYouAMerchant,
      address,
      state,
      additionalComments,
      imageUrl,
    });

    const newNotification = new Notifications({
      description: `New POS application by ${fullName}`,
    });

    // Save application and notification in parallel
    await Promise.all([newPosApplication.save(), newNotification.save()]);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email template to the company
    const companyMailOptions = {
      from: `"Blord POS Application System" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Company's email address
      subject: 'New Blord POS Application Received',
      html: generateCompanyEmailTemplate(fullName, email, phoneNumber, posType, businessName, areYouAMerchant, address, state, additionalComments, imageUrl),
    };

    // Email template to the applicant
    const userMailOptions = {
      from: `"POS Application System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'POS Application Confirmation',
      html: generateUserEmailTemplate(fullName, email, phoneNumber, posType, businessName, areYouAMerchant, address, state, additionalComments, imageUrl),
    };

    // Send emails to company and applicant
    await Promise.all([
      transporter.sendMail(companyMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    return res.status(201).json({
      message: 'POS Application data saved and emails sent successfully',
    });
  } catch (error) {
    console.error(error);
    next(customError(error)); 
  }
};

async function getPOSApplicationDetails(req, res, next){
    try{
        const {id} = req.params

        const getDetails = await PosApplications.findById(id)

        if(!getDetails) return next(customError('application details not found'))

        res.json({message: getDetails})
    }
    catch(err){
        // console.log(err)
        next(customError(err))
    }
}
// Helper function to generate email template for the company
function generateCompanyEmailTemplate(fullName, email, phoneNumber, posType, businessName, areYouAMerchant, address, state, additionalComments, imageUrl) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Blord POS Application</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; }
        .header { background: linear-gradient(to right, #ff7f00, #ffa500); color: white; padding: 20px; text-align: center; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 10px; border-bottom: 1px solid #ddd; text-align: left; }
        th { background-color: #ff7f00; color: white; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>POS Application Received</h1>
        </div>
        <p>New POS application submitted with the following details:</p>
        <table>
          <tr><th>Field</th><th>Value</th></tr>
          <tr><td>Full Name</td><td>${fullName}</td></tr>
          <tr><td>Email</td><td>${email}</td></tr>
          <tr><td>Phone Number</td><td>${phoneNumber}</td></tr>
          <tr><td>POS Type</td><td>${posType}</td></tr>
          <tr><td>Business Name</td><td>${businessName}</td></tr>
          <tr><td>Are you a Merchant?</td><td>${areYouAMerchant}</td></tr>
          <tr><td>Address</td><td>${address}</td></tr>
          <tr><td>State</td><td>${state}</td></tr>
          <tr><td>Additional Comments</td><td>${additionalComments}</td></tr>
          ${imageUrl ? `<tr><td>Uploaded Image</td><td><img src="${imageUrl}" width="200" height="200"/></td></tr>` : ''}
        </table>
      </div>
    </body>
    </html>
  `;
}

// Helper function to generate email template for the user
function generateUserEmailTemplate(fullName, email, phoneNumber, posType, businessName, areYouAMerchant, address, state, additionalComments, imageUrl) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>POS Application Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; }
        .header { background: linear-gradient(to right, #ff7f00, #ffa500); color: white; padding: 20px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>POS Application Confirmation</h1>
        </div>
        <p>Dear ${fullName},</p>
        <p>We have received your POS application with the following details:</p>
        <ul>
          <li>Full Name: ${fullName}</li>
          <li>Email: ${email}</li>
          <li>Phone Number: ${phoneNumber}</li>
          <li>POS Type: ${posType}</li>
          <li>Business Name: ${businessName}</li>
          <li>Merchant Status: ${areYouAMerchant}</li>
          <li>Address: ${address}</li>
          <li>State: ${state}</li>
          <li>Additional Comments: ${additionalComments}</li>
          ${imageUrl ? `<li><img src="${imageUrl}" width="200" height="200"/></li>` : ''}
        </ul>
        <p>We will review your application and get back to you shortly.</p>
      </div>
    </body>
    </html>
  `;
}

module.exports = {
    getPosApplications,
    submitPosApplication,
    getPOSApplicationDetails
}
