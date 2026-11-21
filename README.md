# ProofPix 📸 — Zero-Storage Client Gallery for Photographers

> **Turn any public Google Drive folder link into a sleek, mobile-first client photo selection & payment-locked gallery—with ₹0 server storage cost.**  
> Built as an Indian alternative to Pixieset Client Gallery with UPI integration, 1-click WhatsApp summaries, and Lightroom batch script export.

---

## 🌟 Why ProofPix? (Head-to-Head Comparison)

| Feature | Traditional Platforms (Pixieset) | ProofPix (₹0 Launch Version) |
| :--- | :--- | :--- |
| **Photo Storage** | Upload to proprietary server (Free plan limited to 3GB; \$15–\$40/mo upgrades) | **Google Drive Link Integration:** Photographer pastes Google Drive folder link, gallery renders directly — **₹0 storage cost**. |
| **Photo Selection** | ❤️ Heart Favorite list | **❤️ Heart Selection + Custom Comments:** Client selects and adds design instructions (e.g., *"is photo ko album ke front page par rakhna"*). |
| **Download Lock** | Simple PIN download | **Payment-Lock Toggle + Dynamic Watermark:** Until photographer marks "Payment Done" from dashboard, download is locked and diagonal watermark is active. |
| **Notifications** | Automated Email (often ignored in India) | **1-Click WhatsApp Summary:** Submitting selection directly launches WhatsApp with formatted event details, count, and link. |
| **Pricing for India** | \$15–\$40 / month (₹1,300 – ₹3,500/mo + Forex fees) | **₹0 Free Forever / ₹299/mo / ₹1,999/yr** (Unlimited events, UPI/QR enabled, no storage fees). |

---

## 🚀 Tech Stack

- **Framework:** Next.js 14+ (App Router) with TypeScript
- **Styling:** Tailwind CSS, Lucide Icons, Canvas-Confetti
- **Storage / Media:** Google Drive API v3 (Direct client streaming with thumbnail optimization `=s800` & `=s1600` without server storage)
- **Database & Auth:** Supabase (PostgreSQL with Row Level Security)
- **Deployment:** Vercel (100% Free Tier Compatible)

---

## 🛠️ Step-by-Step Setup Guide

### 1. Clone & Install Dependencies
```bash
git clone <your-repo-url>
cd proofpix
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your API keys in `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Google Drive API Key
GOOGLE_DRIVE_API_KEY=AIzaSy...
NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY=AIzaSy...

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🔑 How to Get a Free Google Drive API Key (3 Minutes)

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (e.g., `ProofPix-Studio`).
3. In the sidebar, navigate to **APIs & Services** > **Library**.
4. Search for **Google Drive API** and click **Enable**.
5. Go to **APIs & Services** > **Credentials**.
6. Click **+ Create Credentials** > **API key**.
7. Copy your generated API key and paste it into `.env.local` as `GOOGLE_DRIVE_API_KEY`.
8. *(Optional)* Click **Edit API Key** > **API restrictions** > select **Google Drive API** only to restrict usage.

> **Important:** To display photos in ProofPix, ensure your client Google Drive folder's sharing setting is set to:  
> **"Anyone with the link can view"** (General Access: Anyone with the link > Viewer).

---

## 🗄️ Setting Up Supabase Database

