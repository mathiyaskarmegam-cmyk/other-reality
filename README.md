# The Other Reality

> A deliberate refuge for thoughtful, pseudonymous prose.

**The Other Reality** is a full-stack pseudonymous experience-sharing web application built with **React**, **TypeScript**, **Tailwind CSS**, and **Supabase**. It faithfully implements the Figma design and editorial philosophy: warm neutral backgrounds, editorial serif typography, unhurried pacing, generous whitespace, and sovereign data privacy.

---

## 1. Core Principles

- **Public Pseudonymity, Not Guaranteed Anonymity:** Real-world credentials (email, legal identity) are strictly decoupled from public pseudonymous monikers.
- **Uncurated Chronology:** No like counts, follower counts, popularity metrics, or algorithmic engagement ranking.
- **Quiet Formats:** Supports pure prose, visual stories (photographs with or without optional captions), and combined reflections.
- **Data Sovereignty:** Authors can view their private archive and permanently delete their own submissions. Users can also submit formal account deletion requests.
- **Moderation & Safety:** Community reporting workflow paired with an authorized Staff Moderation Queue enforcing community tenets.

---

## 2. Architecture & Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide React Icons, Google Fonts (*Newsreader* & *Plus Jakarta Sans*)
- **Build Tool:** Vite 7.3
- **Backend & Cloud Services:**
  - **Supabase Auth:** Registration, session management, password recovery, secure cookie/token storage.
  - **Supabase Database (PostgreSQL):** Normalized schema with foreign keys, constraints, and Row Level Security (RLS).
  - **Supabase Storage:** S3-compatible `experience-images` bucket for photograph uploads.
  - **Row Level Security (RLS):** Database-level security ensuring users can only edit/delete their own submissions and public feeds never expose private authentication emails.

---

## 3. Database Schema & Supabase Setup

The complete migration file is located at:
[`supabase/migrations/20261111000000_the_other_reality.sql`](file:///c:/career/the%20other%20reality/supabase/migrations/20261111000000_the_other_reality.sql)

### Database Tables:
1. `public.profiles`: Stores public pseudonyms, avatar motifs, and moderator flags. Linked to `auth.users(id)` via foreign key with `ON DELETE CASCADE`.
2. `public.experiences`: Experiences ledger (`text_only`, `photo_only`, `text_and_photo`) with publication status (`published`, `draft`, `moderated_removed`, `deleted`).
3. `public.experience_images`: Linked photographs with storage paths, URLs, and optional captions.
4. `public.reports`: Community reports submitted by users against violating content.
5. `public.moderation_records`: Audit log of moderator decisions (`dismissed`, `removed`, `warning`).
6. `public.account_deletion_requests`: Queued account deletion requests.

### RLS Policies Highlights:
- **`profiles`:** Publicly readable; users can only update their own profile (`auth.uid() = id`).
- **`experiences`:** Published entries are readable by all; users can only insert, update, or delete entries where `auth.uid() = user_id`. Moderators can update status to `moderated_removed`.
- **`reports` & `moderation_records`:** Only users with `is_moderator = true` on their profile can read reports or write moderation decisions.

### Supabase Setup Instructions:
1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard and run the contents of [`supabase/migrations/20261111000000_the_other_reality.sql`](file:///c:/career/the%20other%20reality/supabase/migrations/20261111000000_the_other_reality.sql).
3. Under **Storage**, create a public bucket named `experience-images`.
4. Copy your project URL and `anon` key into `.env`.

---

## 4. Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

*(Reference template available in [`.env.example`](file:///c:/career/the%20other%20reality/.env.example))*

> **Note on Transparency:** If Supabase credentials are not yet supplied, the application operates in persistent local evaluation mode with realistic sanctuary data matching the Figma screenshots and provides a status indicator pill in the footer.

---

## 5. Development & Build Commands

- **Run Dev Server:**
  ```cmd
  vite.bat
  ```
  *(Launches on `http://localhost:5173`)*

- **Build Production Bundle:**
  ```cmd
  vite.bat build
  ```

- **Run User Journey Test Suite:**
  ```cmd
  node.bat --experimental-strip-types scripts/test-journeys.js
  ```

---

## 6. Verified User Journeys (All 16 Tested)

The automated test suite ([`scripts/test-journeys.js`](file:///c:/career/the%20other%20reality/scripts/test-journeys.js)) verifies all 16 MVP journeys specified in the PRD:

1. **Register a new account:** Account creation with email and password.
2. **Set public nickname & avatar:** Nickname and archetype motif assigned; private email isolated.
3. **Log in:** Session token and user profile returned.
4. **Publish text-only experience:** Unhurried reading pacing calculated, stored in ledger.
5. **Publish photo-only experience:** Image uploaded without required caption.
6. **Publish photograph with optional text:** Image with optional caption and story.
7. **Discover published experiences:** Chronological uncurated feed.
8. **Open an experience:** Full reading modal with comfortable typography.
9. **View personal submissions:** Private archive categorizing text, photo, and text & photo.
10. **Delete an owned submission:** Verified backend deletion and immediate UI synchronization.
11. **Reject unauthorized deletion:** Backend rejects attempts to delete others' entries.
12. **Report an experience:** Community report logged with reason and optional context.
13. **Log in as authorized moderator:** Staff queue verified.
14. **Review & remove violating experience:** Moderator removes entry; immediately purged from discovery.
15. **Log out:** User session cleared.
16. **Request account deletion:** Formal deletion request logged as pending.

