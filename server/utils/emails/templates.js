export const EMAIL_TEMPLATES = {
  TICKET_CREATED_ADMIN: (ticket, user) => `
<div style="font-family: Arial, sans-serif; color: #333;">
  <h2 style="color: #007BFF;">CADer Support Ticket</h2>
  <p>Dear IT Team,</p>
  <p>We need your assistance with the following issue:</p>
  <p><strong>Topic:</strong> ${ticket.feedbackType}</p>
  <p><strong>Description:</strong> ${ticket.description}</p>
  <p><strong>Raised by:</strong> ${user.name} (${user.email})</p>
  <p>Kindly look into this matter at the earliest.</p>
</div>
`,

  TICKET_CREATED_USER: (ticket) => `
<div style="font-family: Arial, sans-serif; color: #333;">
  <h2 style="color: #28A745;">CADer Ticket Confirmation</h2>
  <p>Dear ${ticket.createdBy.name},</p>
  <p>Your support ticket has been successfully created. We will resolve it as soon as possible.</p>
  <p><strong>Ticket No:</strong> ${ticket.ticketNo}</p>
  <p><strong>Description:</strong> ${ticket.description}</p>
  <p>Thank you for reaching out to us!</p>
  <p>Best Regards,</p>
  <p>CADer Support Team</p>
</div>
`,

  TICKET_RESOLVED_USER: (ticket) => `
<div style="font-family: Arial, sans-serif; color: #333;">
  <h2 style="color: #17A2B8;">CADer Ticket Resolved</h2>
  <p>Dear ${ticket.createdBy.name},</p>
  <p>Your support ticket has been resolved.</p>
  <p><strong>Ticket No:</strong> ${ticket.ticketNo}</p>
  <p><strong>Message:</strong> ${
    ticket?.followups[ticket?.followups?.length - 1]?.message
  }</p>
  <p>We hope the solution meets your expectations. If you have further issues, feel free to reopen the ticket.</p>
  <p>Best Regards,</p>
  <p>CADer Support Team</p>
</div>
`,

  CONTACT_FORM_ADMIN: (data) => `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <h2 style="color: #000;">📩 New Contact Form Submission</h2>

    <p>You have received a new inquiry from your website.</p>

    <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
      <tr>
        <td style="padding: 8px; font-weight: bold;">Full Name:</td>
        <td style="padding: 8px;">${data.name}</td>
      </tr>
      <tr>
        <td style="padding: 8px; font-weight: bold;">Email:</td>
        <td style="padding: 8px;">${data.email}</td>
      </tr>
      <tr>
        <td style="padding: 8px; font-weight: bold;">Phone:</td>
        <td style="padding: 8px;">${data.phone}</td>
      </tr>
    </table>

    <p style="margin-top: 16px;"><strong>Message:</strong></p>
    <div style="background: #f5f5f5; padding: 12px; border-radius: 6px;">
      ${data.message}
    </div>

    <p style="margin-top: 20px;">Please respond to the client as soon as possible.</p>

    <p style="font-size: 12px; color: #777;">
      This email was generated automatically from your website contact form.
    </p>
  </div>
  `,
  CONTACT_FORM_CLIENT: (data) => `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <h2 style="color: #000;">Thank you for contacting us! 🙌</h2>

    <p>Hi ${data.name},</p>

    <p>
      We’ve received your message and our team is reviewing your request.
      Someone from our team will get back to you within <strong>24–48 hours</strong>.
    </p>

    <p><strong>Your message:</strong></p>
    <div style="background: #f5f5f5; padding: 12px; border-radius: 6px;">
      ${data.message}
    </div>

    <p style="margin-top: 20px;">
      Best regards,<br/>
      <strong>CADer Support Team</strong>
    </p>

    <p style="font-size: 12px; color: #777;">
      This is an automated confirmation email. Please do not reply to this email.
    </p>
  </div>
  `,
};
