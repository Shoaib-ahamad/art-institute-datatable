# 🎨 Art Institute of Chicago - DataTable Application

[![Live Demo](https://img.shields.io/badge/demo-live-green?style=for-the-badge&logo=netlify)](https://art-institute-datatable-a.netlify.app/)
[![GitHub](https://img.shields.io/badge/github-repo-blue?style=for-the-badge&logo=github)](https://github.com/Shoaib-ahamad/art-institute-datatable)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![PrimeReact](https://img.shields.io/badge/PrimeReact-03C4E1?style=for-the-badge&logo=primereact&logoColor=white)](https://primereact.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 📋 Overview

A sophisticated React application that displays artwork data from the **Art Institute of Chicago API** with server-side pagination and persistent row selection. Built as part of a React internship assignment, this application demonstrates advanced state management, efficient data fetching patterns, and a polished user interface.

### ✨ Key Features

| Feature | Description |
|---------|-------------|
| **Server-Side Pagination** | Fetches only current page data from the API, optimizing performance |
| **Persistent Row Selection** | Selections persist when navigating between pages using intelligent ID tracking |
| **Custom Selection Panel** | Overlay panel to select first N rows with input validation |
| **No Pre-fetching** | **Critical requirement met** - Does NOT fetch other pages for selection |
| **Type Safety** | Full TypeScript implementation with strict typing |
| **Responsive Design** | Works seamlessly on desktop and mobile devices |

## 🚀 Live Demo

**Experience the application live:** [https://art-institute-datatable-a.netlify.app/](https://art-institute-datatable-a.netlify.app/)

## 📦 Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI library for building component-based interface |
| **TypeScript** | Type safety and enhanced developer experience |
| **Vite** | Fast build tool and development server |
| **PrimeReact** | Professional UI components including DataTable |
| **Tailwind CSS** | Utility-first CSS framework for styling |
| **Netlify** | Hosting and continuous deployment |

## 🏗️ Project Structure

```
art-institute-datatable/
├── src/
│   ├── components/
│   │   ├── DataTableComponent.tsx    # Main table component
│   │   └── CustomSelectionPanel.tsx   # Selection overlay panel
│   ├── hooks/
│   │   └── useArtworkSelection.ts     # Custom selection logic (CRITICAL)
│   ├── types/
│   │   └── artwork.ts                  # TypeScript interfaces
│   ├── App.tsx                         # Root component
│   ├── App.css                          # Styles
│   └── main.tsx                         # Entry point
├── public/                              # Static assets
├── index.html                           # HTML template
├── package.json                          # Dependencies
├── vite.config.ts                        # Vite configuration
├── tailwind.config.js                    # Tailwind configuration
└── README.md                             # Documentation
```

## 🎯 Features in Detail

### 1. **Data Display**
- Fetches artwork data from the Art Institute of Chicago API
- Displays all required fields:
  - `title` - Artwork title
  - `place_of_origin` - Origin location
  - `artist_display` - Artist information (formatted with line breaks)
  - `inscriptions` - Artwork inscriptions
  - `date_start` - Start date
  - `date_end` - End date

### 2. **Server-Side Pagination**
- Fetches only the current page data (10, 25, 50, or 100 items per page)
- Pagination controls with page navigation and rows per page selector
- Loading states for better user experience

### 3. **Row Selection (Critical Implementation)**
```typescript
// Intelligent selection tracking using Sets
const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
const [deselectedIds, setDeselectedIds] = useState<Set<number>>(new Set());
```
- Individual row selection with checkboxes
- Select/deselect all rows on current page
- Visual feedback with highlighted checkboxes
- **NO pre-fetching of other pages** - meets the critical requirement

### 4. **Custom Selection Panel**
- Overlay panel accessible via "Custom Selection" button
- Input field to select first N rows
- Real-time validation and feedback
- Shows available rows on current page
- **Only works with current page data** - no hidden API calls

### 5. **Persistent Selection**
- Selections persist when navigating between pages
- Returns to page 1 with previously selected rows still checked
- Uses intelligent ID tracking, not row objects (memory efficient)

## 💡 Key Technical Achievements

### ✅ **Critical Requirement: No Pre-fetching**
The custom selection logic **does NOT** fetch data from other pages. It only works with:
- Already selected rows (from any page)
- Current page rows

This is implemented in the `selectCustomRows` function:
```typescript
// Only uses current page data and existing selections
const selectCustomRows = (count: number, currentPageArtworks: Artwork[], totalRecords: number) => {
  // ... logic that NEVER fetches other pages
};
```

### ✅ **Type Safety**
- Full TypeScript implementation with strict mode
- Proper interfaces for API responses and component props
- No `any` types used

### ✅ **Performance Optimizations**
- Uses Sets for O(1) lookup of selected IDs
- Only stores IDs, not full row objects
- Memoized callbacks to prevent unnecessary re-renders

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Shoaib-ahamad/art-institute-datatable.git
cd art-institute-datatable
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

4. **Build for production**
```bash
npm run build
```

5. **Preview production build**
```bash
npm run preview
```

## 📱 Responsive Design

The application is fully responsive and works on:
- 💻 Desktop (1200px+)
- 💻 Laptop (992px+)
- 📱 Tablet (768px+)
- 📱 Mobile (576px+)

## 🧪 Testing Checklist

- [x] Data loads correctly from API
- [x] Pagination works smoothly
- [x] Individual row selection works
- [x] Select all/deselect all works
- [x] Custom selection panel validates input
- [x] Selections persist across pages
- [x] **NO pre-fetching** (verified in Network tab)
- [x] Responsive on all devices
- [x] No console errors

## 🚀 Deployment

The application is deployed on **Netlify** with continuous deployment from the GitHub repository.

**Live URL:** [https://art-institute-datatable-a.netlify.app/](https://art-institute-datatable-a.netlify.app/)

To deploy your own instance:
1. Push code to GitHub
2. Connect repository to Netlify
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

## 📊 API Reference

**Endpoint:** `https://api.artic.edu/api/v1/artworks?page={page}`

**Response Format:**
```typescript
interface ApiResponse {
  data: Artwork[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    total_pages: number;
    current_page: number;
  };
}
```

## 🤝 Contributing

This project was created as part of a React internship assignment. While it's not open for contributions, feel free to fork and experiment!

## 📄 License

This project is created for educational purposes as part of a job application process.

## 👨‍💻 Author

**Shoaib Ahamad**
- GitHub: [@Shoaib-ahamad](https://github.com/Shoaib-ahamad)
- Live Demo: [art-institute-datatable-a.netlify.app](https://art-institute-datatable-a.netlify.app/)

## 🙏 Acknowledgments

- [Art Institute of Chicago API](https://api.artic.edu/docs/) for providing the artwork data
- [PrimeReact](https://primereact.org/) for the excellent DataTable component
- [Vite](https://vitejs.dev/) for the blazing fast build tool

---

⭐ **If you found this project interesting, please consider starring the repository!**

*Submitted as part of React Internship Assignment - All requirements met including the critical "no pre-fetching" rule.*