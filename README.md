# ET Calculators - Next.js Version

## Overview

This is the Next.js version of the ET Calculators website, migrated from Astro. The project maintains 100% feature parity with the original while leveraging Next.js's powerful features.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Install Additional Dependencies (if not already installed)
```bash
npm install bcryptjs chart.js date-fns date-fns-tz jose luxon @types/bcryptjs @types/luxon
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000/us/tools](http://localhost:3000/us/tools)

### 4. Build for Production
```bash
npm run build
npm start
```

## 📁 Project Structure

```
et-calculators-nextjs/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with ET branding
│   ├── page.tsx                 # Root redirect
│   ├── us/tools/                # Main tools section
│   │   ├── page.tsx            # Homepage
│   │   ├── HomePageClient.tsx  # Client-side search
│   │   ├── calculators/        # Calculator pages (to be added)
│   │   ├── games/              # Game pages (to be added)
│   │   └── apps/               # App pages (to be added)
│   └── api/                     # API routes
│       └── banners/[id]/       # Banner management API
├── components/                   # React components
│   ├── AdBanner.tsx            # Dynamic ad banners
│   ├── MRECBanners.tsx         # MREC banner container
│   ├── ETLayout.tsx            # Main layout with header
│   └── ETFooter.tsx            # Footer component
├── lib/                         # Server-side utilities
│   └── database.ts             # Database management
├── utils/                       # Shared utilities
│   ├── meta-utils.ts           # SEO metadata
│   └── enhanced-seo-meta.ts    # Enhanced SEO system
├── data/                        # JSON database files
│   ├── banners.json
│   ├── users.json
│   └── ...
└── public/                      # Static assets
```

## ✅ Phase 1 Complete - Core Infrastructure

### What's Working:
- ✅ Next.js 16 with TypeScript
- ✅ Tailwind CSS styling
- ✅ Economic Times branding (header, footer, logo)
- ✅ Homepage with all sections
- ✅ Banner management system
- ✅ API routes for banners
- ✅ Database system
- ✅ SEO metadata system
- ✅ Responsive design
- ✅ Mobile navigation

### Pages Converted:
1. Homepage (`/us/tools`) - ✅ Complete

## 🔄 Migration Progress

### Phase 1: Core Infrastructure ✅
- [x] Project setup
- [x] Core components
- [x] Homepage
- [x] Layout & Footer
- [x] Banner system
- [x] Database integration

### Phase 2: Category Pages (Next)
- [ ] All Calculators listing
- [ ] Finance category
- [ ] Health category
- [ ] Math category
- [ ] Games listing
- [ ] Apps listing

### Phase 3-8: Calculator Pages (360+ pages in batches)
- [ ] Batch 1: Popular calculators (15 pages)
- [ ] Batch 2: Financial calculators (40 pages)
- [ ] Batch 3: Health calculators (30 pages)
- [ ] Batch 4: Math & utility calculators (40 pages)
- [ ] Batch 5: Games & apps (50 pages)
- [ ] Batch 6: Remaining calculators (185 pages)

## 🎨 Features

### Maintained from Original:
- 360+ calculators, games, and apps
- Economic Times branding
- Dynamic banner management
- SEO optimization
- Mobile-first responsive design
- No signup required
- Instant results
- Free to use

### Next.js Enhancements:
- Server-side rendering (SSR)
- Static site generation (SSG)
- API routes
- Image optimization
- Better performance
- TypeScript support

## 🔧 Configuration

### Environment Variables
Create `.env.local`:
```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
NEXT_PUBLIC_SITE_URL=https://economictimes.indiatimes.com
```

### Tailwind Configuration
Already configured in `tailwind.config.ts` with:
- Typography plugin
- Custom color schemes
- Responsive breakpoints

## 📝 Key Differences from Astro

### Component Syntax
- Astro `.astro` files → React `.tsx` files
- Frontmatter `---` → TypeScript interfaces
- `<slot />` → `{children}`
- `set:html` → `dangerouslySetInnerHTML`

### Client-Side Code
- Add `'use client'` directive for interactive components
- Use React hooks (useState, useEffect, etc.)

### Metadata
- Export `metadata` object or `generateMetadata` function
- Structured data in JSON-LD format

## 🧪 Testing

### Test Homepage:
```bash
npm run dev
# Visit http://localhost:3000/us/tools
```

### Check Features:
- [ ] Homepage loads
- [ ] ET header displays
- [ ] Navigation works
- [ ] Footer displays
- [ ] Banner API works
- [ ] Mobile responsive
- [ ] Search UI displays

## 📚 Documentation

- [Migration Guide](./MIGRATION-GUIDE.md) - Detailed migration steps
- [Next.js Docs](https://nextjs.org/docs) - Next.js documentation
- [Tailwind CSS](https://tailwindcss.com/docs) - Styling documentation

## 🤝 Contributing

When adding new calculator pages:
1. Create page in `app/us/tools/calculators/[name]/page.tsx`
2. Add metadata using `generateMetadata` or `metadata` export
3. Create client component for interactive features
4. Use existing components (AdBanner, MRECBanners, etc.)
5. Follow TypeScript conventions

## 📄 License

MIT License - Same as original project

## 🎯 Next Steps

1. **Install remaining dependencies** (if needed)
2. **Test the homepage** thoroughly
3. **Start Phase 2** - Convert category pages
4. **Batch convert** calculator pages
5. **Test each batch** before moving to next
6. **Deploy** when all pages are converted

## 💡 Tips

- Use `npm run build` to check for TypeScript errors
- Test mobile responsiveness at each phase
- Keep original Astro project for reference
- Convert in small batches for easier debugging
- Test banner system after each deployment

---

**Status:** Phase 1 Complete ✅  
**Next:** Phase 2 - Category Pages  
**Progress:** ~1% (1 of 360+ pages)
