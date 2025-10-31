# CARSI Australia - Modern Landing Page

A modern, SEO/GEO optimized landing page for CARSI Australia's restoration training and certification programs.

## Features

### SEO Optimization
- **Comprehensive Meta Tags**: Title, description, keywords optimized for Australian restoration training market
- **Geo-Targeting**: Meta tags specifically targeting Australian locations
- **Schema.org Markup**: Educational organization schema for better search engine understanding
- **Open Graph Tags**: Optimized for social media sharing
- **Canonical URLs**: Proper URL canonicalization
- **Semantic HTML**: Proper heading hierarchy and semantic elements

### GEO Optimization
- **Australian Geo Tags**: Region, placename, and position metadata
- **Local Business Schema**: Educational organization schema with Australian address
- **Language Tag**: `en-AU` for Australian English
- **Australian Phone Format**: 1300 CARSI format
- **Location-Specific Content**: References to Australian cities (Sydney, Melbourne, Brisbane)

### Modern UI/UX Features
- **Responsive Design**: Mobile-first approach, works on all devices
- **Smooth Animations**: CSS animations and Intersection Observer API
- **Interactive Elements**: Hover effects, smooth scrolling, parallax effects
- **Accessibility**: WCAG 2.1 compliant with keyboard navigation
- **Performance Optimized**: Lazy loading, debounced scroll events
- **Brand Colors**: CARSI blue (#2490ed), orange (#ed9d24), yellow (#f7b500)

### Interactive Features
- **Mobile Navigation**: Hamburger menu with smooth transitions
- **Animated Statistics**: Counter animations for impact numbers
- **Form Validation**: Contact form with validation
- **Image Fallbacks**: Graceful error handling for missing images
- **Scroll Tracking**: Analytics-ready scroll depth tracking
- **CTA Tracking**: Button click tracking for analytics

## Brand Colors

The landing page uses CARSI's official brand colors:

- **Primary Blue**: `#2490ed` - Main brand color for CTAs and accents
- **Primary Orange**: `#ed9d24` - Secondary color for highlights
- **Primary Yellow**: `#f7b500` - Accent color for ratings and badges
- **Text Dark**: `#383536` - Primary text color
- **Background**: Clean whites and light grays

## File Structure

```
carsi-landing-page/
├── index.html          # Main landing page
├── css/
│   └── styles.css     # Complete stylesheet with responsive design
├── js/
│   └── main.js        # Interactive features and animations
├── assets/            # Placeholder for local images
│   ├── placeholder-hero.jpg
│   ├── fire-restoration.jpg
│   ├── water-restoration.jpg
│   └── mold-restoration.jpg
└── README.md          # This file
```

## Sections

### 1. Hero Section
- **Eye-catching headline** with gradient text effects
- **Clear value proposition** for restoration training
- **Dual CTAs**: "Start Your Journey" and "Explore Courses"
- **Trust indicators**: Statistics (5,000+ certified, 98% success rate, 24/7 access)
- **Visual hierarchy**: Professional image with floating accreditation badge

### 2. Trust Badges
- Industry Accredited
- Expert-Led Courses
- Australian Standards
- Fast-Track Certification

### 3. Courses Section
Three main training programs:
- **Fire & Smoke Restoration** (6-8 weeks)
- **Water Damage Restoration** (5-7 weeks) - Featured
- **Mold Remediation** (4-6 weeks) - New

Each course includes:
- Professional imagery
- Detailed description
- Feature list with checkmarks
- Duration indicator
- Enrollment CTA

### 4. Benefits Section
Six key benefits with icons:
- Flexible Learning
- Expert Instructors
- Accredited Certification
- Practical Resources
- Community Support
- Career Advancement

### 5. Testimonials Section
Three customer testimonials with:
- 5-star ratings
- Detailed feedback
- Student name and location (Sydney, Melbourne, Brisbane)
- Professional titles

### 6. CTA Section
- **Bold call-to-action** with gradient background
- **Dual CTAs**: "Get Started Today" and "Call 1300 CARSI"
- **Trust badge**: 30-day money-back guarantee
- **Certification mention**: Industry-recognized certification

### 7. Contact Section
- **Contact information**: Phone, email, service area
- **Contact form** with fields:
  - Full Name
  - Email Address
  - Phone Number
  - Interested Course (dropdown)
  - Message
- **Form validation** and submission handling

### 8. Footer
- **Quick Links**: Navigation to all sections
- **Course Links**: Direct links to training programs
- **Contact Information**: All contact methods
- **Legal Links**: Privacy Policy, Terms of Service
- **Copyright**: 2025 CARSI Australia

## Technologies Used

- **HTML5**: Semantic markup with SEO optimization
- **CSS3**: Modern layouts with Grid and Flexbox
- **JavaScript (ES6+)**: Interactive features and animations
- **Google Fonts**: Inter and Poppins font families
- **Intersection Observer API**: Scroll-based animations
- **No Dependencies**: Pure vanilla JavaScript, no frameworks

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **Lightweight**: No heavy frameworks or libraries
- **Fast Loading**: Optimized CSS and JavaScript
- **Lazy Loading**: Images load as needed
- **Debounced Events**: Scroll events optimized
- **Mobile-First**: Optimized for mobile performance

## SEO Keywords Targeted

- restoration training australia
- restoration courses online
- fire restoration training
- water damage certification
- mold remediation courses
- restoration professional training
- CARSI Australia
- online restoration certification

## Setup & Deployment

### Local Development

1. Clone or download this directory
2. Open `index.html` in a modern web browser
3. No build process required - pure HTML/CSS/JS

### Production Deployment

1. **Upload to web server**: Upload all files to your web hosting
2. **Update image paths**: Replace placeholder images with actual CARSI images
3. **Configure form backend**: Connect contact form to email service or CRM
4. **Add analytics**: Insert Google Analytics or tracking code
5. **SSL Certificate**: Ensure HTTPS for security and SEO
6. **Test on devices**: Verify responsive design on all devices

### Image Setup

Replace the following image URLs with actual CARSI images:

- **Logo**: `https://carsi.com.au/wp-content/uploads/carsi-logo.png`
- **Hero Image**: `https://carsi.com.au/wp-content/uploads/restoration-training.jpg`
- **Fire Restoration**: `https://carsi.com.au/wp-content/uploads/fire-restoration.jpg`
- **Water Restoration**: `https://carsi.com.au/wp-content/uploads/water-restoration.jpg`
- **Mold Restoration**: `https://carsi.com.au/wp-content/uploads/mold-restoration.jpg`
- **Favicon**: `https://carsi.com.au/wp-content/uploads/favicon.ico`
- **OG Image**: `https://carsi.com.au/wp-content/uploads/carsi-og-image.jpg`

### Analytics Integration

Add Google Analytics by inserting this in the `<head>` section:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR-GA-ID');
</script>
```

### Form Backend Integration

To make the contact form functional, you can:

1. **Email Service**: Use services like Formspree, EmailJS, or SendGrid
2. **CRM Integration**: Connect to HubSpot, Salesforce, or ActiveCampaign
3. **Custom Backend**: Build API endpoint to handle form submissions
4. **Netlify Forms**: If deploying to Netlify, add `netlify` attribute to form

## Customization

### Colors

Edit CSS variables in `styles.css`:

```css
:root {
    --primary-blue: #2490ed;
    --primary-orange: #ed9d24;
    --primary-yellow: #f7b500;
    /* ... */
}
```

### Content

All content is in `index.html` and can be easily modified:
- Headlines and copy
- Course descriptions
- Testimonials
- Contact information

### Animations

Modify animation timing in `main.js`:

```javascript
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};
```

## Accessibility

The landing page includes:
- **Semantic HTML**: Proper heading hierarchy
- **ARIA Labels**: Where appropriate
- **Keyboard Navigation**: Full keyboard support
- **Focus Indicators**: Visible focus states
- **Alt Text**: Image descriptions
- **Color Contrast**: WCAG 2.1 AA compliant

## Mobile Optimization

- **Responsive breakpoints**: 480px, 768px, 968px
- **Touch-friendly**: Large tap targets
- **Mobile menu**: Hamburger navigation
- **Optimized images**: Responsive image loading
- **Fast performance**: Minimal JavaScript

## Future Enhancements

Potential improvements:
- [ ] Add video testimonials
- [ ] Implement live chat widget
- [ ] Add course comparison table
- [ ] Create downloadable brochure
- [ ] Add FAQ accordion section
- [ ] Implement A/B testing
- [ ] Add multi-language support
- [ ] Create course preview videos
- [ ] Add student success stories page
- [ ] Implement progressive web app (PWA) features

## Credits

**Design**: Modern UI/UX inspired by leading education platforms
**Development**: Built with vanilla HTML, CSS, and JavaScript
**Brand**: CARSI Australia
**Target Market**: Australian restoration professionals

## License

This landing page is proprietary to CARSI Australia.

## Support

For questions or modifications, contact:
- **Email**: info@carsi.com.au
- **Phone**: 1300 CARSI (227 74)
- **Website**: https://carsi.com.au

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Status**: Production Ready
