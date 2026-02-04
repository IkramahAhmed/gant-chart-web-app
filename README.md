# Gantt Chart Web App

A modern, interactive Gantt chart application built with Next.js 14, TypeScript, and React. Perfect for project management with drag-and-drop task editing, automatic conflict resolution, and visual dependency tracking.

## 🌐 Live Demo

**Access the live application:** [https://gant-chart-web-6kum9slwi-ikramahahmeds-projects.vercel.app/](https://gant-chart-web-6kum9slwi-ikramahahmeds-projects.vercel.app/)

Just human-friendly project management tool for teams and individuals.

## ✨ Features

### Core Functionality

- ✅ Interactive Gantt chart with real date ranges
- ✅ Drag and drop task editing (move and resize)
- ✅ Modal UI for adding/editing tasks
- ✅ Visual task bars with progress indicators
- ✅ Task color coding

### Advanced Features

- 🤖 **Agent Feature**: Automatically resolves overlapping tasks
- 🔗 **Task Dependencies**: Define task relationships with visual arrows
- 📊 **Progress Visualization**: Show completion percentage in task bars
- 📱 **Responsive Design**: Works on desktop and mobile devices

### UI/UX

- Modern gradient design
- Clean, intuitive interface
- Smooth animations and transitions
- Accessible (WCAG AA compliance)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17.0 or higher
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd gant_chart
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🎯 How to Use

### Creating Tasks

1. Click the "+ Add Task" button
2. Fill in task details (title, dates, assignee, progress)
3. Choose a color for the task
4. Click "Save"

### Editing Tasks

1. Click on any task bar or task name
2. Modify the details in the modal
3. Click "Save"

### Drag and Drop

- **Move a task**: Drag the task bar horizontally
- **Resize a task**: Drag the left or right edge of the task bar

### Dependencies

1. Edit a task
2. Scroll to "Dependencies" section
3. Select tasks this task depends on (Ctrl/Cmd for multiple)
4. Choose dependency type:
   - **Finish-to-Start**: Task B starts after Task A finishes (most common)
   - **Start-to-Start**: Both tasks start together
   - **Finish-to-Finish**: Both tasks finish together
   - **Start-to-Finish**: Task B finishes when Task A starts
5. Save - arrows will appear on the timeline

### Agent (Conflict Resolution)

1. If tasks overlap, the Agent button shows a conflict count
2. Click the "🤖 Agent" button
3. The system automatically pushes overlapping tasks forward
4. All conflicts are resolved while preserving task durations

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **UI Library**: React 18
- **Drag & Drop**: react-dnd
- **Date Utilities**: date-fns
- **Styling**: CSS Modules
- **Code Quality**: ESLint, Prettier, Husky

## 📁 Project Structure

```
gant_chart/
├── app/                 # Next.js app directory
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Main page
│   └── globals.css     # Global styles
├── components/         # React components
│   ├── gantt/         # Gantt chart components
│   └── modals/        # Modal components
├── hooks/             # Custom React hooks
├── lib/               # Utilities and stores
│   ├── store.ts       # In-memory data store
│   ├── types.ts       # TypeScript types
│   └── utils/         # Utility functions
└── public/            # Static assets
```

## 🎨 Features in Detail

### Task Management

- Create, read, update, and delete tasks
- Assign tasks to team members
- Track progress (0-100%)
- Custom color coding

### Dependency Management

- Visual arrows showing task relationships
- Support for 4 dependency types
- Automatic cleanup when tasks are deleted

### Conflict Resolution

- Real-time conflict detection
- One-click automatic resolution
- Preserves task durations
- Visual feedback with conflict count badge

## 🔒 Security & Quality

- Input validation
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Husky for Git hooks
- npm audit for security checks

## 📝 License

This project is private and proprietary.

## 👥 Contributing

This is a private project. For issues or suggestions, please contact the project maintainer.

## 🙏 Acknowledgments

Built with modern web technologies following best practices for UI/UX, accessibility, and code quality.
