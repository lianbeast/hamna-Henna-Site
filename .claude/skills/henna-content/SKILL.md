---
name: henna-content
description: Manage henna-site content - FAQ, portfolio, testimonials JSON files and Supabase profiles/inquiries.
argument-hint: "[faq|portfolio|testimonials|profile|inquiries] [add|edit|list|delete]"
license: MIT
metadata:
  author: claudekit
  version: "1.0.0"
---

# Henna Content Management Skill

Manage content for the henna artist portfolio site.

## Data Sources

### JSON Files (site/src/data/)
Static content loaded at build time:

| File | Structure | Purpose |
|------|-----------|---------|
| `faq.json` | Array of `{question, answer}` | FAQ accordion items |
| `portfolio.json` | Array of `{src, alt, category}` | Gallery images |
| `testimonials.json` | Array of `{name, text, rating, date}` | Client reviews |

### Supabase Tables
Dynamic content managed at runtime:

| Table | Columns | Purpose |
|-------|---------|---------|
| `profiles` | id, business_name, tagline, bio, email, phone, instagram, address, updated_at | Business settings |
| `inquiries` | id, name, email, phone, event_date, event_type, message, status, created_at | Booking form submissions |

## Commands

### FAQ Management
```bash
henna-content faq list           # List all FAQ items
henna-content faq add "Q" "A"    # Add new FAQ item
henna-content faq edit <index> "Q" "A"  # Edit FAQ by index
henna-content faq delete <index>        # Delete FAQ by index
```

### Portfolio Management
```bash
henna-content portfolio list                 # List all portfolio items
henna-content portfolio add "src" "alt" "category"  # Add portfolio item
henna-content portfolio edit <index> "src" "alt" "category"  # Edit item
henna-content portfolio delete <index>               # Delete item
```

### Testimonials Management
```bash
henna-content testimonials list           # List all testimonials
henna-content testimonials add "name" "text" 5 "2024-01-15"  # Add testimonial
henna-content testimonials edit <index> ...   # Edit testimonial
henna-content testimonials delete <index>     # Delete testimonial
```

### Profile Management (Supabase)
```bash
henna-content profile get     # Get current business profile
henna-content profile update  # Update business profile (interactive)
```

### Inquiries Management (Supabase)
```bash
henna-content inquiries list      # List all booking inquiries
henna-content inquiries status <id> <new-status>  # Update status
```

## JSON File Format Examples

### faq.json
```json
[
  {
    "question": "How long does henna last?",
    "answer": "Typically 1-2 weeks depending on skin type and care."
  }
]
```

### portfolio.json
```json
[
  {
    "src": "/images/portfolio/bridal-01.jpg",
    "alt": "Bridal henna design",
    "category": "bridal"
  }
]
```

### testimonials.json
```json
[
  {
    "name": "Sarah K.",
    "text": "Amazing artist, highly recommend!",
    "rating": 5,
    "date": "2024-01-15"
  }
]
```

## Supabase Functions (site/src/lib/supabase.ts)

```typescript
// Get business profile (SSR/build time)
getBusinessProfile()

// Submit booking inquiry (client-side)
submitInquiry(data: InquiryData)

// Admin: update profile
updateProfile(data: ProfileData)
```

## Adding Images to Portfolio

1. Place image in `site/public/images/portfolio/`
2. Reference as `/images/portfolio/filename.jpg` in portfolio.json
3. Run `pnpm build` to include in production

## Validation

All JSON files validated on build. Invalid JSON causes build failure.

Use `pnpm astro check` to validate TypeScript and content types.