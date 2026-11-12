# MotoCare 🛵 – Two-Wheeler Service Booking & Maintenance History Tracker

> **Premium Automotive SaaS Web Application for Two-Wheeler Dealership Networks in Delhi NCR, India.**

Built with **React.js, Vite, Tailwind CSS, React Router DOM, Context API, React Hook Form, Yup, Recharts, and Lucide Icons**. Features complete PWA offline support and mock REST API persistence via JSON Server with zero-fail fallback architecture.

---

## 🌟 Key Highlights & Features

- **Delhi NCR Regional Specialization**: Pre-seeded with 6 authorized multi-brand service hubs across Central Delhi (Connaught Place), South Delhi (South Extension), South-East (Okhla Industrial Area), West Delhi (Dwarka), Gurugram (Sector 29 CyberBay), and Noida (Sector 62).
- **Indian Vehicle Plate Validation**: Native validation for Indian registration numbers (`DL 03 CB 4192`, `HR 26 EW 7014`, `UP 16 CG 3311`) adhering to MoRTH format guidelines.
- **Dynamic Multi-Step Booking Wizard**: 4-step interactive flow with progress bar, vehicle garage selector, optional high-value add-ons, slot allocation, doorstep transit calculation, 18% GST invoice breakdown, and unique booking ID generator (`MC-DEL-YYYY-XXXX`).
- **Real-Time Dealership Command Center (Admin)**: Complete operations dashboard with Recharts analytics (revenue by hub, pipeline status pie chart), booking status management with audit notes, customer directory, and package price catalog editor.
- **Digital History & Printable Receipts**: Complete paperless service records with printable invoices, warranty badges, and cancellation management.
- **Dual-Layer Mock API Architecture**: Operates with JSON Server on port 5001 or automatically falls back to an intelligent localStorage mock database with realistic latency. Works 100% offline and on static deployment platforms like Vercel with zero broken states.
- **Progressive Web App (PWA)**: Offline caching, service worker lifecycle, manifest metadata, installable on mobile and desktop.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework & Build** | React 18, Vite 5 |
| **Styling & Design** | Tailwind CSS 3, PostCSS, Custom Automotive Navy & Blue Palette |
| **Routing** | React Router DOM v6 with route lazy-loading & Suspense |
| **State Management** | React Context API (`AuthContext`, `BookingContext`, `ToastContext`) |
| **Forms & Validation**| React Hook Form, Yup validation schemas |
| **Data Visualizations** | Recharts (ResponsiveContainer, BarChart, PieChart, Tooltip, Legend) |
| **Icons** | Lucide React (no emojis used for professional SaaS aesthetic) |
| **Mock REST API** | JSON Server (`db.json`) + Persistent LocalStorage Fallback Adapter |
| **Testing** | Vitest, React Testing Library, Jest-DOM (20/20 unit & integration tests) |
| **PWA & Offline** | `vite-plugin-pwa`, Workbox Service Worker, Web Manifest |

---

## 📱 The Six Main Screens

### 1. Home Dashboard (`/`)
- Personalized customer welcome greeting with user switcher.
- Registered two-wheelers summary with mileage, model, and last service date.
- Prominent upcoming service reminder alert card with status badges.
- Last service record snapshot with invoice amount and workshop details.
- Quick action shortcuts: "Book Bay Service", "View Service History", "Manage Garage".
- Network statistics: active rides, verified jobs, bay queue status, and warranty health.
- Featured popular service packages carousel with direct "Book" action.

### 2. Service Catalog (`/services`)
- Full catalog of two-wheeler periodic maintenance and repair packages:
  - *Comprehensive General Service* (32-point inspection)
  - *Express Quick Service & Lube* (45-minute rapid bay)
  - *Engine Performance & Carburetor/EFI Tuning* (OBD diagnostics)
  - *EV High-Voltage & Battery Health Care* (Ather, Ola, Chetak)
  - *Monsoon & Winter Weather Armor Package* (Delhi smog & moisture barrier)
  - *Brake Overhaul & Suspension Reconditioning*
- Real-time debounced search by service title, symptoms, or vehicle model.
- Category filters, price budget filters (Under ₹1,000, ₹1,000–₹2,000, Above ₹2,000).
- Sort options: Popularity & Rating, Price Low to High, Price High to Low, Quickest First.
- Responsive pagination controls.
- Missing image placeholders with stylish automotive SVG illustrations.
- Empty states with one-click filter reset.

### 3. Service Package Details (`/services/:id`)
- Deep-dive specification page for each package.
- 8-point itemized checklist of included services (oil flush, spark plug gap, brake tune, chain lube).
- Estimated duration, warranty period, and recommended maintenance interval.
- Transparent pricing breakdown with labor & fluid inclusions.
- Customer reviews section with star ratings, verified dealer buyer badges, and rider comments.
- Directory of 6 Delhi NCR workshop bays offering this service with operating hours and phone contacts.
- Direct "Book This Package" CTA pre-loading package into the multi-step booking process.

