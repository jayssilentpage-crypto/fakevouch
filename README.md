# FakeVouch.xyz

A modern web application for generating fake vouches with Discord OAuth authentication.

## Features

- 🔐 Discord OAuth authentication
- ⚡ Fast and secure vouch generation
- 🎨 Clean, modern UI with Tailwind CSS
- 📱 Responsive design
- 🚀 Built with Next.js 14

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Discord OAuth

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to OAuth2 section
4. Add redirect URI: `http://localhost:3000/api/auth/callback/discord`
5. Copy your Client ID and Client Secret

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
DISCORD_CLIENT_ID=your_discord_client_id_here
DISCORD_CLIENT_SECRET=your_discord_client_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_here
```

Generate a random secret for `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Adding Your Vouch Generation Code

1. Open `app/generate/page.tsx`
2. Find the `handleGenerate` function
3. Replace the placeholder code with your custom vouch generation logic

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add your environment variables in Vercel dashboard
4. Update Discord OAuth redirect URI to your production URL
5. Deploy!

## Project Structure

```
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts      # NextAuth configuration
│   ├── generate/
│   │   └── page.tsx              # Vouch generation page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── providers.tsx             # Auth provider
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## Technologies Used

- **Next.js 14** - React framework
- **NextAuth.js** - Authentication
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety

