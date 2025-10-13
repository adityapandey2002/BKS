const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send email notification for new contact inquiry
exports.sendContactNotification = async (contactData, recipients) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipients.join(', '),
      subject: `New Contact Inquiry: ${contactData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #ea580c; border-bottom: 2px solid #ea580c; padding-bottom: 10px;">
            🔔 New Contact Inquiry
          </h2>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #333;">Customer Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; background: #f5f5f5; font-weight: bold; width: 30%;">Name:</td>
                <td style="padding: 8px;">${contactData.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px; background: #f5f5f5; font-weight: bold;">Email:</td>
                <td style="padding: 8px;">${contactData.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px; background: #f5f5f5; font-weight: bold;">Phone:</td>
                <td style="padding: 8px;">${contactData.phone || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px; background: #f5f5f5; font-weight: bold;">Subject:</td>
                <td style="padding: 8px;">${contactData.subject}</td>
              </tr>
            </table>
          </div>

          <div style="margin: 20px 0;">
            <h3 style="color: #333;">Message:</h3>
            <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #ea580c; border-radius: 5px;">
              ${contactData.message}
            </div>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666;">
            <p>Please respond to this inquiry as soon as possible.</p>
            <p style="font-size: 12px;">Time: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email notification sent successfully');
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return false;
  }
};

// Send confirmation email to customer
exports.sendCustomerConfirmation = async (contactData) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: contactData.email,
      subject: 'We received your message - Bihar Ka Swaad',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #ea580c; border-bottom: 2px solid #ea580c; padding-bottom: 10px;">
            Thank You for Contacting Us!
          </h2>
          
          <p>Dear ${contactData.name},</p>
          
          <p>We have received your inquiry and our team will get back to you within 24-48 hours.</p>

          <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #ea580c; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Your Message:</h3>
            <p><strong>Subject:</strong> ${contactData.subject}</p>
            <p>${contactData.message}</p>
          </div>

          <p>If you need immediate assistance, please call us at: <strong>+91-XXXXXXXXXX</strong></p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666;">
            <p>Best regards,<br><strong>Bihar Ka Swaad Team</strong></p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Confirmation email sent to customer');
    return true;
  } catch (error) {
    console.error('❌ Error sending confirmation email:', error);
    return false;
  }
};
