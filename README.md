# Memory Bank

**Preserve your family's story. One memory at a time.**

Memory Bank is a secure, private digital vault where families can capture stories, photos, and precious moments — guided by a friendly AI companion called Nexa.

## Features

-   **Daily Prompts**: Answer thoughtful questions from Nexa to spark memories.
-   **Rich Storytelling**: Create memories with text, photos, dates, and locations.
-   **Family Connections**: Invite family members to share your journey.
-   **Shared Vault**: Choose exactly which memories to share and with whom.
-   **Search & Discovery**: Find memories by keywords, tags, or location.
-   **Secure & Private**: Your data is encrypted and private by default.

## Tech Stack

-   **Framework**: Next.js 16 (App Router)
-   **Database**: Supabase (PostgreSQL)
-   **Auth**: Supabase Auth
-   **Styling**: Tailwind CSS + shadcn/ui
-   **Testing**: Vitest

## Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/memory-bank.git
    cd memory-bank
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Copy `.env.example` to `.env.local` and add your Supabase credentials.
    ```bash
    cp .env.example .env.local
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

5.  **Open**: `http://localhost:3000`

## Documentation

See the `/docs` directory for detailed documentation:
-   [Project Handbook (CLAUDE.md)](docs/CLAUDE.md)
-   [Roadmap](docs/ROADMAP.md)
-   [Repository Structure](docs/REPO_STRUCTURE.md)

## License

MIT
