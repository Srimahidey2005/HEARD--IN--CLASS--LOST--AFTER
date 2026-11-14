# P09 – Heard in Class, Lost After

A Next.js full-stack faculty–student communication platform. Students submit academic queries, the system routes each query to a faculty member based on subject mapping, faculty respond, and students can request office-hour appointments.

## Stack
- Next.js App Router + React (JavaScript)
- Tailwind CSS
- MongoDB + Mongoose
- JWT in HTTP-only cookies + bcryptjs
- Zod request validation

## Setup
1. Install Node.js 20.
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local`.
4. Set `MONGODB_URI` to your MongoDB connection string and a long random `JWT_SECRET` (optionally `FACULTY_REGISTRATION_CODE`).
5. Start MongoDB locally or use MongoDB Atlas.
6. Run `npm run dev` and open `http://localhost:3000`.

## Create the first admin
For safety, public admin registration is disabled. After starting MongoDB, create an admin once using the included script:

```bash
npx tsx scripts/create-admin.js admin@example.com 'A strong password' 'Project Admin'
```

Then sign in at `/login/admin`. The admin can create faculty accounts from Admin → Create faculty. Faculty subject names must match the subject selected by students for automatic routing.

## Separate portals and sign-in
| Portal | Sign in | Register | Who can use it |
| --- | --- | --- | --- |
| Student | `/login/student` | `/register/student` | Official `@lpu.in` emails only (checked in the form and the API). Stores name, email, registration number, course, semester, role. |
| Faculty | `/login/faculty` | `/register/faculty` | Registration is **off by default**. Set `FACULTY_REGISTRATION_CODE` in `.env.local` to allow it (the code is required). Otherwise the admin creates faculty at Admin -> Create faculty. Stores name, official email, department, assigned courses, subjects, role. |
| Admin / Triage | `/login/admin` | script only | Created with `scripts/create-admin.js`. |

`/login` and `/register` are portal choosers. Each portal's API rejects accounts of another role, so a student cannot sign in through the faculty portal (and vice versa).

## Access control (enforced on the server)
- `middleware.js`: signed-out visitors to `/student`, `/faculty` or `/admin` go to that portal's sign-in; a signed-in user opening another role's URL is sent to their own dashboard. It also rejects cross-site writes to `/api`.
- Layouts and every API route re-check the session **and role against MongoDB** (`requireUser(roles)`), so a stale or forged cookie never grants access. Faculty only receive queries and appointments assigned to them.
- Passwords are hashed with bcrypt (cost 12); sessions are signed JWTs in an HTTP-only, SameSite=Lax cookie (Secure in production); sign-in is rate limited per IP and email.
- `JWT_SECRET` (32+ characters) is required in production.

## Roles and workflow
- Query lifecycle: student submits -> saved as **Pending** -> Module 3 categorises it (keyword rules, unless the student chose a category) and routes it -> **Assigned** -> faculty responds -> **Answered** -> **Resolved**.
- Triage routing (`lib/triage.js`): faculty whose `subjects` include the subject are candidates; preference goes to faculty assigned to the student's course, then matching department, then the lightest open workload. If nobody matches, the query stays Pending until an admin assigns it (Admin dashboard -> Triage & routing) or a matching faculty account is created.
- Appointments: student requests -> **Pending** -> the assigned faculty approves, rejects or reschedules -> the student sees the new status (pages refresh every 10 seconds). Nothing is auto-approved. When faculty publish office hours, requests must fall inside them, and an approved slot cannot be double-booked.
- Faculty can also prioritise or recategorise queries and schedule a consultation (saved as an Approved appointment for that student).

## Main routes
- `/` landing page, `/login`, `/register`, `/login/{student|faculty|admin}`, `/register/{student|faculty}`
- `/student`, `/student/submit-query`, `/student/queries`, `/student/appointments`
- `/faculty`, `/faculty/queries`, `/faculty/appointments`
- `/admin`, `/admin/faculty`

## API routes
- `POST /api/auth/{student|faculty}/register`, `POST /api/auth/{student|faculty|admin}/login`, `POST /api/auth/logout`
- `GET/POST /api/queries`, `PATCH /api/queries/:id`
- `GET/POST /api/appointments`, `PATCH /api/appointments/:id` (faculty: Approved, Rejected, Rescheduled with `date`/`time`/`note`, Completed)
- `GET/PATCH /api/faculty` (PATCH = faculty office hours), `POST /api/admin/faculty`

## Testing
With the server running and an admin created:

```bash
ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD='AdminPass123!' npm run test:e2e
```

`scripts/e2e-test.mjs` registers test students, creates faculty through the admin API, then checks portal separation, direct-URL redirects, API role checks and both full workflows (query and appointment) against MongoDB.

## Important production hardening
This is a working academic project starter, not a production-audited service. Before public deployment add rate limiting, email verification/password reset, CSRF protection appropriate to your deployment, audit logs, file-upload scanning/storage, pagination, notification delivery, appointment conflict/availability validation, and automated tests. Add indexes and enforce institution-specific registration-number rules after confirming the LPU format.