1. Go to [supabase.com](https://supabase.com/) and create a new project.
2. In the sidebar, open the **SQL Editor**.
3. Copy the full contents of `supabase/schema.sql` from this repository and run the query.
4. This creates:
   - `profiles` table (Studio Name, WhatsApp Number, UPI ID)
   - `projects` table (Event Name, Google Drive Folder ID, Max Selection, Watermark, PIN, Payment Status)
   - `selections` table (Hearted files, comments/notes)
   - Row Level Security (RLS) policies allowing public client viewing while securing photographer management.
5. In **Project Settings** > **API**, copy your **Project URL** and **Anon Key** into `.env.local`.

---

## 💻 Running Locally

```bash
# Development mode
npm run dev

# Production build & start
npm run build
npm run start
```
Visit `http://localhost:3000` in your browser.

---

## 📦 Core Workflows

### A. Photographer Dashboard (`/dashboard`)
1. **Create New Gallery:**
   - Paste any Google Drive link (`drive.google.com/drive/folders/...`).
   - The regex engine automatically extracts the clean Folder ID.
   - Set Client Name, WhatsApp Number, Max Selection Limit, and optional 4-digit PIN.
2. **Payment-Lock Control:**
   - Toggle **"Mark Payment Done"** anytime.
   - When **Locked** (`is_paid == false`): High-Res downloads are disabled, watermark is active, and a UPI QR modal is shown.
   - When **Unlocked** (`is_paid == true`): Watermarks disappear and downloads unlock instantly.
3. **Lightroom & Editor Export:**
   - Click **"Export"** on any project.
   - Click **"Copy Filenames"** to paste comma-separated filenames into Lightroom's Text Filter.
   - Click **"Download Windows Batch Script (.bat)"** to generate a script that copies the selected RAW/JPEG files into a `Selected_Photos` subfolder on Windows.

### B. Client Gallery View (`/gallery/[slug]`)
1. Minimalist luxury Pixieset-style UI.
2. Client toggles ❤️ to select photos up to the photographer's limit.
3. Client clicks 💬 to attach editing notes (e.g., *"is photo ko album ke front page par rakhna"*).
4. Fullscreen lightbox with arrow keys and swipe support.
5. Clicking **"Submit Selection"** opens the **1-Click WhatsApp Summary** linking directly to the photographer's WhatsApp with counts and notes.

---

## 🛡️ Real Login Tracking & Audit Security

ProofPix includes built-in security auditing for studio owners:
- **Audit Logs Table:** Tracks every login, signup, project creation, payment unlock, and UTR submission with:
  - User Email & Studio Name
  - Client IP Address (via `x-forwarded-for` / `x-real-ip`)
  - User Agent (Device, Browser, Operating System)
  - Exact Timestamp (ISO 8601)
- **Security & Login Audit Drawer:** Accessible directly from `/dashboard` with 1 click to view active sessions and audit trails in real-time.

---

## 💳 Real Payment Security & UTR Verification

To prevent unauthorized unlocks and support Indian payment habits:
1. **Cryptographic HMAC SHA-256 Signature Verification (`/api/payments/verify`):**
   - Direct Razorpay integration verifies payment authenticity using constant-time cryptographic comparisons. Tampered or fake signatures are blocked with `400 Bad Request`.
2. **Peer-to-Peer Indian UPI 12-Digit UTR Bank Verification (`/api/payments/utr-submit`):**
   - Clients paying directly via PhonePe, Google Pay, or Paytm submit their 12-digit Bank Reference (UTR) number.
   - The studio owner sees pending payments in their **"Payments & UTR Verification"** drawer with the client's name, phone, amount (₹), and 12-digit UTR.
   - Studio owner checks their bank passbook and clicks **"Confirm & Unlock Gallery"** in 1 click.

---

## 🚀 Deploying to Vercel (100% Free Tier)

The repository is already pushed and live on GitHub:
👉 **[https://github.com/kapdisagar/proofpix](https://github.com/kapdisagar/proofpix)**

### Instant 1-Click Deployment:
1. Visit **[vercel.com/new](https://vercel.com/new)**.
2. Select **`kapdisagar/proofpix`** from your GitHub repositories.
3. In the **Environment Variables** section, paste:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   GOOGLE_DRIVE_API_KEY=your-google-drive-api-key
   RAZORPAY_KEY_ID=your-razorpay-key-id          # optional
   RAZORPAY_KEY_SECRET=your-razorpay-key-secret  # optional
   ```
4. Click **Deploy** — Vercel builds the Next.js app in ~45 seconds and gives you a free live `https://proofpix.vercel.app` domain!

---

## 📄 License
MIT License. Crafted for Indian Photographers & Creative Studios.
