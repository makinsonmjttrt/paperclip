<?php
/**
 * Plugin Name:       FourPointZero Schema Markup
 * Plugin URI:        https://fourpointzero.io
 * Description:       Adds JSON-LD structured data (schema.org) to fourpointzero.io pages for SEO and AI discoverability. Implements Organization, ProfessionalService, FAQPage, and BreadcrumbList schemas.
 * Version:           1.0.0
 * Author:            FourPointZero
 * Author URI:        https://fourpointzero.io
 * License:           GPL-2.0-or-later
 * Text Domain:       fpz-schema
 */

declare(strict_types=1);

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Output JSON-LD schema in the page <head>.
 * Hooked to wp_head with priority 1 to load before other meta.
 */
function fpz_output_schema_markup(): void {
    $schemas = fpz_get_schemas_for_current_page();

    if ( empty( $schemas ) ) {
        return;
    }

    foreach ( $schemas as $schema ) {
        $encoded = wp_json_encode( $schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT );
        if ( $encoded === false ) {
            continue;
        }
        echo "\n<script type=\"application/ld+json\">\n" . $encoded . "\n</script>\n";
    }
}
add_action( 'wp_head', 'fpz_output_schema_markup', 1 );

/**
 * Returns the array of schema objects to output for the current page.
 * Each item in the returned array is output as a separate <script> block.
 *
 * @return array<int, array<string, mixed>>
 */
function fpz_get_schemas_for_current_page(): array {
    $schemas = [];

    // Organization schema — output on every page for consistent entity signalling.
    $schemas[] = fpz_organization_schema();

    if ( is_front_page() || is_home() ) {
        $schemas[] = fpz_website_schema();
        $schemas[] = fpz_professional_service_schema();
    }

    if ( is_page( 'creativai' ) ) {
        $schemas[] = fpz_faqpage_schema();
        $schemas[] = fpz_breadcrumb_schema( [
            [ 'name' => 'Home',      'url' => home_url( '/' ) ],
            [ 'name' => 'CreativAI', 'url' => home_url( '/creativai' ) ],
        ] );
    }

    if ( is_page( 'about' ) ) {
        $schemas[] = fpz_breadcrumb_schema( [
            [ 'name' => 'Home',  'url' => home_url( '/' ) ],
            [ 'name' => 'About', 'url' => home_url( '/about' ) ],
        ] );
    }

    if ( is_page( 'contact' ) ) {
        $schemas[] = fpz_breadcrumb_schema( [
            [ 'name' => 'Home',    'url' => home_url( '/' ) ],
            [ 'name' => 'Contact', 'url' => home_url( '/contact' ) ],
        ] );
    }

    if ( is_page( 'jobs' ) || is_post_type_archive( 'job_listing' ) ) {
        $schemas[] = fpz_breadcrumb_schema( [
            [ 'name' => 'Home', 'url' => home_url( '/' ) ],
            [ 'name' => 'Jobs', 'url' => home_url( '/jobs' ) ],
        ] );
    }

    return $schemas;
}

/**
 * Organization schema — identifies FourPointZero as a named entity.
 *
 * @return array<string, mixed>
 */
