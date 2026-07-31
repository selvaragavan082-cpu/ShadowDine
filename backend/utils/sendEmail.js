import nodemailer from 'nodemailer';

const sendReservationEmail = async (toEmail, reservationDetails) => {
  try {
    // 1. Gmail Transporter Config
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 2. Email HTML Body Template
    const mailOptions = {
      from: `"ShadowDine Team" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: '🎉 Table Reservation Confirmed - ShadowDine',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; max-width: 500px;">
          <h2 style="color: #ff4757; text-align: center;">ShadowDine</h2>
          <h3 style="color: #2ed573;">Reservation Confirmed!</h3>
          <p>Hi <b>${reservationDetails.userName || 'Guest'}</b>,</p>
          <p>Your table reservation has been successfully booked. Here are your details:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><b>Restaurant:</b></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${reservationDetails.restaurantName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><b>Date:</b></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${reservationDetails.date}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><b>Time:</b></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${reservationDetails.time}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><b>Guests:</b></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${reservationDetails.guests} Persons</td>
            </tr>
          </table>

          <br/>
          <p>Thank you for choosing ShadowDine. Enjoy your meal! 🍽️</p>
        </div>
      `,
    };

    // 3. Email Anuppudhal
    await transporter.sendMail(mailOptions);
    console.log('📧 Reservation Email Sent Successfully to:', toEmail);
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
  }
};

export default sendReservationEmail;