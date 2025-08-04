# Sveltia CMS Setup Guide for WebNext Website

This guide will help you set up Sveltia CMS for your WebNext website. Sveltia CMS is a modern, Git-based headless CMS that provides a user-friendly interface for content management.

## What is Sveltia CMS?

Sveltia CMS is a lightweight, open-source headless CMS built with Svelte. It's designed as a modern replacement for Netlify CMS/Decap CMS, offering:

- Git-based content management
- Framework-agnostic design
- Improved performance and user experience
- Real-time collaboration
- Internationalization support

## Prerequisites

- GitHub repository for your website
- Netlify account (for hosting and authentication)
- Your website files in a Git repository

## Setup Instructions

### Step 1: Deploy to Netlify

1. Push your website to a GitHub repository
2. Go to [Netlify](https://www.netlify.com/) and sign up/login
3. Click "New site from Git"
4. Connect your GitHub repository
5. Configure build settings (if needed)
6. Deploy your site

### Step 2: Enable Netlify Identity

1. In your Netlify site dashboard, go to "Identity"
2. Click "Enable Identity"
3. Go to "Settings and usage"
4. Under "Registration preferences", select "Invite only" or "Open"
5. Under "Git Gateway", click "Enable Git Gateway"

### Step 3: Configure Authentication

1. In Netlify Identity settings, go to "Services" > "Git Gateway"
2. Click "Enable Git Gateway"
3. This allows the CMS to commit changes to your repository

### Step 4: Access the CMS

1. Go to `https://yoursite.netlify.app/admin/`
2. You'll be prompted to create an account or login
3. Once authenticated, you can start editing content

## Editable Content Areas

The following areas of your website are configured to be editable with Sveltia CMS:

### Header Section
- **Phone Number**: The phone number displayed in the header navigation

### Hero Section
- **Main Heading**: "Web & AI Solutions" title
- **Description**: Hero section description text

### About Section
- **Section Title**: "We Build Innovative Web & AI Solutions"
- **Description**: About section description text

### Services Section
- **Section Title**: "our main services"

### Footer Section
- **Copyright Text**: Copyright notice
- **Company Description**: Company description in footer
- **Company Address**: Business address
- **Company Email**: Contact email address
- **Company Phone**: Contact phone number

### Site Settings
- **Site Title**: Main website title
- **Site Description**: Website meta description
- **Site URL**: Website URL

## How to Edit Content

1. **Access the CMS**: Go to `https://yoursite.netlify.app/admin/`
2. **Login**: Use your Netlify Identity credentials
3. **Select Content**: Choose "Pages" to edit page content or "Site Settings" for global settings
4. **Edit Content**: Click on any field to edit
5. **Save**: Click "Save" to commit changes to your repository
6. **Publish**: Changes will trigger a new build and deploy automatically

## File Structure

The CMS configuration includes:

```
/admin/
  ├── index.html          # CMS interface
  └── config.yml          # CMS configuration
/_data/
  └── settings.json       # Site settings
index.html                # Main website file
```

## Configuration Details

### Backend Configuration
- **Backend**: Git Gateway (Netlify)
- **Branch**: main
- **Media Folder**: `assets/img/uploads`
- **Public Folder**: `/assets/img/uploads`

### Content Collections
1. **Pages**: Manages content in `index.html`
2. **Settings**: Manages site-wide settings in `_data/settings.json`

## Important Notes

- All changes are committed to your Git repository
- Changes trigger automatic deployments
- Content is stored as structured data in your repository
- The CMS provides a user-friendly interface for non-technical users
- All edits are version-controlled through Git

## Adding More Editable Areas

To add more editable content:

1. Edit `/admin/config.yml`
2. Add new fields to the appropriate collection
3. Update your HTML templates to use the new fields
4. Commit changes to trigger a new deployment

Example field configuration:
```yaml
- label: "New Field"
  name: "new_field"
  widget: "string"
  default: "Default value"
  hint: "Help text for editors"
```

## Troubleshooting

- **Can't access /admin/**: Ensure Netlify Identity is enabled
- **Authentication issues**: Check Netlify Identity settings
- **Changes not appearing**: Check build logs in Netlify dashboard
- **Git Gateway errors**: Ensure Git Gateway is enabled in Netlify

## Advanced Features

- **Editorial Workflow**: Enable draft/review process
- **Media Management**: Upload and manage images
- **Real-time Preview**: See changes before publishing
- **Collaboration**: Multiple editors can work simultaneously

## Support

For technical support:
- Sveltia CMS Documentation: [https://github.com/sveltia/sveltia-cms](https://github.com/sveltia/sveltia-cms)
- Netlify Documentation: [https://docs.netlify.com/](https://docs.netlify.com/)
- GitHub Issues: Report bugs or request features

---

*This setup guide is specifically configured for the WebNext website with Sveltia CMS. All editable areas have been pre-configured in the CMS configuration.*