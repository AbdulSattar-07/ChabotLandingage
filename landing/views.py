"""
Views for RoyalERP Landing Page
Loads all admin-driven content and passes to template
"""
from django.shortcuts import render
from django.db.models import Q
from collections import defaultdict
from .models import (
    LandingPageSettings, Feature, SectionBlock, UseCasePoint,
    Integration, PricingPlan, Testimonial, StatCounter, FAQ, FooterLink
)


def landing_page(request):
    """
    Main landing page view
    Loads singleton settings and all active ordered items
    """
    # Load singleton settings (creates default if not exists)
    settings = LandingPageSettings.load()
    
    # Load all active items, ordered
    features = Feature.objects.filter(is_active=True).order_by('order')
    
    # Load section blocks and organize by key for easy template access
    sections_qs = SectionBlock.objects.filter(is_active=True).order_by('order')
    sections = {section.key: section for section in sections_qs}
    sections_list = list(sections_qs)  # Also provide as list for iteration
    
    use_cases = UseCasePoint.objects.filter(is_active=True).order_by('order')
    integrations = Integration.objects.filter(is_active=True).order_by('order')
    plans = PricingPlan.objects.filter(is_active=True).order_by('order')
    testimonials = Testimonial.objects.filter(is_active=True).order_by('order')
    stats = StatCounter.objects.filter(is_active=True).order_by('order')
    faqs = FAQ.objects.filter(is_active=True).order_by('order')
    
    # Organize footer links by column
    footer_links_qs = FooterLink.objects.filter(is_active=True).order_by('column_name', 'order')
    footer_links = defaultdict(list)
    for link in footer_links_qs:
        footer_links[link.column_name].append(link)
    footer_links = dict(footer_links)  # Convert to regular dict for template
    
    context = {
        'settings': settings,
        'features': features,
        'sections': sections,
        'sections_list': sections_list,
        'use_cases': use_cases,
        'integrations': integrations,
        'plans': plans,
        'pricing_plans': plans,  # Alias for template compatibility
        'testimonials': testimonials,
        'reviews': testimonials,  # Alias for template compatibility
        'stats': stats,
        'faqs': faqs,
        'footer_links': footer_links,
    }
    
    return render(request, 'landing/index.html', context)
