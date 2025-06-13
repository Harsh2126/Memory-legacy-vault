# New Project


# Legacy Vault

A modern web application built with Next.js 15, React 19, and TypeScript, featuring a beautiful UI powered by Tailwind CSS and Radix UI components. Legacy Vault is designed to provide a secure and efficient way to manage and access legacy data and systems.

## 🚀 Features

### Core Features
- Modern and responsive user interface with dark mode support
- Built with Next.js 15 and React 19 for optimal performance
- TypeScript for enhanced type safety and better developer experience
- Tailwind CSS for consistent and maintainable styling
- Radix UI components for accessible and customizable UI elements

### Advanced Features
- Real-time data synchronization with Socket.IO
- Form handling with react-hook-form and zod validation
- Interactive data visualization with Recharts
- Toast notifications with Sonner for better user feedback
- Date handling and formatting with date-fns
- Comprehensive icon set with Lucide React
- Responsive design for all device sizes
- Keyboard navigation support
- Accessibility features (ARIA labels, semantic HTML)

## 📋 Prerequisites

- Node.js (Latest LTS version recommended)
- pnpm (Package manager)
- Git for version control
- A modern web browser (Chrome, Firefox, Safari, or Edge)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/Harsh2126/v0-new-project.git
cd legacy-vault
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env` file in the root directory and add your environment variables:
```env
# Add your environment variables here
NEXT_PUBLIC_API_URL=your_api_url
```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
pnpm dev
```
The application will be available at `http://localhost:3000`

### Production Build
```bash
pnpm build
pnpm start
```

### Running Tests
```bash
pnpm test
```

## 🧪 Available Scripts

- `pnpm dev` - Start development server with hot reloading
- `pnpm build` - Build for production with optimization
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint for code quality
- `pnpm test` - Run test suite
- `pnpm type-check` - Run TypeScript type checking

## 🏗️ Project Structure

```
legacy-vault/
├── app/              # Next.js app directory
│   ├── api/         # API routes
│   └── (routes)/    # Application routes
├── components/       # Reusable UI components
│   ├── ui/          # Basic UI components
│   └── features/    # Feature-specific components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and configurations
│   ├── utils/       # Helper functions
│   └── config/      # Configuration files
├── public/          # Static assets
├── styles/          # Global styles
└── types/           # TypeScript type definitions
```

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15
- **Language:** TypeScript
- **UI Components:** Radix UI
- **Styling:** Tailwind CSS
- **Form Handling:** React Hook Form + Zod
- **Real-time:** Socket.IO
- **Charts:** Recharts
- **Notifications:** Sonner
- **Date Handling:** date-fns
- **Icons:** Lucide React

### Development Tools
- **Package Manager:** pnpm
- **Code Quality:** ESLint
- **Version Control:** Git
- **Type Checking:** TypeScript

## 🔧 Development Guidelines

### Code Style
- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Write meaningful comments
- Follow the project's ESLint configuration

### Git Workflow
1. Create a new branch for each feature/fix
2. Write meaningful commit messages
3. Create pull requests for code review
4. Ensure all tests pass before merging

### Performance Optimization
- Implement proper code splitting
- Optimize images and assets
- Use proper caching strategies
- Monitor bundle size
- Implement lazy loading where appropriate







## Deployment

My project is live at:

https://memory-lagecy.vercel.app/




