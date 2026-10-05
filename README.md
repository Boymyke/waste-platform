# WasteOS

A mobile-first waste pickup and recycling platform for customers, collectors, admins and super admins.

## Current foundation

- Dashboard UI based on the supplied fintech dashboard reference
- Inter typography throughout
- Responsive sidebar and mobile layouts
- Nigerian phone-number authentication
- WhatsApp OTP delivery through Meta WhatsApp Cloud API
- OTP expiry, throttling and attempt limits
- Signed HTTP-only login session
- Role model: `USER`, `COLLECTOR`, `ADMIN`, `SUPER_ADMIN`
- Admin user listing endpoint
- Super Admin-only role/status management endpoint
- Pickup, collector, customer and audit-log data models
- PostgreSQL + Prisma

## Local setup

```bash
npm install
cp .env.example .env
npm run db:push
npm run dev
```

Open `http://localhost:3000` and use `/login` for WhatsApp verification.

## WhatsApp OTP setup

Create a Meta WhatsApp Cloud API app and an approved authentication/message template whose first body variable is the six-digit code. Then configure:

```env
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_OTP_TEMPLATE=wasteos_login_code
```

In development, if WhatsApp credentials are not configured, the API returns a development OTP so the flow can still be tested. Production never exposes the code.

## Access model

- **User**: request pickups, track jobs, view payments/recycling impact.
- **Collector**: claim/receive jobs, update collection status, view earnings.
- **Admin**: operate pickups, customers, collectors and support.
- **Super Admin**: all Admin permissions plus role/access control and platform-level settings.

The next implementation phase should add the end-user pickup flow, collector app, live maps/tracking, pricing and payments, notifications, admin CRUD screens and production deployment.
