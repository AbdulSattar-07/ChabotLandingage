"""
Django models for RoyalERP Chatbot Landing Page
All content is admin-driven with ordering and active toggles
"""
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.cache import cache


class SingletonModel(models.Model):
    """Base class for singleton models"""
    
    class Meta:
        abstract = True
    
    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)
        cache.delete(self.__class__.__name__)
    
    def delete(self, *args, **kwargs):
        pass  # Prevent deletion
    
    @classmethod
    def load(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj


class LandingPageSettings(SingletonModel):
    """Singleton model for global landing page settings"""
    
    # Branding
    site_name = models.CharField(max_length=100, default="RoyalERP Chatbot")
    logo_image = models.ImageField(upload_to='landing/logo/', blank=True, null=True)
    favicon = models.ImageField(upload_to='landing/favicon/', blank=True, null=True)
    
    # Colors (hex)
    primary_color = models.CharField(max_length=7, default="#1e3a5f", help_text="Deep navy/indigo")
    secondary_color = models.CharField(max_length=7, default="#6366f1", help_text="Indigo/purple")
    accent_color = models.CharField(max_length=7, default="#ec4899", help_text="Pink/lavender")
    
    # Hero Section
    hero_title = models.CharField(max_length=200, default="Run your ERP with an AI Chatbot")
    hero_subtitle = models.TextField(
        default="Automate inventory, accounts, sales insights, and reporting with intelligent AI assistance."
    )
    hero_image = models.ImageField(upload_to='landing/hero/', blank=True, null=True, help_text="Dashboard mockup")
    hero_tagline = models.CharField(
        max_length=200, 
        default="Automate your conversations and boost your marketing strategy",
        help_text="Tagline shown in mobile menu"
    )
    
    # CTAs
    primary_cta_label = models.CharField(max_length=50, default="Get Started")
    primary_cta_url = models.URLField(default="#pricing")
    secondary_cta_label = models.CharField(max_length=50, default="Book Demo")
    secondary_cta_url = models.URLField(default="#demo")
    
    # Contact Information
    contact_email = models.EmailField(default="contact@royalerp.com", blank=True)
    contact_phone = models.CharField(max_length=20, default="+1 234 567 890", blank=True)
    contact_address = models.CharField(max_length=200, default="Bowery St, New York", blank=True)
    
    # Social Media Links
    social_twitter = models.URLField(blank=True, default="", help_text="Twitter/X profile URL")
    social_facebook = models.URLField(blank=True, default="", help_text="Facebook page URL")
    social_instagram = models.URLField(blank=True, default="", help_text="Instagram profile URL")
    social_linkedin = models.URLField(blank=True, default="", help_text="LinkedIn page URL")
    social_youtube = models.URLField(blank=True, default="", help_text="YouTube channel URL")
    social_whatsapp = models.CharField(max_length=20, blank=True, default="", help_text="WhatsApp number with country code")
    
    # Final CTA Section
    final_cta_title = models.CharField(max_length=200, default="Ready to Launch?")
    final_cta_subtitle = models.TextField(
        default="Join thousands of businesses automating their ERP with AI."
    )
    
    # Pricing Section
    pricing_title = models.CharField(max_length=200, default="Simple, Transparent Pricing 💰")
    pricing_subtitle = models.CharField(max_length=300, default="Choose the plan that fits your business needs", blank=True)
    
    # Integrations Section
    integrations_title = models.CharField(max_length=200, default="Seamless Integrations 🔗")
    integrations_subtitle = models.CharField(max_length=300, default="Connect WhatsApp & Database for automated ERP responses", blank=True)
    
    # FAQ Section
    faq_title = models.CharField(max_length=200, default="Frequently Asked Questions ❓")
    faq_subtitle = models.CharField(max_length=300, default="Got questions? We've got answers.", blank=True)
    
    # Reviews/Testimonials Section
    reviews_title = models.CharField(max_length=200, default="What Our Customers Say ⭐")
    reviews_subtitle = models.CharField(max_length=300, default="Trusted by businesses worldwide", blank=True)
    
    # SEO
    seo_title = models.CharField(max_length=70, default="RoyalERP Chatbot - AI-Powered ERP Assistant")
    seo_description = models.CharField(
        max_length=160, 
        default="Automate your ERP operations with AI. Smart inventory, accounts, sales insights, and reporting."
    )
    og_image = models.ImageField(upload_to='landing/og/', blank=True, null=True)
    
    # Footer
    footer_about = models.TextField(
        default="RoyalERP Chatbot helps businesses automate their ERP operations with intelligent AI assistance.",
        blank=True
    )
    copyright_text = models.CharField(max_length=200, default="© 2024 RoyalERP. All rights reserved.")
    
    class Meta:
        verbose_name = "Landing Page Settings"
        verbose_name_plural = "Landing Page Settings"
    
    def __str__(self):
        return "Landing Page Settings"


class Feature(models.Model):
    """Feature cards for the features section"""
    
    title = models.CharField(max_length=100)
    description = models.TextField(max_length=300)
    icon = models.TextField(
        help_text="SVG code or icon class (e.g., Heroicons SVG)",
        default='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>'
    )
    image = models.ImageField(
        upload_to='landing/features/', 
        blank=True, 
        null=True,
        help_text="Feature image - will be displayed in the card with 3D effect"
    )
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['order']
        verbose_name = "Feature"
        verbose_name_plural = "Features"
    
    def __str__(self):
        return self.title


class SectionBlock(models.Model):
    """Flexible split sections (image + content)"""
    
    LAYOUT_CHOICES = [
        ('LEFT_IMAGE', 'Image on Left'),
        ('RIGHT_IMAGE', 'Image on Right'),
    ]
    
    BACKGROUND_CHOICES = [
        ('WHITE', 'White'),
        ('LIGHT', 'Light Gray/Blue'),
        ('GRADIENT', 'Gradient'),
    ]
    
    MEDIA_TYPE_CHOICES = [
        ('IMAGE', 'Image'),
        ('VIDEO', 'Video'),
    ]
    
    key = models.SlugField(max_length=50, unique=True, help_text="Unique identifier (e.g., 'automation', 'use-cases')")
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=300, blank=True)
    body = models.TextField(blank=True)
    bullets = models.TextField(blank=True, help_text="One bullet point per line")
    
    # Media - Image or Video
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPE_CHOICES, default='IMAGE', help_text="Choose Image or Video")
    image = models.ImageField(upload_to='landing/sections/', blank=True, null=True)
    video = models.FileField(upload_to='landing/videos/', blank=True, null=True, help_text="Upload MP4, WebM or OGG video")
    video_poster = models.ImageField(upload_to='landing/videos/posters/', blank=True, null=True, help_text="Thumbnail shown before video plays")
    video_autoplay = models.BooleanField(default=True, help_text="Auto-play video (muted)")
    video_loop = models.BooleanField(default=True, help_text="Loop video continuously")
    
    layout_type = models.CharField(max_length=20, choices=LAYOUT_CHOICES, default='LEFT_IMAGE')
    background_style = models.CharField(max_length=20, choices=BACKGROUND_CHOICES, default='WHITE')
    cta_label = models.CharField(max_length=50, blank=True)
    cta_url = models.URLField(blank=True)
    secondary_cta_label = models.CharField(max_length=50, blank=True)
    secondary_cta_url = models.URLField(blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['order']
        verbose_name = "Section Block"
        verbose_name_plural = "Section Blocks"
    
    def __str__(self):
        return self.title
    
    def get_bullets_list(self):
        """Return bullets as a list"""
        if not self.bullets:
            return []
        return [b.strip() for b in self.bullets.strip().split('\n') if b.strip()]


class UseCasePoint(models.Model):
    """Use case accordion items"""
    
    title = models.CharField(max_length=200)
    body = models.TextField()
    icon = models.TextField(
        blank=True,
        help_text="Optional SVG icon",
        default=''
    )
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['order']
        verbose_name = "Use Case"
        verbose_name_plural = "Use Cases"
    
    def __str__(self):
        return self.title


class Integration(models.Model):
    """Integration cards - WhatsApp, Database, etc."""
    
    CARD_COLOR_CHOICES = [
        ('green', 'Green (WhatsApp style)'),
        ('indigo', 'Indigo/Blue (Database style)'),
        ('purple', 'Purple'),
        ('pink', 'Pink'),
        ('orange', 'Orange'),
        ('gray', 'Gray'),
    ]
    
    name = models.CharField(max_length=100, help_text="e.g., WhatsApp Integration, Database Connection")
    description = models.TextField(blank=True, help_text="Short description of this integration")
    icon = models.ImageField(upload_to='landing/integrations/', blank=True, null=True)
    icon_svg = models.TextField(blank=True, help_text="SVG code for icon (recommended)")
    icon_color = models.CharField(max_length=20, choices=CARD_COLOR_CHOICES, default='indigo', help_text="Background color for icon")
    bullets = models.TextField(blank=True, help_text="Features list - one per line")
    url = models.URLField(blank=True)
    is_featured = models.BooleanField(default=False, help_text="Show as main card (WhatsApp/Database style)")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['order']
        verbose_name = "Integration"
        verbose_name_plural = "Integrations"
    
    def __str__(self):
        return self.name
    
    def get_bullets_list(self):
        """Return bullets as a list"""
        if not self.bullets:
            return []
        return [b.strip() for b in self.bullets.strip().split('\n') if b.strip()]


class PricingPlan(models.Model):
    """Pricing plan cards"""
    
    name = models.CharField(max_length=100)
    price = models.CharField(max_length=50, help_text="e.g., '$29' or 'Custom'")
    period = models.CharField(max_length=50, default="/month", blank=True)
    bullets = models.TextField(help_text="One feature per line")
    is_featured = models.BooleanField(default=False, help_text="Highlight this plan")
    cta_label = models.CharField(max_length=50, default="Get Started")
    cta_url = models.URLField(default="#")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['order']
        verbose_name = "Pricing Plan"
        verbose_name_plural = "Pricing Plans"
    
    def __str__(self):
        return self.name
    
    def get_bullets_list(self):
        """Return bullets as a list"""
        if not self.bullets:
            return []
        return [b.strip() for b in self.bullets.strip().split('\n') if b.strip()]


class Testimonial(models.Model):
    """Customer testimonials"""
    
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    company = models.CharField(max_length=100)
    avatar = models.ImageField(upload_to='landing/testimonials/', blank=True, null=True)
    rating = models.PositiveIntegerField(
        default=5,
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    text = models.TextField()
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['order']
        verbose_name = "Testimonial"
        verbose_name_plural = "Testimonials"
    
    def __str__(self):
        return f"{self.name} - {self.company}"


class StatCounter(models.Model):
    """Stats strip counters"""
    
    label = models.CharField(max_length=100)
    value = models.CharField(max_length=50, help_text="e.g., '10K+', '500+', '99%'")
    icon = models.TextField(blank=True, help_text="Optional SVG icon")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['order']
        verbose_name = "Stat Counter"
        verbose_name_plural = "Stat Counters"
    
    def __str__(self):
        return f"{self.label}: {self.value}"


class FAQ(models.Model):
    """FAQ accordion items"""
    
    question = models.CharField(max_length=300)
    answer = models.TextField()
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['order']
        verbose_name = "FAQ"
        verbose_name_plural = "FAQs"
    
    def __str__(self):
        return self.question


class FooterLink(models.Model):
    """Footer navigation links organized by column"""
    
    column_name = models.CharField(max_length=50, help_text="Column header (e.g., 'Product', 'Company')")
    label = models.CharField(max_length=100)
    url = models.CharField(max_length=500, help_text="URL or anchor link (e.g., '#features' or 'https://example.com')")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['column_name', 'order']
        verbose_name = "Footer Link"
        verbose_name_plural = "Footer Links"
    
    def __str__(self):
        return f"{self.column_name} - {self.label}"


class SectionImage(models.Model):
    """
    Images/Avatars that can be added to any section
    User can upload multiple images per section with subtitles
    """
    
    SECTION_CHOICES = [
        ('hero', 'Hero Section'),
        ('features', 'Features Section'),
        ('automation', 'Automation Section'),
        ('integrations', 'Integrations Section'),
        ('pricing', 'Pricing Section'),
        ('reviews', 'Reviews/Testimonials Section'),
        ('faq', 'FAQ Section'),
        ('stats', 'Stats Section'),
        ('footer', 'Footer Section'),
    ]
    
    IMAGE_TYPE_CHOICES = [
        ('avatar', 'Avatar/Profile'),
        ('logo', 'Logo/Brand'),
        ('screenshot', 'Screenshot'),
        ('icon', 'Icon'),
        ('banner', 'Banner'),
        ('gallery', 'Gallery Image'),
    ]
    
    section = models.CharField(max_length=50, choices=SECTION_CHOICES, help_text="Which section to display this image")
    image_type = models.CharField(max_length=20, choices=IMAGE_TYPE_CHOICES, default='avatar')
    image = models.ImageField(upload_to='landing/section_images/')
    subtitle = models.CharField(max_length=200, blank=True, help_text="One line subtitle/caption")
    alt_text = models.CharField(max_length=200, blank=True, help_text="Alt text for accessibility")
    link_url = models.URLField(blank=True, help_text="Optional link when image is clicked")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['section', 'order']
        verbose_name = "Section Image"
        verbose_name_plural = "Section Images"
    
    def __str__(self):
        return f"{self.get_section_display()} - {self.subtitle or 'Image'}"
