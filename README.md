# SocialApp — (Frontend Only)

A frontend-only, Facebook-inspired social media application built with React. There is no backend every piece of data (users, posts, comments, likes) lives entirely in the browser's `localStorage`.

## Features

- **Authentication** — signup, login, logout, and session persistence across page refreshes (Context API + localStorage)
- **Feed** — public feed of published, public posts, newest first, with live search
- **Posts** — create, edit, delete, save as draft, publish, toggle public/private
- **Post detail page** — full post view with like/unlike and threaded comments
- **Comments** — add comments, delete your own comments (with inline confirmation)
- **Profiles** — public profile pages with avatar, bio, location, and a user's public posts
- **Dashboard** — protected area with sidebar navigation: My Posts, Create Post, Saved Posts, Profile Settings
- **Protected routes** — dashboard routes redirect to `/login` when not authenticated
- **Image uploads** — Base64 image conversion with live preview and remove/replace
- **Bonus features**:
  - 🔍 Real-time search on the Feed page
  - 🔖 Bookmark / Save posts
  - 🌙 Dark mode toggle (persisted)
  - 🔢 Live character counter on post description (orange at 400, red at 480)
  - 🖼 Image preview before upload on Create/Edit Post
  - 🗑 Delete your own comments with inline "Are you sure?" confirmation

## Tech Stack

| Technology | Purpose |
|---|---|
| React (Vite) | Frontend framework |
| React Router DOM v6 | Routing, nested & protected routes |
| Tailwind CSS | All styling, responsive design, dark mode |
| React Hook Form | All form validation |
| Context API | Auth state + shared posts state |
| localStorage | All data persistence |
| clsx | Conditional className composition |
| React.lazy + Suspense | Route-based code splitting |

## Folder Structure

```
social-app/
├── public/
├── src/
│   ├── components/       # Reusable UI components (Button, Input, Avatar, Modal, etc.)
│   ├── context/           # AuthContext, PostsProvider
│   ├── hooks/             # useLocalStorage, usePosts
│   ├── layouts/           # DashboardLayout
│   ├── pages/              # Route-level pages
│   ├── routes/             # ProtectedRoute
│   ├── utils/               # storage.js, helpers.js, seedData.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── package.json
```

## How to Run

```bash
npm install
npm run dev
# Opens at http://localhost:5173
```

Sample accounts are seeded automatically on first load:

| Email | Password |
|---|---|
| asad@test.com | Password123 |
| hina@test.com | Password123 |

## localStorage Structure

All data lives under five top-level keys:

- **`users`** — array of registered users (`id`, `name`, `email`, `password`, `bio`, `location`, `avatar`, `coverImage`, `bookmarks`, `joinedAt`)
- **`posts`** — array of posts (`id`, `authorId`, `description`, `image`, `isPublic`, `isDraft`, `createdAt`, `updatedAt`)
- **`comments`** — array of comments (`id`, `postId`, `authorId`, `text`, `createdAt`)
- **`likes`** — array of likes (`id`, `postId`, `userId`, `createdAt`)
- **`currentUser`** — the currently logged-in user (session), or absent if logged out
- **`theme`** — `"light"` or `"dark"`

All reads/writes go through `src/utils/storage.js` — no component touches `localStorage` directly.

## What I Learned

Building this project reinforced how much structure Context API and custom hooks add once an app grows past a handful of components — centralizing all storage access in one file made every feature (likes, drafts, bookmarks) trivial to wire up consistently, and lazy-loading each route noticeably shrank the initial JS bundle.

## Limitations

- No real backend — all data is local to the browser and device. Clearing browser storage wipes the app.
- Passwords are stored in plaintext in localStorage, which is only acceptable because this is a learning project with no real user data at stake — never do this in production.
- No pagination — the feed loads all public posts at once.
- No image compression — large uploaded images are stored as-is as Base64, which can bloat localStorage.

## Deployment

Build a production bundle with:

```bash
npm run build
```

The `dist/` folder can be deployed to any static host (Vercel, Netlify, GitHub Pages, etc.). No environment variables or backend configuration are required, since the app has no server dependency.

---

# Assignment 2 — Add-On Features

Built on top of the Assignment 1 SocialApp above. Three new feature sets, still 100% frontend — friend
requests + a real-time chat use `localStorage`, and the AI features call the OpenAI API directly from
the browser.

## 1. Friend System

