export const forgotPasswordTemplate = (userName, resetLink) => `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
    <h2 style="color: #EF4444;">Reset Your Password</h2>
    <p>Hello ${userName},</p>
    <p>We received a request to reset your password. Click the button below to create a new one:</p>
    
    <a href="${resetLink}" 
       style="display: inline-block; margin-top: 15px; padding: 10px 20px; 
              background-color: #EF4444; color: white; text-decoration: none; 
              border-radius: 6px; font-weight: bold;">
      Reset Password
    </a>
    
    <p style="margin-top: 20px;">If you didn’t request a password reset, you can safely ignore this email.</p>
    <hr style="margin-top: 25px;" />
    <p style="font-size: 12px; color: #666;">
      © ${new Date().getFullYear()} Notes App — All rights reserved.
    </p>
  </div>
`;
