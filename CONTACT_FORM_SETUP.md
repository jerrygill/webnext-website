# 📧 Contact Form Setup Guide

## 🎯 Overview

This contact form system provides a complete solution for handling contact form submissions with:

- ✅ **Modern JavaScript validation**
- ✅ **Netlify Forms integration**
- ✅ **Spam protection with honeypot**
- ✅ **CMS-editable settings**
- ✅ **Automatic form submission storage**
- ✅ **Email notifications**
- ✅ **Auto-reply functionality**
- ✅ **Mobile-responsive design**

## 🚀 Features

### Frontend Features
- Real-time form validation
- Beautiful success/error messages
- Loading states during submission
- Accessible form design
- Mobile-optimized interface

### Backend Features
- Secure form processing
- Spam protection
- JSON storage of submissions
- Email notifications
- Auto-reply emails
- IP tracking for security

### CMS Features
- Edit contact information
- Customize form messages
- Manage service options
- Update business hours
- Configure social media links
- View form submissions

## 📁 File Structure

```
├── contact.html                    # Contact page with form
├── _data/
│   ├── contact.json                # Contact settings & info
│   └── submissions/                # Form submissions storage
├── assets/js/
│   └── contact-form.js             # Form handling JavaScript
├── netlify/
│   └── functions/
│       └── contact-form.js         # Server-side form processor
├── admin/
│   └── config.yml                  # CMS configuration
└── netlify.toml                    # Netlify configuration
```

## ⚙️ Setup Instructions

### 1. Deploy to Netlify

1. **Connect your repository** to Netlify
2. **Set build settings**:
   - Build command: (leave empty)
   - Publish directory: `.`
3. **Deploy the site**

### 2. Configure Contact Settings

1. **Access the CMS**: Go to `yoursite.netlify.app/admin`
2. **Navigate to "Contact Settings"**
3. **Update contact information**:
   - Phone numbers
   - Email addresses
   - Physical address
   - Google Maps embed URL

### 3. Customize Form Settings

1. **In the CMS, edit "Contact Settings"**
2. **Configure form options**:
   - Form title and subtitle
   - Success/error messages
   - Service dropdown options
   - Notification email address
   - Enable/disable auto-reply

### 4. Set Up Email Notifications (Optional)

To receive email notifications when forms are submitted:

1. **Choose an email service**:
   - SendGrid (recommended)
   - Mailgun
   - AWS SES
   - Postmark

2. **Add environment variables** in Netlify:
   ```
   SENDGRID_API_KEY=your_api_key
   NOTIFICATION_EMAIL=admin@yourcompany.com
   ```

3. **Update the Netlify function** to use your email service

## 🎨 Customization

### Styling the Form

The form uses your existing CSS classes. To customize:

1. **Edit `assets/css/main.css`**
2. **Target these classes**:
   ```css
   .form-clt input,
   .form-clt textarea {
       /* Your input styles */
   }
   
   .form-message.success {
       /* Success message styles */
   }
   
   .form-message.error {
       /* Error message styles */
   }
   ```

### Adding Form Fields

1. **Update `contact.html`**:
   ```html
   <div class="col-lg-12">
       <div class="form-clt">
           <input type="text" name="company" placeholder="Company Name">
       </div>
   </div>
   ```

2. **Update the Netlify function** to handle the new field
3. **Update CMS config** to include the field in submissions

### Customizing Service Options

1. **Go to CMS → Contact Settings**
2. **Edit "Service Options"**
3. **Add/remove/modify options**
4. **Save changes**

## 📊 Managing Submissions

### Viewing Submissions

1. **Access CMS**: `yoursite.netlify.app/admin`
2. **Go to "Contact Form Submissions"**
3. **View all submissions** with details:
   - Name and email
   - Service requested
   - Message content
   - Submission date
   - IP address
   - Status (New/Read/Replied/Archived)

### Organizing Submissions

- **Mark as Read**: Update status when reviewed
- **Mark as Replied**: Track responses
- **Archive**: Move old submissions to archive status

## 🔒 Security Features

### Spam Protection
- **Honeypot field**: Hidden field to catch bots
- **Server-side validation**: All data validated on server
- **Rate limiting**: Prevents spam submissions
- **IP tracking**: Monitor submission sources

### Data Protection
- **Input sanitization**: All inputs cleaned
- **XSS prevention**: Content properly escaped
- **CSRF protection**: Form tokens validated
- **Secure headers**: Security headers configured

## 🐛 Troubleshooting

### Form Not Submitting

1. **Check browser console** for JavaScript errors
2. **Verify Netlify deployment** is successful
3. **Check form attributes**:
   ```html
   <form name="contact" data-netlify="true">
   ```

### Submissions Not Saving

1. **Check Netlify function logs**
2. **Verify `_data/submissions` directory** exists
3. **Check file permissions**

### Email Notifications Not Working

1. **Verify email service configuration**
2. **Check environment variables**
3. **Review function logs** for errors
4. **Test email service** separately

### CMS Not Showing Contact Settings

1. **Check `admin/config.yml`** for contact_settings section
2. **Verify `_data/contact.json`** exists
3. **Redeploy the site**

## 📱 Mobile Optimization

The form is fully responsive and includes:

- **Touch-friendly inputs**: Proper sizing for mobile
- **Optimized keyboard**: Email/phone keyboards on mobile
- **Accessible labels**: Screen reader friendly
- **Fast loading**: Optimized JavaScript

## 🔧 Advanced Configuration

### Custom Validation Rules

Add custom validation in `contact-form.js`:

```javascript
validateField(field) {
    // Add custom validation logic
    if (field.name === 'phone') {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(field.value)) {
            this.showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    // ... existing validation
}
```

### Custom Success Actions

Add custom actions after successful submission:

```javascript
if (response.ok) {
    this.showMessage('Thank you!', 'success');
    
    // Custom actions
    gtag('event', 'form_submit', {
        event_category: 'contact',
        event_label: 'contact_form'
    });
    
    // Redirect after delay
    setTimeout(() => {
        window.location.href = '/thank-you.html';
    }, 2000);
}
```

## 📈 Analytics Integration

Track form submissions with Google Analytics:

```javascript
// Add to successful submission handler
gtag('event', 'contact_form_submit', {
    event_category: 'engagement',
    event_label: 'contact_form',
    value: 1
});
```

## 🎉 Success!

Your contact form is now fully configured with:

- ✅ Working form submission
- ✅ CMS-editable settings
- ✅ Spam protection
- ✅ Email notifications
- ✅ Mobile optimization
- ✅ Analytics tracking

**Need help?** Check the troubleshooting section or review the code comments for detailed explanations.

---

*Last updated: $(date)*