function fpz_organization_schema(): array {
    return [
        '@context' => 'https://schema.org',
        '@type'    => 'Organization',
        '@id'      => 'https://fourpointzero.io/#organization',
        'name'     => 'FourPointZero',
        'alternateName' => 'Four Point Zero',
        'url'      => 'https://fourpointzero.io',
        'logo'     => [
            '@type'   => 'ImageObject',
            '@id'     => 'https://fourpointzero.io/#logo',
            'url'     => 'https://fourpointzero.io/wp-content/uploads/2018/10/FourPointZero-Horizontal-Colour-400.png',
            'caption' => 'FourPointZero',
        ],
        'image' => [ '@id' => 'https://fourpointzero.io/#logo' ],
        'description' => 'FourPointZero is an executive search firm specialising in senior AI leadership roles at the intersection of artificial intelligence and creative production. Our CreativAI practice places CAIO, Head of AI Production, and Creative Technology Director roles at VFX studios, virtual production facilities, and AI-native creative companies.',
        'foundingDate' => '2019',
        'areaServed' => [
            [ '@type' => 'Country', 'name' => 'United Kingdom' ],
            [ '@type' => 'Country', 'name' => 'United States' ],
        ],
        'knowsAbout' => [
            'Executive Search',
            'AI Leadership Recruitment',
            'Creative Production Talent',
            'VFX Recruitment',
            'Chief AI Officer Hiring',
            'Creative Technology Recruitment',
        ],
        'memberOf' => [
            [ '@type' => 'Organization', 'name' => 'APSCO', 'url' => 'https://www.apsco.org' ],
            [ '@type' => 'Organization', 'name' => 'AIXR',  'url' => 'https://aixr.org' ],
            [ '@type' => 'Organization', 'name' => 'VRARA', 'url' => 'https://www.thevrara.com' ],
        ],
        'sameAs' => [
            'https://www.linkedin.com/company/xrjobs',
            'https://www.crunchbase.com/organization/fourpointzero',
        ],
        'contactPoint' => [
            '@type'           => 'ContactPoint',
            'contactType'     => 'customer enquiries',
            'areaServed'      => [ 'GB', 'US' ],
            'availableLanguage' => 'English',
        ],
    ];
}

/**
 * WebSite schema — enables sitelinks search box and anchors the site entity.
 *
 * @return array<string, mixed>
 */
function fpz_website_schema(): array {
    return [
        '@context'  => 'https://schema.org',
        '@type'     => 'WebSite',
        '@id'       => 'https://fourpointzero.io/#website',
        'url'       => 'https://fourpointzero.io',
        'name'      => 'FourPointZero',
        'description' => 'AI executive search for creative production',
        'publisher' => [ '@id' => 'https://fourpointzero.io/#organization' ],
    ];
}

/**
 * ProfessionalService schema — describes the executive search service.
 *
 * @return array<string, mixed>
 */
function fpz_professional_service_schema(): array {
    return [
        '@context'         => 'https://schema.org',
        '@type'            => [ 'ProfessionalService', 'LocalBusiness' ],
        '@id'              => 'https://fourpointzero.io/#professionalservice',
        'name'             => 'FourPointZero Executive Search',
        'alternateName'    => 'CreativAI by FourPointZero',
        'parentOrganization' => [ '@id' => 'https://fourpointzero.io/#organization' ],
        'url'              => 'https://fourpointzero.io',
        'description'      => 'Retained executive search for senior AI leadership roles in creative production. Specialist search for CAIO, Head of AI Production, Creative Technology Director, VP AI, and Head of ML Engineering in VFX and creative software companies.',
        'serviceType'      => [
            'Executive Search',
            'Retained Search',
            'AI Leadership Recruitment',
            'Creative Technology Recruitment',
        ],
        'address' => [
            '@type'         => 'PostalAddress',
            'addressCountry' => 'GB',
        ],
        'areaServed' => [
            [ '@type' => 'Country', 'name' => 'United Kingdom' ],
            [ '@type' => 'Country', 'name' => 'United States' ],
        ],
    ];
}

/**
 * FAQPage schema for the CreativAI page.
 * Questions sourced from workspace/creativai-page-copy-edited.md.
 *
 * @return array<string, mixed>
 */