- **People You May Know** (`/people`) — every user who isn't already a friend, sorted so incoming
  requests show first, then no-connection users, then users you've already messaged a request to. Each
  card shows a mutual-friends count.
- **Friend Requests** (`/requests`) — Received / Sent tabs. Accept, Reject, or Cancel a request.
- **Friends** (`/friends`) — grid of accepted friends with Message and Unfriend actions.
- **Profile page** — relationship-aware buttons (Add Friend / Request Sent / Accept+Reject / Message+Unfriend / Edit Profile).
- **Navbar** — a red badge on "Requests" shows the pending-received count; disappears at zero.

## 2. Real-Time Chat

- **Chat** (`/chat`, `/chat/:userId`) — conversation list sorted by most recent message, unread badges,
  a professional message bubble layout (yours on the right in blue, theirs on the left in grey), image
  and video attachments with a preview-before-send step, an online indicator (green dot if the friend
  was active in the last 5 minutes), auto-scroll, and mobile-responsive full-screen conversations.
- Users can only message people who are already friends — direct URL access to a non-friend's chat
  redirects to `/friends`.

## 3. AI Integration (OpenAI, `gpt-4o-mini`)

Every AI call goes through `src/lib/openai.js` (a single client instance) and `src/hooks/useAI.js` (one
function per feature, `max_tokens: 300`, wrapped in try/catch so a failed call never crashes the page).

- **AI Post Assistant** — collapsible panel above the description field on Create/Edit Post. Type a short
  idea, generate a suggested caption, and optionally use it — never auto-submitted.
- **AI Comment Suggestions** — a "✨ Suggest Comment" button on the Post Detail page fills the comment box
  with a suggestion based on the post's description; you still have to click Post.
- **AI Profile Optimisation** — "✨ Optimise with AI" on Profile Settings rewrites your bio (under 150
  characters) into a suggestion card you can accept, edit, or ignore.
- **AI Chat — Mode 1 (always on):** after your friend sends a message, three reply-suggestion chips
  appear below their bubble, generated from the last 5 messages of context. Click one to send it, or
  ignore them and type your own reply. Failures here fail silently.
- **AI Chat — Mode 2 (opt-in):** toggle "Let AI reply for me" from the chat header's AI menu. A banner
  ("AI is responding on your behalf — tap to disable") appears, and after a 1–2s delay the AI sends a
  reply on your behalf, marked with a ✨ sparkle icon. The setting is saved per-user to `aiSettings` in
  localStorage and persists across sessions. A failed auto-reply shows a "please reply manually" toast
  instead of silently failing, since the user is trusting AI to represent them.

## Real-Time Chat Architecture

There's no backend, so real-time updates are simulated with the browser's built-in `storage` event:
writing to `localStorage` in one tab automatically fires a `storage` event in every *other* open tab on
the same origin. `ChatProvider` and `FriendsProvider` each register a `window.addEventListener('storage', ...)`
listener that re-reads the relevant key (`messages` or `friendRequests`) and updates React state — so
opening the app as two different users in two tabs lets them message each other live, no refresh needed.
The listener is always cleaned up with `removeEventListener` in the effect's return function.

Conversation IDs are generated by sorting both user IDs alphabetically and joining them
(`getConversationId` in `src/utils/chatHelpers.js`), so `A→B` and `B→A` always resolve to the same
conversation regardless of who opens the chat first.

## How to Set Up the OpenAI API Key

1. Get a key from https://platform.openai.com/api-keys
2. In the project root, copy the example file: `cp .env.example .env`
3. Open `.env` and paste your key: `VITE_OPENAI_API_KEY=sk-...`
4. Restart `npm run dev` if it was already running (Vite only reads `.env` on startup)

> **Note:** `.env` is listed in `.gitignore` and is never committed. Anyone cloning this repo needs their
> own OpenAI API key to use the AI features — everything else (friends, chat, posts) works without one.

## New localStorage Keys (Assignment 2)

- **`friendRequests`** — `{ id, fromUserId, toUserId, status, sentAt, respondedAt }`
- **`messages`** — `{ id, conversationId, senderId, receiverId, type, content, timestamp, read, aiGenerated }`
- **`aiSettings`** — `{ [userId]: { aiChatEnabled, aiPersonality } }`

## New Screenshots

*(add these 4 before submitting — People page; a chat conversation showing AI reply chips; the AI Post
Assistant generating a caption; AI auto-reply mode active with the sparkle icon)*
