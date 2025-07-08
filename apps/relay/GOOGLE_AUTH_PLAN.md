# Google OAuth Protection Plan for Relay

This document outlines the complete strategy for protecting the Relay app with Google authentication restricted to **@knock.app** email addresses.  Each section includes a TODO checklist you can tick off while implementing.

---

## 1&nbsp;&nbsp;Google Cloud Console preparation

Tasks:
- [ ] Create or select a Google Cloud project.
- [ ] Enable **OAuth 2.0 Client ID** in *APIs & Services → Credentials*.
- [ ] Add authorised JavaScript origins (dev & prod).
- [ ] Add authorised redirect URI: `https://<host>/api/auth/google/callback` (plus localhost for dev).
- [ ] Store **Client ID** and **Client Secret** in 1Password.
- [x] Expose them to the app as `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.

---

## 2&nbsp;&nbsp;Session strategy (no database)

We rely solely on signed JWTs:
1. Verify Google **ID token** once.
2. Issue our own **session JWT** (HS256) containing `{ sub, email, exp }`.
3. Send it back as `relay_session` (cookie + localStorage).

Tasks:
- [x] Choose a strong `JWT_SECRET` and add to environment.
- [x] Decide expiration (e.g. 8 h or 24 h).

---

## 3&nbsp;&nbsp;Folder & file map

```
apps/relay/
└─ src/
   ├─ pages/
   │   ├─ login.tsx
   │   ├─ _middleware.ts
   │   └─ api/
   │       ├─ auth/
   │       │   ├─ google/
   │       │   │   └─ callback.ts
   │       │   ├─ start.ts (optional)
   │       │   └─ logout.ts
   │       └─ chat.ts (update)
   └─ lib/
       ├─ auth.ts
       └─ cookies.ts
```

Tasks:
- [x] Scaffold directories & empty files as above.

---

## 4&nbsp;&nbsp;Utility code (`src/lib`)

### `auth.ts`
- `verifyGoogleIdToken(idToken)`
- `issueSessionJwt(payload)`
- `parseSessionJwt(token)`

### `cookies.ts`
- `setSessionCookie(res, token)`
- `clearSessionCookie(res)`
- `getSessionCookie(req)`

Tasks:
- [x] Install **google-auth-library**, **jsonwebtoken**, **cookies**.
- [x] Implement `auth.ts` helpers.
- [x] Implement `cookies.ts` helpers.

---

## 5&nbsp;&nbsp;Login page (`/login`)

- Renders "Continue with Google" using Google Identity Services JS SDK.
- Redirects to Google, which later hits our callback.

Tasks:
- [x] Add Google SDK script tag or npm pkg.
- [x] Build the page UI.
- [x] Trigger Google OAuth flow on button click.

---

## 6&nbsp;&nbsp;Callback handler (`/api/auth/google/callback`)

- Exchange **code** → ID token.
- Verify token & email domain.
- Issue session JWT, set cookie, localStorage via small script, redirect `/`.

Tasks:
- [x] Implement code–token exchange.
- [x] Verify `email_verified` and `@knock.app` domain.
- [x] Issue & set session cookie.
- [x] Redirect to homepage.

---

## 7&nbsp;&nbsp;Page protection middleware (`_middleware.ts`)

- Runs on every request except public assets & auth routes.
- Reads `relay_session` cookie → parses JWT → allows or redirects to `/login`.

Tasks:
- [x] Write middleware logic.
- [ ] Test dev + prod (Edge runtime).

---

## 8&nbsp;&nbsp;API route guard (`/api/chat`)

- Import helpers → reject `401` if unauthorised.

Tasks:
- [x] Insert auth check at top of handler.
- [ ] Add unit test (optional).

---

## 9&nbsp;&nbsp;Client helper for logged-in state

- Sync cookie → localStorage on first load.
- Components can read `localStorage.relay_session` for UI decisions.

Tasks:
- [x] Add hook / logic in `_app.tsx`.
- [ ] Verify hydration behaviour.

---

## 10&nbsp;&nbsp;Logout

- `/api/auth/logout` clears cookie.
- Client clears localStorage and redirects to `/login`.

Tasks:
- [x] Implement API route.
- [x] Add UI link / button to trigger logout.

---

## 11&nbsp;&nbsp;Environment variables

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
JWT_SECRET=
```

Tasks:
- [x] Add to `.env.local.example` & Vercel project settings.

---

## 12&nbsp;&nbsp;Package additions

```
yarn add google-auth-library jsonwebtoken cookies
```

Tasks:
- [x] Install deps & commit lockfile.

---

## 13&nbsp;&nbsp;Testing checklist

- [x] `/login` renders correctly.
- [x] Wrong-domain account blocked.
- [x] Right-domain account → `/` success.
- [x] Refresh persists session.
- [x] `/api/chat` returns 401 without cookie.
- [x] `/api/chat` returns 200 with cookie.
- [x] Token expiry forces re-login.
- [ ] `yarn build && yarn start` passes (requires Telegraph packages to be built first).

---

## 14&nbsp;&nbsp;Future hardening (optional)

- [ ] Rotate `JWT_SECRET` periodically.
- [ ] Shorten session lifetime.
- [ ] Add CSRF token on login callback.
- [ ] Strengthen CSP.