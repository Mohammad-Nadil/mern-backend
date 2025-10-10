export const verifyMailTemplate = (userName, verifyLink) => `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
    <h2 style="color: #4F46E5;">Welcome to Notes App, ${userName}!</h2>
    <p>Thanks for signing up. Please verify your email address by clicking the button below:</p>
    
    <a href="${verifyLink}" 
       style="display: inline-block; margin-top: 15px; padding: 10px 20px; 
              background-color: #4F46E5; color: white; text-decoration: none; 
              border-radius: 6px; font-weight: bold;">
      Verify Email
    </a>
    
    <p style="margin-top: 20px;">If you didn’t create an account, just ignore this email.</p>
    <hr style="margin-top: 25px;" />
    <p style="font-size: 12px; color: #666;">
      © ${new Date().getFullYear()} Notes App — All rights reserved.
    </p>
  </div>
`;
