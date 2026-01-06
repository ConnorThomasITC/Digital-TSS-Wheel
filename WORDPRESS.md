# WordPress Integration Guide

Complete guide to embedding the TSS Wheel in WordPress.

## Prerequisites

- WordPress site with admin access
- TSS Wheel deployed to a public URL (e.g., Vercel)
- Ability to add HTML blocks or edit theme files

## Method 1: HTML Block Embed (Recommended)

### Step 1: Get Your Embed Code

Replace `YOUR_DEPLOYMENT_URL` with your actual Vercel URL:

```html
<div id="tss-wheel"></div>
<script src="YOUR_DEPLOYMENT_URL/embed.js" async></script>
```

**Example**:
```html
<div id="tss-wheel"></div>
<script src="https://tss-wheel.vercel.app/embed.js" async></script>
```

### Step 2: Add to WordPress Page

1. Edit a page or post in WordPress
2. Click **"+"** to add a block
3. Search for **"Custom HTML"** block
4. Paste your embed code
5. Click **"Update"** or **"Publish"**

### Step 3: Style the Container (Optional)

Wrap the embed in a container for better styling:

```html
<div style="max-width: 800px; margin: 40px auto; padding: 0 20px;">
  <div id="tss-wheel"></div>
  <script src="YOUR_DEPLOYMENT_URL/embed.js" async></script>
</div>
```

## Method 2: Iframe Embed

Use this if the JavaScript embed doesn't work with your theme/plugins:

```html
<iframe
  src="YOUR_DEPLOYMENT_URL/wheel"
  width="100%"
  height="600"
  frameborder="0"
  title="TSS Services Wheel"
  style="max-width: 800px; margin: 0 auto; display: block; border-radius: 8px;"
></iframe>
```

### Responsive Iframe

For better mobile experience:

```html
<div style="position: relative; width: 100%; max-width: 800px; margin: 0 auto;">
  <div style="padding-bottom: 100%; position: relative;">
    <iframe
      src="YOUR_DEPLOYMENT_URL/wheel"
      style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; border-radius: 8px;"
      title="TSS Services Wheel"
    ></iframe>
  </div>
</div>
```

## Method 3: Shortcode (Advanced)

### Step 1: Add to functions.php

Edit your theme's `functions.php` (preferably in a child theme):

```php
<?php
/**
 * TSS Wheel Shortcode
 * Usage: [tss_wheel] or [tss_wheel url="https://custom-url.com"]
 */
function tss_wheel_shortcode($atts) {
    $atts = shortcode_atts(array(
        'url' => 'https://tss-wheel.vercel.app', // Default URL
        'height' => '600',
    ), $atts);

    $url = esc_url($atts['url']);
    $height = esc_attr($atts['height']);

    // JavaScript embed method
    $output = '<div id="tss-wheel" style="min-height: ' . $height . 'px;"></div>';
    $output .= '<script src="' . $url . '/embed.js" async></script>';

    return $output;
}
add_shortcode('tss_wheel', 'tss_wheel_shortcode');
```

### Step 2: Use in Posts/Pages

In the WordPress editor, use:

```
[tss_wheel]
```

Or with custom URL:

```
[tss_wheel url="https://your-custom-domain.com"]
```

Or with custom height:

```
[tss_wheel height="800"]
```

### Gutenberg Block Support

For better Gutenberg integration:

```php
function tss_wheel_block() {
    ?>
    <div class="wp-block-tss-wheel">
        [tss_wheel]
    </div>
    <?php
}
```

## Method 4: Widget Area

Add to sidebar or footer:

1. Go to **Appearance > Widgets**
2. Add **"Custom HTML"** widget
3. Paste embed code:

```html
<div id="tss-wheel"></div>
<script src="YOUR_DEPLOYMENT_URL/embed.js" async></script>
```

## Method 5: Theme Template

Add directly to theme template files:

### header.php, footer.php, or custom template:

```php
<?php
// Add to your template file
?>
<div id="tss-wheel"></div>
<script src="https://tss-wheel.vercel.app/embed.js" async></script>
```

## Styling Tips

### Center and Constrain Width

```html
<div style="max-width: 900px; margin: 60px auto; padding: 0 20px;">
  <div id="tss-wheel"></div>
  <script src="YOUR_DEPLOYMENT_URL/embed.js" async></script>
</div>
```

### Add Heading

```html
<div style="max-width: 900px; margin: 60px auto; padding: 0 20px; text-align: center;">
  <h2 style="font-size: 2.5em; margin-bottom: 30px; color: #333;">Our Services</h2>
  <p style="font-size: 1.1em; color: #666; margin-bottom: 40px;">
    Click on any service to learn more about how we can help your business.
  </p>
  <div id="tss-wheel"></div>
  <script src="YOUR_DEPLOYMENT_URL/embed.js" async></script>
</div>
```

### Full Width Section

```html
<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 80px 20px;">
  <div style="max-width: 1000px; margin: 0 auto;">
    <div id="tss-wheel"></div>
    <script src="YOUR_DEPLOYMENT_URL/embed.js" async></script>
  </div>
</div>
```

## Troubleshooting

### Wheel Not Displaying

**Check 1: Verify URL**
- Open `YOUR_DEPLOYMENT_URL/wheel` directly in browser
- Should show the wheel
- If not, check Vercel deployment

