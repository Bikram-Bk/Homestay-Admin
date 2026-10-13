# Homestay Nepal — Admin Dashboard

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![MIT License](https://img.shields.io/badge/MIT%20License-yellow?style=flat)

> Internal operations dashboard for managing homestay listings, bookings, and users.

The admin-facing control panel of **HomeStay Nepal**. Manage homestay inventory, moderate reviews, track booking and user activity, and curate the RAG knowledge base that powers the AI travel guide.

---

## ✨ Features

### Dashboard

- **Stats overview** — key metrics at a glance
- **Stat cards** — booking, revenue, and listing counts
- **Quick navigation** — sidebar with role-scoped sections

### Homestays

- **List and manage** — browse all homestays with status badges
- **Create** — full form with image upload and metadata
- **Edit** — update any listing field
- **Delete** — guarded behind a confirmation modal
- **Image management** — drag-and-drop upload to Cloudinary or paste any URL

### Bookings

- **Booking list** — all bookings with filterable status
- **Booking detail** — full record with user and stay information
- **Status control** — confirm, cancel, or update payment state

### Users

- **User directory** — all registered accounts
- **Role overview** — traveler vs admin distinction

### Reviews

- **Moderation** — read all reviews across listings
- **Status badges** — approved or pending at a glance

### Village Guides

- **RAG knowledge base** — curate the content the AI guide reads
- **CRUD** — create, edit, and delete village knowledge entries
- **Tagging** — category tags used for retrieval

### Platform

- **JWT admin auth** — separate token store from the traveler app
- **Auto token refresh** — silent retry on `401`
- **Reusable data table** — shared table primitive across all listings
- **Confirmation modals** — consistent guard before destructive actions

---

## 🛠️ Technologies

| Technology         | Category      | Purpose                                   |
| ------------------ | ------------- | ----------------------------------------- |
| Next.js 14         | Framework     | App Router, routing, SSR                  |
| React 18           | UI runtime    | Component model                           |
| JavaScript (ESM)   | Language      | Application logic                         |
| Tailwind CSS 3     | Styling       | Utility-first responsive styling          |
| TanStack Query 5   | Data fetching | Caching, invalidation, background refetch |
| Zustand            | State         | Admin session store                       |
| Axios              | HTTP client   | API calls with interceptors               |
| React Hook Form    | Forms         | Listing and guide forms                   |
| Zod                | Validation    | Client-side form schemas                  |
| React Hot Toast    | Notifications | Toasts                                    |
| lucide-react       | Icons         | Icon set                                  |
| cn                 | Utility       | Tailwind class merging                    |

---

## 🚀 Quick Start

### 1. Clone and install

```bash
git clone https://github.com/Bikram-Bk/HomeStay-Nepal.git
cd HomeStay-Nepal/frontend/admin
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create `.env.local` in this folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Point this at your backend. It must include the `/api` suffix.

### 4. Start the app

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

---

## 📜 Available Scripts

| Script  | Command         | Description                    |
| ------- | --------------- | ------------------------------ |
| Dev     | `npm run dev`   | Dev server on port 3001        |
| Build   | `npm run build` | Production build               |
| Start   | `npm run start` | Serve production on port 3001  |
| Lint    | `npm run lint`  | ESLint via Next.js             |

---

## 📁 Project Structure

```
src/
  app/
    login/                  admin login
    (dashboard)/            authenticated shell
      page.jsx              stats overview
      homestays/            list, new, [id]
      bookings/             list, [id]
      users/                user directory
      reviews/              moderation
      village-guides/       list, new, [id]
    providers.jsx           root providers
  components/
    providers/              QueryProvider
    shared/
      Sidebar.jsx           primary navigation
      DataTable.jsx         reusable list primitive
      StatCard.jsx          metric tile
      StatusBadge.jsx       status pill
      PageHeader.jsx        page title block
      ConfirmModal.jsx      destructive-action guard
      ImageUploader.jsx     drag-drop + URL upload
  features/
    auth/                   admin API
    booking/                booking API
    homestay/               homestay API
    review/                 review API
    stats/                  stats API
    user/                   user API
    village-guide/          village guide API
  hooks/
    useAdminAuth, useBookings, useHomestays,
    useReviews, useStats, useUsers, useVillageGuides
  lib/
    api.js                  HTTP client + JWT interceptors
    queryClient.js          TanStack Query config
    toast.js                toast helpers
  store/
    adminStore.js           Zustand admin state
```

---

## 🧠 Key Concepts

### Feature-first organization

Code is grouped by domain under `features/`, not by technical type. Each domain owns its API layer in a single `api.js`, so a feature's data contract lives in one readable place.

### Path alias

`@/` maps to `src/` via `jsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

So imports read `@/components/shared/DataTable` instead of long relative paths.

### Shared primitives

`components/shared/` holds the building blocks reused across every section — `DataTable`, `StatCard`, `StatusBadge`, `ConfirmModal`. Adding a new section means composing these, not rebuilding list and modal markup.

### Separate auth store

This app is fully independent of the traveler frontend. It keeps its own `adminStore` and its own token key, so the two apps can be deployed to different domains and authenticated separately.

### RAG knowledge base

Village guides are the source material the AI chat guide retrieves from. Editing content here directly changes what the assistant can answer — this section is content management, not just data entry.

---

## 🚢 Deployment

### Vercel

1. Import the repo into Vercel
2. Set **Root Directory** to `frontend/admin`
3. Add the environment variable:

   ```
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
   ```

4. Deploy

No `vercel.json` needed — Next.js is detected automatically.

> Deploy this separately from the traveler app. Both use the same `NEXT_PUBLIC_API_URL` variable name, so deploying them as two Vercel projects keeps their environments from colliding.

---

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://zustand.docs.pmnd.rs)
- [React Hook Form](https://react-hook-form.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Cloudinary](https://cloudinary.com/documentation)

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request with a clear description of your changes. If you add a UI feature or behavior change, include screenshots when possible.

---

## 🆘 Support

- **GitHub Issues**: https://github.com/Bikram-Bk
- **Email**: bikrambk2244@gmail.com

---

## 📄 License

This project is licensed under the MIT license.

---

Made with ❤️ by Bikram Luhar