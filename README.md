# Survey Application

A comprehensive survey platform with admin panel and public survey interface built with React, TypeScript, and Supabase.

## Features

- **Admin Panel**: Create and manage surveys, add questions, publish surveys
- **Public Survey Interface**: Take surveys with dynamic question loading
- **Question Types**: Single choice, multiple choice, and text input
- **Validation**: Multi-choice questions limited to 2 answers maximum
- **Anonymous Responses**: Secure response submission without user tracking
- **Real-time Updates**: Live survey status management

## Project Structure

```
survey-application/
├── frontend/          # React frontend application
├── backend/           # Supabase configuration and functions
├── database/          # Database schema and migrations
└── README.md         # This file
```

## Quick Start

1. **Setup Supabase Connection**
   - Click "Connect to Supabase" button in the top right
   - This will configure your database connection

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Admin Panel: `http://localhost:5173/admin`
   - Public Surveys: `http://localhost:5173/survey/:id`

## Environment Variables

The following environment variables will be automatically configured when you connect to Supabase:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

## Folder Documentation

Each folder contains its own README with specific setup and usage instructions:

- [Frontend Documentation](./frontend/README.md)
- [Backend Documentation](./backend/README.md)
- [Database Documentation](./database/README.md)

## Deployment

The application can be deployed to any static hosting service like Netlify, Vercel, or GitHub Pages. Run `npm run build` to create the production build.

## Technologies Used

- **Frontend**: React 18, TypeScript, Tailwind CSS, React Router
- **Backend**: Supabase (PostgreSQL, REST API, Real-time)
- **Icons**: Lucide React
- **Build Tool**: Vite