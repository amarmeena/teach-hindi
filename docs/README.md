# Teach Hindi

An interactive platform for learning Hindi language with gamification features and personalized learning paths.

## Features

- Interactive lessons with multimedia content
- Gamification elements (achievements, streaks, points)
- Progress tracking and personalized recommendations
- Offline mode support
- Social sharing and community features
- Responsive design for all devices

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod for validation
- Framer Motion for animations
- Headless UI for accessible components

## Getting Started

### Prerequisites

- Node.js 18.18.0 or later
- npm 9.6.7 or later

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/teach-hindi.git
   cd teach-hindi
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your environment variables:
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   DATABASE_URL=your-database-url-here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # App router pages
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Dashboard routes
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # UI components
│   └── layout/           # Layout components
├── lib/                   # Utility functions
├── types/                 # TypeScript types
├── hooks/                 # Custom React hooks
└── styles/               # Global styles
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 