function fpz_faqpage_schema(): array {
    return [
        '@context'   => 'https://schema.org',
        '@type'      => 'FAQPage',
        '@id'        => 'https://fourpointzero.io/creativai/#faqpage',
        'mainEntity' => [
            [
                '@type' => 'Question',
                'name'  => 'What is CAIO hiring and why is it specialist work?',
                'acceptedAnswer' => [
                    '@type' => 'Answer',
                    'text'  => 'CAIO appointments in creative production companies are typically first-ever senior AI leadership hires. The brief usually requires a candidate who can operate at C-suite level, translate AI capability into production reality, and build credibility with both technical and creative leadership. That profile sits at the intersection of two separate talent markets. Standard executive search methods do not reliably produce qualified shortlists for it. FourPointZero focuses exclusively on this intersection.',
                ],
            ],
            [
                '@type' => 'Question',
                'name'  => 'What is creative tech AI recruitment?',
                'acceptedAnswer' => [
                    '@type' => 'Answer',
                    'text'  => 'Creative tech AI recruitment is executive search at the intersection of creative production and AI-integrated workflows. The roles require candidates with both production pipeline experience (VFX, real-time, spatial computing, experiential) and AI/ML development credibility. Most AI search firms work the AI side without the production depth. Most creative tech recruiters work the production side without the AI leadership capability. FourPointZero covers both.',
                ],
            ],
            [
                '@type' => 'Question',
                'name'  => 'What types of roles does CreativAI place?',
                'acceptedAnswer' => [
                    '@type' => 'Answer',
                    'text'  => 'Senior permanent roles at the intersection of AI and creative production: CAIO, Head of AI Production, Creative Technology Director, VP AI, Head of ML Engineering in VFX, and Executive Producer with AI mandate. The common requirement is that candidates have shipped AI in actual production environments, not just developed AI products.',
                ],
            ],
            [
                '@type' => 'Question',
                'name'  => 'Who is the CreativAI practice for?',
                'acceptedAnswer' => [
                    '@type' => 'Answer',
                    'text'  => 'Established companies with a confirmed AI mandate at board or executive level: 50 or more employees, budget for a £150K+ senior appointment, active or imminent search underway. FourPointZero is not the right partner for organisations at the AI strategy stage with no active hiring need, or for junior or mid-level roles.',
                ],
            ],
            [
                '@type' => 'Question',
                'name'  => 'How long does a CreativAI executive search take?',
                'acceptedAnswer' => [
                    '@type' => 'Answer',
                    'text'  => 'Typically 8 to 12 weeks from signed brief to shortlist of three to five qualified candidates. That is faster than most organisations achieve through internal talent acquisition for this candidate profile, because the network is already built.',
                ],
            ],
            [
                '@type' => 'Question',
                'name'  => 'What is the CreativAI engagement model?',
                'acceptedAnswer' => [
                    '@type' => 'Answer',
                    'text'  => 'Retained search. A small engagement fee is payable on commencement, with the balance due on placement. First-time retained clients can access a structured engagement option: a fixed engagement fee with the full success fee payable only on placement.',
                ],
            ],
            [
                '@type' => 'Question',
                'name'  => 'What is the geographic coverage for CreativAI executive search?',
                'acceptedAnswer' => [
                    '@type' => 'Answer',
                    'text'  => 'UK and US coverage.',
                ],
            ],
            [
                '@type' => 'Question',
                'name'  => 'How do I know if my mandate is in scope for CreativAI?',
                'acceptedAnswer' => [
                    '@type' => 'Answer',
                    'text'  => 'A 15-minute call is enough. FourPointZero will tell you directly whether the mandate fits the scope of the CreativAI practice. No pitch, no commitment.',
                ],
            ],
        ],
    ];
}

/**
 * BreadcrumbList schema for the given page path.
 *
 * @param  array<int, array{name: string, url: string}> $items
 * @return array<string, mixed>
 */
function fpz_breadcrumb_schema( array $items ): array {
    $list_elements = [];

    foreach ( $items as $position => $item ) {
        $list_elements[] = [
            '@type'    => 'ListItem',
            'position' => $position + 1,
            'name'     => $item['name'],
            'item'     => $item['url'],
        ];
    }

    return [
        '@context'        => 'https://schema.org',
        '@type'           => 'BreadcrumbList',
        'itemListElement' => $list_elements,
    ];
}
