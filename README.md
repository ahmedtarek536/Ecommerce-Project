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

## Project Structure

- **`ecommerce-client/`**
- Next.js app with config in `package.json`, `next.config.ts`, `tsconfig.json`
- Auth route: `src/app/api/auth/route.ts`
- API URL config: `src/config/index.ts` (uses `process.env.REACT_APP_API_URL` with fallback `http://localhost:5000`)
- Firebase config: `src/utils/firebas.ts`
- Media uploader: `src/components/MediaUploder.tsx`

- **`ecommerce-server/`**
- Entry: `Program.cs`
- Settings: `appsettings.json`, `appsettings.Development.json`
- Controllers:
- `Controllers/Products/ProductsController.cs` (search/filter/detail/recommendations)
- `Controllers/Orders/OrdersController.cs` (CRUD, status)
- `Controllers/Customers/CustomersController.cs` (CRUD, auth)
- Additional controllers under `Controllers/` for wishlist, bags, reviews, collections, categories, variants, images, sizes, analytics, etc.
- DbContext and models under `Models/`

## Installation

- **Prerequisites**
- Node.js 18+
- .NET SDK 8+
- SQL Server (local or hosted)
- Firebase project (for image storage) if you plan to use uploads
- Google OAuth credentials (for NextAuth)

### 1) Clone the repository

```bash
git clone https://github.com/ahmedtarek536/Ecommerce-Project.git
```

### 2) Backend Setup (ASP.NET Core)

- Navigate to `ecommerce-server/`.
- Configure connection string in `ecommerce-server/appsettings.json` key `ConnectionStrings:DefaultConnection`.
- Important: The current file contains a production‑like connection string. Replace with your own secure value.
- Configure JWT options in `ecommerce-server/appsettings.json` under `JwtOptions`:
- `Issuer`, `Audience`, `Lifetime`, `SigningKey`.

- Run the API:
```bash
dotnet restore
dotnet build
dotnet run
```

- Default ports are usually `http://localhost:5000` and `https://localhost:5001`. Swagger will be available; CORS is configured to allow all, with a specific policy for `http://localhost:3000`.

### 3) Frontend Setup (Next.js)

- Navigate to `ecommerce-client/`.
- Install dependencies:
```bash
npm install
```

- Environment variables:
- `NEXTAUTH_SECRET` (random string)
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- API base URL: The client reads `API_URL` from `src/config/index.ts`, which checks `process.env.REACT_APP_API_URL`. Set it if your server isn’t on the default:
- `REACT_APP_API_URL=http://localhost:5000`
- Firebase: `src/utils/firebas.ts` currently hardcodes keys. For production, move to env vars and initialize from `process.env.*`.

- Start the dev server:
```bash
npm run dev
```

- App will run at `http://localhost:3000`.

## Usage

- **Log in / Sign up**
- Backend email/password: `POST /api/Customers/auth-login` and `POST /api/Customers/auth-signup`.
- On success, a JWT is returned and also set as a cookie `auth-token-ecommerce` by the backend, used by protected endpoints.
- Frontend Google login: NextAuth Google provider via `/api/auth` route.

- **Products**
- Search & filter: `GET /api/Products/SearchProducts` with query params: `searchQuery`, `collections`, `category`, `subCategory`, `colors`, `sizes`, `rating`, `minPrice`, `maxPrice`.
- Suggestions: `GET /api/Products/Suggestion/{query}`
- Detail: `GET /api/Products/{id}`
- Recommendations: `GET /api/Products/{productId}/recommendations`

- **Orders**
- Admin list: `GET /api/Orders`
- Get one: `GET /api/Orders/{id}`
- Create: `POST /api/Orders`
- Update status (Admin): `PATCH /api/Orders/{id}`
- Update (Admin): `PUT /api/Orders/{id}`
- Delete (Admin): `DELETE /api/Orders/{id}`

- **Customers**
- List: `GET /api/Customers`
- Get: `GET /api/Customers/{id}`
- Create: `POST /api/Customers`
- Update: `PUT /api/Customers/{id}`
- Delete: `DELETE /api/Customers/{id}`

Note: Many endpoints are role‑guarded with `[Authorize(Roles = "User,Admin")]` or `[Authorize(Roles = "Admin")]`.

## Environment Configuration

- **Backend (`ecommerce-server/appsettings.json`)**
- `ConnectionStrings:DefaultConnection`
- `JwtOptions:Issuer`, `Audience`, `Lifetime`, `SigningKey`

- **Frontend (`ecommerce-client/`)**
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `REACT_APP_API_URL` (used in `src/config/index.ts`)
- Firebase keys (currently hardcoded in `src/utils/firebas.ts`; recommended to move to env vars)

## Deployment

- **Frontend**
- Vercel is a good fit for Next.js.
- Ensure env vars are set in the hosting platform.
- If using Next.js App Router and NextAuth route handlers, configure the appropriate build settings on the platform.

- **Backend**
- Host on Azure App Service, AWS, or any Windows/Linux host that supports .NET 8.
- Set environment variables or use secure secrets for connection string and JWT options.
- Enable HTTPS and CORS to allow your frontend origin.
- Keep Swagger enabled for internal environments only.

## Security Notes

- Replace the sample connection string and JWT signing key in `ecommerce-server/appsettings.json` with secure values before making the repo public.
- Move Firebase credentials to environment variables.
- Review cookie settings (`Secure`, `SameSite`) in `CustomersController` for production.

## Future Improvements

- **Unified Auth Flow**: Harmonize NextAuth (Google) with backend JWT issuance to provide a single source of truth and role mapping.
- **RBAC Management UI**: Admin UI to manage roles and permissions.
- **Payments Integration**: Add Stripe/PayPal checkout.
- **Server‑side Image Handling**: Proxy uploads or signed URLs instead of client‑side secrets.
- **Search Enhancements**: Persist suggestions and add typo‑tolerance.
- **Caching & Performance**: Add response caching and CDN usage for media.
- **Observability**: Structured logging, metrics, and tracing across services.
- **Tests**: Unit/integration tests for controllers and critical flows.
- **CI/CD**: Automated builds, tests, deploys.

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

- **API URL**
- Default: `http://localhost:5000` configured in `ecommerce-client/src/config/index.ts`.
- Adjust `REACT_APP_API_URL` if backend runs on a different port.
