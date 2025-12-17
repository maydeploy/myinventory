# My Inventory 📦

A minimalist retro-futuristic inventory showcase website that displays curated tech, home, workspace, essentials, and pet products. Built with Next.js 14, TypeScript, and Tailwind CSS, featuring a terminal-inspired aesthetic with beige tones, orange accents, and dithered imagery.

## ✨ Features

- **Dual Display Modes**: Toggle between card grid and terminal list views
- **Advanced Filtering**: Filter by category, brand, price range, and wishlist status
- **Real-time Search**: Search across product names, brands, and notes
- **Flexible Sorting**: Sort by date, price, or name (ascending/descending)
- **Dithered Images**: Retro-style image processing with beige/orange color scheme
- **Sticky Note Details**: Product details displayed in an animated sticky note overlay
- **Notion Integration**: Live data sync from Notion database
- **Fully Responsive**: Optimized for mobile, tablet, and desktop

## 🎨 Design System

### Colors
- **Background**: `#F5F5DC` (Beige)
- **Accent**: `#FF8C42` (Orange)
- **Text Primary**: `#2C2C2C` (Dark Gray)
- **Text Secondary**: `#6B6B6B` (Medium Gray)
- **Border**: `#D4A574` (Warm Tan)

### Typography
- **Font**: Space Mono (monospace)
- **Style**: Terminal-inspired, retro-futuristic

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Notion account with API access
- Notion database set up (see database schema below)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd myinventory
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   NOTION_API_KEY=your_notion_api_key_here
   NOTION_DATABASE_ID=2c3240181b7d81acb391000b42ff5dc4
   ```

   **Getting your Notion API Key:**
   1. Go to https://www.notion.so/my-integrations
   2. Click "New integration"
   3. Give it a name and select the workspace
   4. Copy the "Internal Integration Token"

   **Connecting the Database:**
   1. Open your Notion database
   2. Click the "..." menu in the top right
   3. Select "Connections" → "Connect to"
   4. Find and select your integration

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Notion Database Schema

Your Notion database should have the following properties:

| Property Name | Property Type | Description |
|--------------|---------------|-------------|
| Name | Title | Product name |
| Brand | Select | Brand/manufacturer |
| Category | Select | Product category (tech/home/workspace/pet/essentials/wishlist) |
| Price | Number | Product price |
| Note | Rich Text | Personal notes about the product |
| URL | URL | Link to product page |
| Image | Files & media | Product cover image |
| Date | Date | Date added (optional) |

### Supported Brands
- Apple
- Floyd
- Ikea
- Nomatiq
- Sharge
- Xiaomi
- Secret Lab
- Rayban Meta
- Anker
- Blunt
- Nigh Collective

### Categories
- **tech**: Technology products
- **home**: Home goods
- **workspace**: Office/workspace items
- **pet**: Pet products
- **essentials**: Daily essentials
- **wishlist**: Products you want (displayed with special styling)

## 🏗️ Project Structure

```
myinventory/
├── app/
│   ├── api/
│   │   └── products/
│   │       └── route.ts        # Notion API integration
│   ├── layout.tsx              # Root layout with fonts
│   ├── page.tsx                # Main page with state management
│   └── globals.css             # Global styles and utilities
├── components/
│   ├── DotGrid.tsx             # Background dot grid pattern
│   ├── Header.tsx              # Search, sort, and display controls
│   ├── FilterSidebar.tsx       # Category, brand, and price filters
│   ├── ProductCard.tsx         # Individual product card
│   ├── ProductGrid.tsx         # Grid layout for products
│   ├── ProductList.tsx         # Terminal-style list view
│   └── ProductDetail.tsx       # Sticky note overlay with details
├── types/
│   └── index.ts                # TypeScript type definitions
├── public/                     # Static assets
├── .env.example                # Environment variable template
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

## 🛠️ Built With

- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[Framer Motion](https://www.framer.com/motion/)** - Animations
- **[SWR](https://swr.vercel.app/)** - Data fetching and caching
- **[@notionhq/client](https://github.com/makenotion/notion-sdk-js)** - Notion API client

## 📝 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🎯 Key Features Explained

### Dithering Effect
Product images are processed using a canvas-based dithering algorithm that converts them to a two-tone retro style using the beige/orange color scheme. This happens client-side for each image.

### Display Modes
- **Grid Mode**: 3-column responsive grid with large product cards
- **List Mode**: Terminal-style list with ASCII-inspired borders and compact layout

### Filtering System
- **Category**: Multi-select checkboxes with color-coded indicators
- **Brand**: Multi-select from all available brands
- **Price Range**: Adjustable min/max price inputs
- **Wishlist**: Toggle to show only wishlist items

### Sticky Note Overlay
Click any product to see detailed information in an animated sticky note that slides in from the right (or bottom on mobile). Features:
- Full product details and metadata
- Personal notes section
- Direct link to product URL
- Smooth animations with rotation effect

## 🚢 Deployment

### Deploy to Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables:
   - `NOTION_API_KEY`
   - `NOTION_DATABASE_ID`
4. Deploy!

### Build for Production

```bash
npm run build
npm run start
```

## 🔧 Configuration

### Image Optimization

Images are loaded from Notion's CDN. The `next.config.js` file is configured to allow images from:
- `**.amazonaws.com`
- `prod-files-secure.s3.us-west-2.amazonaws.com`
- `s3.us-west-2.amazonaws.com`

### Data Caching

SWR is configured with:
- 5-minute revalidation interval
- No revalidation on focus/reconnect
- Stale-while-revalidate pattern

## 🎨 Customization

### Changing Colors

Edit `tailwind.config.ts` to modify the color scheme:

```typescript
colors: {
  beige: {
    DEFAULT: '#F5F5DC',
    light: '#FAFAF0',
  },
  orange: {
    DEFAULT: '#FF8C42',
    light: 'rgba(255, 140, 66, 0.2)',
  },
  // ...
}
```

### Adjusting Dither Effect

Modify the dithering algorithm in `ProductCard.tsx` and `ProductDetail.tsx` to change the threshold or color mapping.

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## ♿ Accessibility

- WCAG 2.1 AA compliant color contrast
- Keyboard navigation support
- Focus visible on interactive elements
- ARIA labels for icon buttons
- Screen reader friendly
- Semantic HTML structure

## 🐛 Troubleshooting

### Images not loading?
- Check that your Notion integration has access to the database
- Verify the image URLs are accessible
- Check the `next.config.js` remote patterns

### "Unable to load products" error?
- Verify your `NOTION_API_KEY` is correct
- Ensure the database ID matches your Notion database
- Check that the integration is connected to the database

### Dithering not working?
- This is normal for cross-origin images without CORS
- The fallback will show the original image with reduced opacity

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- Design inspiration from [Spider Defense](https://spiderdefense.framer.website/)
- Built with ❤️ for showcasing curated collections

---

**Made by May** | Powered by Notion