### 4. Multi-Step Booking Form (`/booking`)
- **Step 1: Select Vehicle**: Pick from registered garage two-wheelers or enter a new bike/scooter with instant plate validation.
- **Step 2: Select Service & Value Add-ons**: Choose package and check optional add-ons (Synthetic Oil Upgrade +₹450, Doorstep Transit +₹299, Ceramic Hydrophobic Nano-Shield +₹699, Nitrogen Fill +₹149). Dynamic subtotal updates in real time.
- **Step 3: Appointment Slot & Bay**: Pick from 6 Delhi NCR service centres, select calendar date (within 30 days), and choose morning or afternoon time slot.
- **Step 4: Confirmation & Summary**: Customer contact details, doorstep pickup toggle with street address, special symptom notes, 18% GST tax breakdown, and total calculation.
- **Confirmation Screen**: Generates unique booking ID (`MC-DEL-2024-XXXX`), printable receipt view, print/save dialogue, and redirection options.

### 5. User Profile & Garage Tracker (`/profile`)
- Rider profile info, contact numbers, email, and Delhi NCR residential address.
- Edit profile modal with Yup validation.
- Garage management: add new vehicles or remove old rides.
- Active appointment cards with status indicators.
- Booking cancellation modal with mandatory cancellation reason tracking.
- Past service history records with printable official service receipt modal.

### 6. Dealership Admin Hub (`/admin`)
- Operations KPI cards: Total Bookings, Pending Bays, Active in Bay, Completed, Network Revenue (₹).
- Recharts Revenue Distribution by Delhi NCR Workshop Hub.
- Recharts Booking Status Allocation Pie Chart.
- Bookings management table with keyword search and status filter (`Pending`, `Confirmed`, `In Service`, `Ready for Delivery`, `Completed`, `Cancelled`).
- Booking status update modal with service advisor note logging.
- Customer directory tab.
- Service package catalog editor (adjust pricing and toggle popular flags).
- Delhi NCR workshop bay capacity directory.
- Responsive mobile sidebar drawer.

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation
```bash
git clone https://github.com/your-username/motocare.git
cd motocare
npm install
```

### Running the Application (Frontend + Mock REST Server)
To run both JSON Server (port 5001) and Vite dev server concurrently:
```bash
npm start
```

Or run them individually in separate terminal sessions:
```bash
# Terminal 1: Mock REST API
npm run server

# Terminal 2: Vite React Frontend
npm run dev
```

Visit the application in your browser at `http://localhost:5173`.

---

## 🧪 Running Tests

The application includes a comprehensive test suite written with **Vitest + React Testing Library**:

```bash
# Run all 20 tests once
npm test

# Run tests in watch mode
npm run test:watch
```

### Test Coverage Highlights:
- **`components.test.jsx`**: Verifies rendering of cards, status badges, empty states, error states, modals, and missing image placeholders.
- **`bookingValidation.test.jsx`**: Tests Indian registration plate regex (`DL 03 CB 4192`), phone number formats, 18% GST calculation, and unique booking ID generator.
- **`serviceListing.test.jsx`**: Tests search bar debouncing, category filters, and empty state reset triggers.
- **`bookingFlow.test.jsx`**: Validates the 4-step multi-step booking process from vehicle selection to slot scheduling.
- **`navigation.test.jsx`**: Validates client-side routing across all 6 main screens and the 404 fallback page.

---

## 🌐 Deployment to Vercel

MotoCare is built to deploy seamlessly to Vercel:

1. Push your repository to GitHub / GitLab.
2. In the Vercel Dashboard, click **Add New Project** and select your repository.
3. Configure the build settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Set Environment Variables:
   - `VITE_ENABLE_MOCK_FALLBACK`: `true`
5. Click **Deploy**.

> **Note on Static Hosting**: Because `VITE_ENABLE_MOCK_FALLBACK` is enabled, the app automatically switches to the persistent in-browser localStorage database when deployed without a dedicated Node.js backend. All creating, editing, updating status, and cancelling bookings persist seamlessly across page reloads!

---

## ⚡ Accessibility & Lighthouse Optimizations

- **Semantic HTML**: Proper `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`, `<section>`, and `<dialog>` tags.
- **WCAG 2.1 Contrast**: High-contrast text using slate-900 / navy-900 against slate-50 backgrounds.
- **Visible Focus States**: Explicit `:focus-visible` ring indicators on all interactive inputs and buttons.
- **Lazy Loading**: All routes are code-split via `React.lazy` and `Suspense` for sub-second Initial Server Response and Minimal First Contentful Paint (FCP).
- **Graceful Fallbacks**: Every image tag includes fallback placeholders to eliminate layout shifts (CLS = 0).

---

## 📄 License

MIT License. Designed and engineered for Delhi NCR two-wheeler riders and dealership networks.
