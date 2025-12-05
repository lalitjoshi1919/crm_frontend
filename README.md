# CRM Ticket Management System

A modern, responsive web application for managing customer support tickets built with React, Redux Toolkit, and Bootstrap.

## Features

- **User Authentication**: Secure login and registration system
- **Ticket Management**: Create, view, update, and track support tickets
- **User Dashboard**: Personalized dashboard with ticket overview
- **Password Reset**: Secure password reset functionality with OTP verification
- **Responsive Design**: Mobile-friendly interface using Bootstrap
- **Real-time Updates**: Dynamic ticket status updates
- **Search & Filter**: Advanced search and filtering capabilities
- **Message History**: Complete conversation history for each ticket

## Tech Stack

- **Frontend**: React 19.1.0
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **UI Framework**: Bootstrap 5.3.6 & React Bootstrap
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Notifications**: React Toastify
- **Styling**: CSS3 with custom components

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 16.0 or higher)
- npm or yarn package manager
- Git

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/lalitjoshi1919/crm_ticket_management.git
cd crm_ticket_management/crm_ticket
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory and configure the following variables:

```env
VITE_API_BASE_URL=your_api_base_url
VITE_APP_NAME=CRM Ticket Management
```

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── api/                    # API service files
│   ├── passwordApi.jsx
│   ├── ticketApi.jsx
│   └── userApi.jsx
├── components/             # Reusable UI components
│   ├── add-ticket-form/
│   ├── breadcrumb/
│   ├── login/
│   ├── message-history/
│   ├── password-reset/
│   ├── private-route/
│   ├── registration-form/
│   ├── search-form/
│   └── ticket-table/
├── layout/                 # Layout components
│   ├── DefaultLayout.jsx
│   └── partials/
├── pages/                  # Page components
│   ├── dashboard/
│   ├── entry/
│   ├── new-ticket/
│   ├── password-reset/
│   ├── registration/
│   ├── ticket/
│   ├── ticket-list/
│   └── user-verification/
├── styles/                 # Global styles
├── utils/                  # Utility functions
├── store.jsx              # Redux store configuration
└── App.jsx                # Main application component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

## Configuration

### API Configuration

Update the API endpoints in the respective API files:
- `src/api/userApi.jsx` - User authentication endpoints
- `src/api/ticketApi.jsx` - Ticket management endpoints
- `src/api/passwordApi.jsx` - Password reset endpoints

### Redux Store

The application uses Redux Toolkit for state management. Store configuration is in `src/store.jsx`.

## Deployment

### Vercel Deployment

The project includes a `vercel.json` configuration file for easy deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the configuration
3. Deploy with zero configuration

### Manual Deployment

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service.

## Features Overview

### Authentication
- User registration with email verification
- Secure login system
- Password reset with OTP verification
- Protected routes

### Ticket Management
- Create new support tickets
- View ticket details and history
- Update ticket status
- Search and filter tickets
- Message history tracking

### Dashboard
- Personalized user dashboard
- Ticket statistics
- Quick actions
- Recent activity

## Contributing


1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Lalit Joshi**
- GitHub: [@lalitjoshi1919](https://github.com/lalitjoshi1919)

## Support

If you encounter any issues or have questions, please:
1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Contact the maintainer

## Version History

- **v0.0.0** - Initial release with core functionality
  - User authentication
  - Ticket management
  - Dashboard
  - Password reset functionality

---

**Happy Coding!**
