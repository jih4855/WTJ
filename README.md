# Welcome to Jinju - Jekyll Blog

A multilingual Jekyll blog about Jinju and Gyeongnam region of Korea, styled after Woowahan Brothers tech blog.

## 🌍 Languages

- **English (Public)**: `/en/` - Main target language
- **Japanese (Public)**: `/ja/` - For Japanese visitors

## 🚀 Getting Started

### Prerequisites

- Ruby 3.0 or higher
- Jekyll
- Bundler

### Installation

```bash
# Install dependencies
bundle install

# Serve the site locally
bundle exec jekyll serve

# Access the site at http://localhost:4000/en/
```

## 📁 Project Structure

```
blog/
├── _config.yml                    # Jekyll configuration
├── Gemfile                        # Ruby dependencies
├── _layouts/                      # Layout templates
│   ├── default.html              # Base layout
│   └── post.html                 # Post layout
├── _includes/                     # Reusable components
│   ├── head.html                 # GTM code included
│   ├── header.html               # Navigation
│   └── footer.html               # Footer
├── _posts/                        # Markdown posts
│   ├── en/                       # English posts (public)
│   └── ja/                       # Japanese posts (public)
├── assets/                        # Static files
│   ├── css/main.scss             # SCSS stylesheet
│   └── js/main.js               # JavaScript
├── en/                           # English pages
├── ja/                           # Japanese pages
└── .gitignore                    # Git ignore file
```

## 📝 Writing Posts

### Create a new post

```bash
# Create English post
touch _posts/en/2025-07-29-new-post.md

# Create Japanese post
touch _posts/ja/2025-07-29-new-post.md
```

### Post Front Matter

```yaml
---
layout: post
title: "Post Title"
date: 2025-07-29 10:00:00 +0900
categories: en
lang: en
ref: new-post  # For linking between languages
---

Your content in Markdown...
```

## 🎨 Style Guide

The blog uses a design inspired by Woowahan Brothers with:
- Primary color: #2563eb
- Clean, minimal design
- Responsive layout
- Mobile-first approach

## 📊 SEO Features

- Google Tag Manager integration (GTM-PV39J3NR)
- Meta tags and Open Graph support
- Language-specific hreflang tags
- Automatic sitemap generation
- RSS feed support

## 🚀 Deployment

This blog is designed for GitHub Pages deployment:

1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Set source to "Deploy from a branch" → "main" → "/ (root)"
4. GitHub Pages will automatically build and deploy Jekyll

### Access URLs after deployment:
- English: `https://username.github.io/repository-name/en/`
- Japanese: `https://username.github.io/repository-name/ja/`

## 📞 Support

For questions or suggestions, please create an issue in the repository.

---

**Happy Blogging! 🇰🇷✈️**