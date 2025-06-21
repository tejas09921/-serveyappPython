# Frontend - Survey Application

React-based frontend application with admin panel and public survey interface.

## Structure

```
frontend/
├── components/       # Reusable UI components
│   ├── admin/       # Admin panel specific components
│   ├── survey/      # Survey taking components
│   └── ui/          # Common UI components
├── pages/           # Page components
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## Key Components

### Admin Panel (`/admin`)
- **SurveyList**: Display all surveys with status indicators
- **SurveyForm**: Create and edit surveys
- **QuestionBuilder**: Add and manage survey questions
- **PublishControls**: Change survey status from Draft to Live

### Public Interface (`/survey/:id`)
- **SurveyDisplay**: Render survey questions dynamically
- **QuestionRenderer**: Handle different question types
- **ResponseForm**: Collect and validate user responses
- **ThankYou**: Show completion message

### UI Components
- **Button**: Consistent button styling with variants
- **Card**: Survey and question containers
- **Input**: Form input components
- **Modal**: Overlay dialogs for confirmations

## Running the Frontend

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Build for Production**
   ```bash
   npm run build
   ```

3. **Preview Production Build**
   ```bash
   npm run preview
   ```

## Styling

- **Framework**: Tailwind CSS for utility-first styling
- **Design System**: 8px spacing grid, consistent color palette
- **Responsive**: Mobile-first design with tablet and desktop breakpoints
- **Animations**: Smooth transitions and hover effects

## API Integration

The frontend communicates with Supabase through:
- Real-time subscriptions for live survey status
- REST API calls for CRUD operations
- Anonymous response submission