import nodemailer from "nodemailer";

// Generate a 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via email
export const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "UniVents - Email Verification OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #00335E, #004d8c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">UniVents</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Email Verification</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Verify Your Email Address</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            Thank you for registering with UniVents! To complete your registration, please enter the following verification code:
          </p>
          
          <div style="background: #f8f9fa; border: 2px dashed #00335E; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
            <div style="font-size: 32px; font-weight: bold; color: #00335E; letter-spacing: 8px; font-family: 'Courier New', monospace;">
              ${otp}
            </div>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
            This code will expire in 10 minutes for security reasons.
          </p>
          
          <div style="background: #e8f4fd; border-left: 4px solid #00335E; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #333; font-size: 14px;">
              <strong>Security Tip:</strong> Never share this OTP with anyone. UniVents will never ask for this code via phone or email.
            </p>
          </div>
          
          <p style="color: #999; font-size: 12px; margin-top: 30px; text-align: center;">
            If you didn't create an account with UniVents, please ignore this email.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
};

// Validate OTP format
export const validateOTP = (otp) => {
  return /^\d{6}$/.test(otp);
};

// Check if OTP is expired
export const isOTPExpired = (otpExpiry) => {
  return new Date() > new Date(otpExpiry);
};

// Calculate time remaining for OTP
export const getOTPTimeRemaining = (otpExpiry) => {
  const now = new Date();
  const expiry = new Date(otpExpiry);
  const diff = expiry - now;

  if (diff <= 0) return 0;

  return Math.ceil(diff / 1000); // Return seconds remaining
};
