const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // You can use other services like SendGrid, Mailgun, etc.
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS_KEY,
  },
});

const sendRejectionEmail = async (email, username) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Application Status Update',
    text: `Dear Dr. ${username},

Thank you for your interest in joining Book My Doc and for submitting your application. We appreciate the time you invested in completing the application process.

After a thorough review, we regret to inform you that we are unable to move forward with your application at this time. Our decision is based on the fact that we did not receive the necessary support documents required to verify your credentials and qualifications.

To proceed with your application in the future, we kindly request that you provide the following documents:
*Experience Certificate
*Registration Certificate
*Highest Qualification document

We value the expertise and dedication you bring to the medical field, and we would be pleased to reconsider your application once the required documentation is submitted.

Thank you for understanding, and we hope to have the opportunity to work with you in the future. If you have any questions or need further assistance, please feel free to contact us at same email.

Best regards,

Narayana 
Admin
Book My Doc`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Rejection email sent successfully');
  } catch (error) {
    console.error('Error sending rejection email:', error);
  }
};

const sendVerificationSuccessEmail = async (email, username) => {
  const mailOptions = {
    from: 'narayanabommi123@gmail.com',
    to: email,
    subject: 'Application Verified Successfully',
    text: `Dear ${username},

Congratulations! Your application has been verified successfully. Please proceed to create your profile and set your availability to connect with patients.

Best regards,
Book My Doc`,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification success email sent successfully');
  } catch (error) {
    console.error('Error sending verification success email:', error);
  }
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
};

const sendOTPEmail = async (email, username) => {
  const otp = generateOTP(); // Generate OTP
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Your OTP for Password Reset',
    text: `Dear ${username},

Your OTP for resetting your password is: ${otp}

Please use this OTP to complete the password reset process. This OTP is valid for 10 minutes.

If you did not request a password reset, please ignore this email.

Best regards,
Book My Doc`,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully');
    return otp; // Return the generated OTP for further processing
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};

module.exports = {
  sendRejectionEmail,
  sendVerificationSuccessEmail,
  sendOTPEmail
};

