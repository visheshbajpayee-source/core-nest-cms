# Project Components

This folder contains modular components for the project management system with organized folder structure.

## Folder Structure

```
Project/
├── Components/
│   ├── ProjectHeader/
│   │   ├── ProjectHeader.tsx
│   │   └── index.ts
│   ├── ProjectCard/
│   │   ├── ProjectCard.tsx
│   │   └── index.ts
│   ├── ProjectProgress/
│   │   ├── ProjectProgress.tsx
│   │   └── index.ts
│   ├── ProjectStatusBadge/
│   │   ├── ProjectStatusBadge.tsx
│   │   └── index.ts
│   └── index.ts
├── Mapping/
│   ├── ProjectMapping.tsx
│   └── index.ts
├── ProjectData.ts
├── EmployeeProject.tsx (Main File)
├── index.ts
└── README.md
```

## Main Components

### **EmployeeProject.tsx** - Main File
- Central component that imports and uses all other components
- Manages the layout and structure  
- **No search functionality** per requirements

### **Components Folder** - Individual Project Components
- **ProjectHeader/** - Page header with title and description
- **ProjectCard/** - Individual project card component  
- **ProjectProgress/** - Progress bar with percentage display
- **ProjectStatusBadge/** - Status indicator badges

### **Mapping Folder** - Project Map Function
- **ProjectMapping.tsx** - Handles the mapping/listing of all projects
- Renders project grid layout
- Manages empty states

### **Data & Types**
- **ProjectData.ts** - Project data and TypeScript interfaces

## Features

✅ **Organized Structure** - Each component in its own folder  
✅ **Pure Components** - All components are React pure components  
✅ **TypeScript** - Full type safety with interfaces  
✅ **No Search** - Search functionality removed as requested  
✅ **Consistent Theme** - Matches overall application design  
✅ **Responsive Design** - Mobile-first with proper breakpoints  
✅ **Main File Architecture** - One main file calling all components  

## Usage

```tsx
import { EmployeeProject } from '@/app/components/Project';

// Use the main component
<EmployeeProject />

// Or use individual components
import { ProjectCard } from '@/app/components/Project/Components';
import { ProjectMapping } from '@/app/components/Project/Mapping';
```

## Project Data

The system includes 6 sample projects with different statuses:
- **In Progress** - 3 projects
- **Completed** - 1 project  
- **Pending** - 2 projects

Each project includes progress tracking, deadlines, and detailed descriptions.