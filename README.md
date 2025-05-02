# Global Services Website

A modern, responsive digital services website with comprehensive admin management and interactive user interfaces.

## Key Features

- Modern React.js frontend with TypeScript
- Tailwind CSS for styling with a custom color scheme
- Comprehensive admin panel for complete content management
- Responsive and adaptive layout
- Advanced UI animations and transitions
- Authentication system with user roles
- Blog, services, portfolio, and team sections management
- Contact form with submission tracking
- Job postings and company information management

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Custom auth with session management
- **Deployment**: Netlify-ready with serverless functions

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables by copying `.env.example` to `.env` and filling in the values
4. Run database migrations:
   ```
   npm run db:push
   ```
5. Start the development server:
   ```
   npm run dev
   ```

## Admin Access

The system automatically creates an admin user with these credentials on first run:
- Username: `admin`
- Password: `admin123`

**Important**: Change the admin password after first login for security.

## Deployment

### Netlify Deployment

1. Connect your GitHub repository to Netlify
2. Configure the following environment variables in Netlify:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `SESSION_SECRET`: A secure random string for session encryption
   - `NODE_ENV`: Set to `production`
3. Deploy your site from the Netlify dashboard

### Manual Deployment

1. Build the project:
   ```
   npm run build
   ```
2. The build output will be in the `dist` directory
3. Set up your server to serve the static files from `dist`
4. Configure your server environment variables
5. Start the server:
   ```
   npm run start
   ```

## License

MIT