const nodemailer = require('nodemailer');
const customError = require('../customError');

async function submitContactForm (req, res, next){
  try {
    const {
      fullName,
      email,
      phoneNumber,
      reason,
      howDidYouHear,
      message
    } = req.body;
    if (!fullName || !email || !phoneNumber || !message) {
      return next(customError( 'Missing required fields' ))
    }


    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email template for the company (orange theme)
    const companyMailOptions = {
      from: `"Blord Contact Form Submission" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: 'New Contact Form Submission',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; }
            .header { background: linear-gradient(to right, #ff7f00, #ffa500); color: white; padding: 20px; text-align: center; }
            .content { background-color: white; padding: 20px; border-radius: 5px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 10px; border-bottom: 1px solid #ddd; text-align: left; }
            th { background-color: #ff7f00; color: white; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Blord Contact Form Submission</h1>
            </div>
            <div class="content">
              <p>A new contact form submission has been received with the following details:</p>
              <table>
                <tr><th>Field</th><th>Value</th></tr>
                <tr><td>Full Name</td><td>${fullName}</td></tr>
                <tr><td>Email</td><td>${email}</td></tr>
                <tr><td>Phone Number</td><td>${phoneNumber}</td></tr>
                <tr><td>Reason for Contact</td><td>${reason}</td></tr>
                <tr><td>How Did You Hear About Us</td><td>${howDidYouHear}</td></tr>
                <tr><td>Message</td><td>${message}</td></tr>
              </table>
              <p>Please review the message and respond accordingly.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Send email to the company
    await transporter.sendMail(companyMailOptions);

    // Email template for the user
    const userMailOptions = {
      from: `"Blord Contact Form System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Blord Contact Form Submission Confirmation',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Blord Contact Form Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; }
            .header { background: linear-gradient(to right, #ff7f00, #ffa500); color: white; padding: 20px; text-align: center; }
            .content { background-color: white; padding: 20px; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Blord Contact Form Submission Confirmation</h1>
            </div>
            <div class="content">
              <p>Dear ${fullName},</p>
              <p>Thank you for contacting us. We have received the following details:</p>
              <ul>
                <li><strong>Full Name:</strong> ${fullName}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Phone Number:</strong> ${phoneNumber}</li>
                <li><strong>Reason for Contact:</strong> ${reason}</li>
                <li><strong>How Did You Hear About Us:</strong> ${howDidYouHear}</li>
                <li><strong>Message:</strong> ${message}</li>
              </ul>
              <p>We will review your message and get back to you shortly.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Send confirmation email to the user
    await transporter.sendMail(userMailOptions);

    return res.status(201).json({ message: 'Contact form submitted and emails sent successfully' });

  } catch (error) {
    // console.error(error);
    return next(customError({ error: 'Error submitting contact form' }))
  }
};


module.exports = {
    submitContactForm
}