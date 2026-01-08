"""
Django Admin configuration for RoyalERP Landing Page
Provides rich admin UX with list displays, filters, search, and inlines
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import (
    LandingPageSettings, Feature, SectionBlock, UseCasePoint,
    Integration, PricingPlan, Testimonial, StatCounter, FAQ, FooterLink
)


@admin.register(LandingPageSettings)
class LandingPageSettingsAdmin(admin.ModelAdmin):
    """Admin for singleton settings"""
    
    fieldsets = (
        ('Branding', {
            'fields': ('site_name', 'logo_image', 'favicon', 'primary_color', 'secondary_color', 'accent_color')
        }),
        ('Hero Section', {
            'fields': ('hero_title', 'hero_subtitle', 'hero_image', 'hero_tagline')
        }),
        ('Call to Actions', {
            'fields': (
                'primary_cta_label', 'primary_cta_url',
                'secondary_cta_label', 'secondary_cta_url'
            )
        }),
        ('Contact Information', {
            'fields': ('contact_email', 'contact_phone', 'contact_address'),
            'description': 'Contact details shown in mobile menu and footer'
        }),
        ('Social Media Links', {
            'fields': ('social_twitter', 'social_facebook', 'social_instagram', 'social_linkedin', 'social_youtube', 'social_whatsapp'),
            'description': 'Social media profile URLs'
        }),
        ('Final CTA Section', {
            'fields': ('final_cta_title', 'final_cta_subtitle')
        }),
        ('Pricing Section', {
            'fields': ('pricing_title', 'pricing_subtitle'),
            'description': 'Customize pricing section heading'
        }),
        ('Integrations Section', {
            'fields': ('integrations_title', 'integrations_subtitle'),
            'description': 'Customize integrations section heading (under Automation)'
        }),
        ('FAQ Section', {
            'fields': ('faq_title', 'faq_subtitle'),
            'description': 'Customize FAQ section heading'
        }),
        ('Reviews Section', {
            'fields': ('reviews_title', 'reviews_subtitle'),
            'description': 'Customize testimonials/reviews section heading'
        }),
        ('SEO', {
            'fields': ('seo_title', 'seo_description', 'og_image'),
            'classes': ('collapse',)
        }),
        ('Footer', {
            'fields': ('footer_about', 'copyright_text')
        }),
    )
    
    def has_add_permission(self, request):
        # Only allow one instance
        return not LandingPageSettings.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Feature)
class FeatureAdmin(admin.ModelAdmin):
    """Admin for feature cards"""
    
    list_display = ('title', 'order', 'is_active', 'icon_preview')
    list_filter = ('is_active',)
    search_fields = ('title', 'description')
    ordering = ('order',)
    list_editable = ('order', 'is_active')
    
    def icon_preview(self, obj):
        if obj.icon:
            return format_html('<div style="width:24px;height:24px;color:#6366f1;">{}</div>', obj.icon)
        return '-'
    icon_preview.short_description = 'Icon'


@admin.register(SectionBlock)
class SectionBlockAdmin(admin.ModelAdmin):
    """Admin for split sections"""
    
    list_display = ('title', 'key', 'media_type', 'layout_type', 'background_style', 'order', 'is_active')
    list_filter = ('is_active', 'layout_type', 'background_style', 'media_type')
    search_fields = ('title', 'key', 'body')
    ordering = ('order',)
    list_editable = ('order', 'is_active')
    prepopulated_fields = {'key': ('title',)}
    
    fieldsets = (
        (None, {
            'fields': ('key', 'title', 'subtitle')
        }),
        ('Content', {
            'fields': ('body', 'bullets')
        }),
        ('Media', {
            'fields': ('media_type', 'image', 'video', 'video_poster', 'video_autoplay', 'video_loop'),
            'description': 'Choose Image or Video. For video, upload MP4/WebM file.'
        }),
        ('Layout', {
            'fields': ('layout_type', 'background_style')
        }),
        ('CTAs', {
            'fields': ('cta_label', 'cta_url', 'secondary_cta_label', 'secondary_cta_url'),
            'classes': ('collapse',)
        }),
        ('Settings', {
            'fields': ('order', 'is_active')
        }),
    )


@admin.register(UseCasePoint)
class UseCasePointAdmin(admin.ModelAdmin):
    """Admin for use case accordion"""
    
    list_display = ('title', 'order', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('title', 'body')
    ordering = ('order',)
    list_editable = ('order', 'is_active')


@admin.register(Integration)
class IntegrationAdmin(admin.ModelAdmin):
    """Admin for integration cards"""
    
    list_display = ('name', 'icon_color', 'is_featured', 'order', 'is_active', 'has_icon')
    list_filter = ('is_active', 'is_featured', 'icon_color')
    search_fields = ('name', 'description')
    ordering = ('order',)
    list_editable = ('order', 'is_active', 'is_featured')
    
    fieldsets = (
        (None, {
            'fields': ('name', 'description')
        }),
        ('Icon', {
            'fields': ('icon', 'icon_svg', 'icon_color'),
            'description': 'Upload image OR paste SVG code. Choose icon background color.'
        }),
        ('Features', {
            'fields': ('bullets',),
            'description': 'Enter one feature per line (shown as checkmarks)'
        }),
        ('Settings', {
            'fields': ('url', 'is_featured', 'order', 'is_active'),
            'description': 'Featured integrations show as large cards (WhatsApp/Database style)'
        }),
    )
    
    def has_icon(self, obj):
        return bool(obj.icon or obj.icon_svg)
    has_icon.boolean = True
    has_icon.short_description = 'Has Icon'


@admin.register(PricingPlan)
class PricingPlanAdmin(admin.ModelAdmin):
    """Admin for pricing plans"""
    
    list_display = ('name', 'price', 'period', 'is_featured', 'order', 'is_active')
    list_filter = ('is_active', 'is_featured')
    search_fields = ('name',)
    ordering = ('order',)
    list_editable = ('order', 'is_active', 'is_featured')
    
    fieldsets = (
        (None, {
            'fields': ('name', 'price', 'period')
        }),
        ('Features', {
            'fields': ('bullets',),
            'description': 'Enter one feature per line'
        }),
        ('CTA', {
            'fields': ('cta_label', 'cta_url')
        }),
        ('Settings', {
            'fields': ('is_featured', 'order', 'is_active')
        }),
    )


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    """Admin for testimonials"""
    
    list_display = ('name', 'company', 'rating_stars', 'order', 'is_active')
    list_filter = ('is_active', 'rating')
    search_fields = ('name', 'company', 'text')
    ordering = ('order',)
    list_editable = ('order', 'is_active')
    
    def rating_stars(self, obj):
        return '★' * obj.rating + '☆' * (5 - obj.rating)
    rating_stars.short_description = 'Rating'


@admin.register(StatCounter)
class StatCounterAdmin(admin.ModelAdmin):
    """Admin for stats strip"""
    
    list_display = ('label', 'value', 'order', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('label',)
    ordering = ('order',)
    list_editable = ('order', 'is_active')


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    """Admin for FAQ accordion"""
    
    list_display = ('question', 'order', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('question', 'answer')
    ordering = ('order',)
    list_editable = ('order', 'is_active')


@admin.register(FooterLink)
class FooterLinkAdmin(admin.ModelAdmin):
    """Admin for footer links"""
    
    list_display = ('label', 'column_name', 'url', 'order', 'is_active')
    list_filter = ('is_active', 'column_name')
    search_fields = ('label', 'column_name')
    ordering = ('column_name', 'order')
    list_editable = ('order', 'is_active')