**Check 2: Browser Console**
- Press F12 to open developer tools
- Check "Console" tab for errors
- Common errors:
  - `tss-wheel container not found` → Check `<div id="tss-wheel">` exists
  - `Failed to load script` → Verify embed.js URL
  - `CORS error` → Check Vercel CORS settings

**Check 3: Plugin Conflicts**
- Temporarily disable security/caching plugins
- Test if wheel displays
- Re-enable plugins one by one to find conflict

### Wheel Not Responsive on Mobile

**Solution 1: Use JavaScript Embed**
- Preferred over iframe for responsive behavior

**Solution 2: Responsive Iframe CSS**
```html
<div style="width: 100%; max-width: 800px; margin: 0 auto;">
  <div style="position: relative; padding-bottom: 100%; height: 0; overflow: hidden;">
    <iframe
      src="YOUR_DEPLOYMENT_URL/wheel"
      style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
    ></iframe>
  </div>
</div>
```

### Iframe Shows Scrollbars

Add `scrolling="no"` and increase height:

```html
<iframe
  src="YOUR_DEPLOYMENT_URL/wheel"
  width="100%"
  height="700"
  frameborder="0"
  scrolling="no"
></iframe>
```

### Modal Not Clickable in Iframe

Ensure iframe has sufficient height and no `pointer-events` CSS.

### Multiple Wheels on Same Page

Use unique container IDs:

```html
<!-- First wheel -->
<div id="tss-wheel-1"></div>

<!-- Second wheel -->
<div id="tss-wheel-2"></div>

<script>
// Modify embed.js or load twice with different targets
// Note: Current embed.js only supports one wheel per page
// For multiple wheels, use multiple iframes instead
</script>
```

**Recommended for multiple wheels**: Use iframe method:

```html
<iframe src="URL/wheel" width="100%" height="600"></iframe>
<iframe src="URL/wheel" width="100%" height="600"></iframe>
```

## Performance Optimization

### Lazy Loading

Use `loading="lazy"` for iframes:

```html
<iframe
  src="YOUR_DEPLOYMENT_URL/wheel"
  loading="lazy"
  width="100%"
  height="600"
></iframe>
```

### Async Script Loading

Already included in embed code with `async` attribute:

```html
<script src="URL/embed.js" async></script>
```

### Caching

The wheel content is static after publish. Enable caching:

1. Use WordPress caching plugin (WP Super Cache, W3 Total Cache)
2. Configure to cache pages with embedded wheel
3. Clear cache after updating wheel in admin

## Security Considerations

### Content Security Policy (CSP)

If your WordPress site has strict CSP, whitelist:

```
script-src 'self' https://tss-wheel.vercel.app;
frame-src 'self' https://tss-wheel.vercel.app;
connect-src 'self' https://tss-wheel.vercel.app;
```

Add via plugin like "Content Security Policy Manager" or in `.htaccess`.

### HTTPS

Always use HTTPS URLs:
- ✅ `https://tss-wheel.vercel.app/embed.js`
- ❌ `http://tss-wheel.vercel.app/embed.js`

Mixed content warnings will prevent loading on HTTPS sites.

## Custom Domain

### Use Your Own Domain

Instead of `tss-wheel.vercel.app`, use `services.yourdomain.com`:

1. Add custom domain in Vercel dashboard
2. Update DNS records (CNAME or A record)
3. Update embed code:

```html
<div id="tss-wheel"></div>
<script src="https://services.yourdomain.com/embed.js" async></script>
```

Benefits:
- Brand consistency
- Shorter URLs
- No "vercel.app" in source code

## Examples

### Homepage Hero Section

```html
<div style="background: linear-gradient(to bottom, #1e3a8a, #3b82f6); padding: 100px 20px; color: white;">
  <div style="max-width: 1200px; margin: 0 auto;">
    <h1 style="text-align: center; font-size: 3em; margin-bottom: 20px;">
      Comprehensive IT Services
    </h1>
    <p style="text-align: center; font-size: 1.3em; margin-bottom: 60px; opacity: 0.9;">
      Click any service to explore our expertise
    </p>
    <div id="tss-wheel"></div>
    <script src="https://tss-wheel.vercel.app/embed.js" async></script>
  </div>
</div>
```

### Services Page

```html
<div style="max-width: 1000px; margin: 80px auto; padding: 0 20px;">
  <h2 style="text-align: center; font-size: 2.5em; margin-bottom: 20px;">
    What We Offer
  </h2>
  <p style="text-align: center; font-size: 1.1em; color: #666; max-width: 600px; margin: 0 auto 60px;">
    We provide end-to-end IT solutions tailored to your business needs.
    Explore our service wheel to learn more.
  </p>
  <div id="tss-wheel"></div>
  <script src="https://tss-wheel.vercel.app/embed.js" async></script>
</div>
```

### Sidebar Widget

```html
<div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
  <h3 style="margin-top: 0; text-align: center;">Our Services</h3>
  <div id="tss-wheel"></div>
  <script src="https://tss-wheel.vercel.app/embed.js" async></script>
</div>
```

## Support

For issues specific to WordPress integration, check:

1. WordPress version compatibility (5.0+)
2. Theme compatibility (test with default theme)
3. Plugin conflicts (disable and test)
4. Browser console errors (F12)

For TSS Wheel app issues, see main [README.md](README.md).
