const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse form data
    const formData = new URLSearchParams(event.body);
    const submission = {
      name: formData.get('name'),
      email: formData.get('email'),
      service: formData.get('service') || 'General Inquiry',
      message: formData.get('message'),
      date: new Date().toISOString(),
      ip: event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || 'unknown',
      status: 'New',
      user_agent: event.headers['user-agent'] || 'unknown'
    };

    // Validate required fields
    if (!submission.name || !submission.email || !submission.message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Missing required fields',
          details: 'Name, email, and message are required'
        })
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(submission.email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Invalid email format'
        })
      };
    }

    // Check for honeypot (spam protection)
    const honeypot = formData.get('bot-field');
    if (honeypot) {
      // Silent rejection for spam
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          success: true,
          message: 'Thank you for your message!'
        })
      };
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${timestamp}-${submission.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    
    // Create submissions directory if it doesn't exist
    const submissionsDir = path.join(process.cwd(), '_data', 'submissions');
    
    try {
      await fs.access(submissionsDir);
    } catch {
      await fs.mkdir(submissionsDir, { recursive: true });
    }

    // Save submission to file
    const filePath = path.join(submissionsDir, filename);
    await fs.writeFile(filePath, JSON.stringify(submission, null, 2));

    // Send notification email (if configured)
    await sendNotificationEmail(submission);

    // Send auto-reply email (if configured)
    if (submission.email) {
      await sendAutoReply(submission);
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        success: true,
        message: 'Thank you for your message! We\'ll get back to you soon.',
        submissionId: filename.replace('.json', '')
      })
    };

  } catch (error) {
    console.error('Contact form error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: 'Sorry, there was an error processing your message. Please try again.'
      })
    };
  }
};

// Function to send notification email to admin
async function sendNotificationEmail(submission) {
  try {
    // Load contact settings
    const settingsPath = path.join(process.cwd(), '_data', 'contact.json');
    let settings = {};
    
    try {
      const settingsData = await fs.readFile(settingsPath, 'utf8');
      settings = JSON.parse(settingsData);
    } catch {
      // Use default settings if file doesn't exist
      settings = {
        form_settings: {
          notification_email: 'admin@yourcompany.com',
          auto_reply: true
        }
      };
    }

    const notificationEmail = settings.form_settings?.notification_email;
    
    if (!notificationEmail || notificationEmail === 'admin@yourcompany.com') {
      console.log('No notification email configured');
      return;
    }

    // Here you would integrate with your email service (SendGrid, Mailgun, etc.)
    // For now, we'll just log the notification
    console.log('New contact form submission:', {
      to: notificationEmail,
      subject: `New Contact Form Submission from ${submission.name}`,
      from: submission.email,
      message: submission.message,
      service: submission.service
    });

  } catch (error) {
    console.error('Error sending notification email:', error);
  }
}

// Function to send auto-reply email
async function sendAutoReply(submission) {
  try {
    // Load contact settings
    const settingsPath = path.join(process.cwd(), '_data', 'contact.json');
    let settings = {};
    
    try {
      const settingsData = await fs.readFile(settingsPath, 'utf8');
      settings = JSON.parse(settingsData);
    } catch {
      return; // No auto-reply if settings can't be loaded
    }

    if (!settings.form_settings?.auto_reply) {
      return; // Auto-reply disabled
    }

    // Here you would integrate with your email service
    // For now, we'll just log the auto-reply
    console.log('Auto-reply email:', {
      to: submission.email,
      subject: 'Thank you for contacting us!',
      message: `Dear ${submission.name},\n\nThank you for your message. We have received your inquiry and will get back to you within 24 hours.\n\nBest regards,\nThe Team`
    });

  } catch (error) {
    console.error('Error sending auto-reply email:', error);
  }
}