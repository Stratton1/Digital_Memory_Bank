# Contributing to Memory Bank

Thank you for your interest in contributing to Memory Bank!

## Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/memory-bank.git
    cd memory-bank
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up environment variables**
    Copy `.env.example` to `.env.local` and fill in your Supabase credentials.
    ```bash
    cp .env.example .env.local
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

## Development Workflow

-   **Branching**: Create a new branch for each feature or fix (e.g., `feature/voice-memos`, `fix/login-bug`).
-   **Commits**: Use descriptive commit messages.
-   **Linting**: Ensure code passes linting before pushing.
    ```bash
    npm run lint
    ```
-   **Testing**: Run tests to ensure no regressions.
    ```bash
    npm run test
    ```

## Project Structure

-   `/src/app`: Next.js App Router pages and layouts.
-   `/src/components`: Reusable UI components.
-   `/src/lib`: Utilities, Supabase client, and types.
-   `/supabase`: Database migrations and seed data.
-   `/docs`: Project documentation.

## Code Style

-   We use **TypeScript** for type safety.
-   We use **Tailwind CSS** for styling.
-   We follow the **Next.js** recommended patterns (Server Components by default).

## License

[MIT](LICENSE)
