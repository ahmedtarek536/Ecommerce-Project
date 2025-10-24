# Ecommerce Project

This project is a full‑stack e‑commerce application featuring a product catalog, powerful search and filtering, shopping features (wishlist/bag), ordering workflow, and admin capabilities. It demonstrates modern frontend patterns with Next.js and a robust ASP.NET Core Web API backend with SQL Server and JWT authentication. The project includes product recommendations, analytics endpoints, and image uploads via Firebase.

## Features

- **User Authentication**
- Backend JWT auth with login/signup issuing tokens and setting an auth cookie (`auth-token-ecommerce`) via `POST /api/Customers/auth-login` and `POST /api/Customers/auth-signup` in `ecommerce-server/Controllers/Customers/CustomersController.cs`.
- Frontend NextAuth with Google provider configured at `ecommerce-client/src/app/api/auth/route.ts`.

- **Product Listings**
- Browse and view details with variants, sizes, images, and reviews.
- Advanced filtering by collections, category, subcategory, color, size, rating, and price via `GET /api/Products/SearchProducts` in `ecommerce-server/Controllers/Products/ProductsController.cs`.

- **Search & Suggestions**
- Trie‑based search for fast suggestions and token‑based partial matching (`/api/Products/Search/{query}`, `/api/Products/Suggestion/{query}`) backed by a `TrieService` that loads all product names at startup in `ecommerce-server/Program.cs`.

- **Recommendations**
- Product recommendations combining similar items, “bought together,” and user‑interaction data via `GET /api/Products/{productId}/recommendations`.

- **Orders**
- Create orders and manage status with admin‑guarded endpoints in `ecommerce-server/Controllers/Orders/OrdersController.cs`.

- **Customers & Admin**
- CRUD for customers (`ecommerce-server/Controllers/Customers/CustomersController.cs`) and role‑based authorization with `[Authorize(Roles = "...")]`.

- **Wishlist & Bag**
- Dedicated controllers exist for wishlist and bags under `ecommerce-server/Controllers/Customers/` (e.g., `WishlistController.cs`, `BagsController.cs`).

- **Analytics**
- Analytics endpoints are available in `ecommerce-server/Controllers/AnalyticsController.cs`.

- **Image Uploads**
- Firebase used for client‑side media management; config in `ecommerce-client/src/utils/firebas.ts`. Uploader UI at `ecommerce-client/src/components/MediaUploder.tsx`.

- **API Docs**
- Swagger UI enabled by default in `ecommerce-server/Program.cs`.

## Tech Stack

- **Frontend**
- Next.js 15 (App Router), TypeScript
- Tailwind CSS (`ecommerce-client/tailwind.config.ts`)
- NextAuth (Google provider)
- Zustand state management
- TipTap/Quill editors
- Chart.js via `react-chartjs-2`
- Axios

- **Backend**
- ASP.NET Core 8 Web API (`ecommerce-server/Ecommerce-Server.csproj`)
- Entity Framework Core with SQL Server (`EcommerceDbContext`)
- JWT Authentication (`JwtBearer`) with custom `JwtOptions`

- **Database**
- SQL Server (connection configured in `ecommerce-server/appsettings.json`)

- **File Uploads**
- Firebase Web SDK (`ecommerce-client/src/utils/firebas.ts`)

- **Developer Tooling**
- Swagger/OpenAPI
- ESLint, TypeScript
/`


## Quick Start

- **Backend**
```bash
cd ecommerce-server
dotnet run
```

- **Frontend**
```bash
cd ecommerce-client
npm run dev
```

## Live Demo
https://nike-two-gray.vercel.app/

