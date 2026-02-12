# Hospital Management System - React Frontend

A modern, feature-rich React frontend for the Hospital Management System API.

## 🚀 Features

- **Authentication**: Login, Register, JWT-based auth
- **Dashboard**: Role-based dashboards with statistics
- **User Management**: Admin controls for users and roles
- **Doctors Management**: Full CRUD operations
- **Patients Management**: CRUD + patient history
- **Appointments**: Book, view, and cancel appointments
- **Departments**: Manage hospital departments
- **Staff Management**: Nurses, Pharmacists, Accountants
- **Medicine Inventory**: Stock management, low stock alerts, expired medicines
- **Prescriptions**: Create and manage prescriptions
- **AI Chatbot**: Health triage assistant

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Hospital Management System API running on `http://localhost:5151`

## 🛠️ Installation

### PowerShell Execution Policy (Windows)

If you encounter PowerShell execution policy errors, run PowerShell as Administrator and execute:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Install Dependencies

```bash
cd hospital-frontend
npm install
```

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

The application will start at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🔧 Configuration

The API base URL is configured in `src/api/axiosConfig.js`:

```javascript
const API_BASE_URL = 'http://localhost:5151/api';
```

Update this if your API runs on a different port.

## 📁 Project Structure

```
hospital-frontend/
├── src/
│   ├── api/              # API service layer (12 modules)
│   ├── components/       # Reusable components
│   │   ├── common/       # Toast, Modal, LoadingSpinner
│   │   └── layout/       # Layout, Sidebar, Navbar
│   ├── context/          # AuthContext for authentication
│   ├── pages/            # All page components
│   │   ├── auth/         # Login, Register
│   │   ├── dashboard/    # Dashboard
│   │   ├── doctors/      # Doctors management
│   │   ├── patients/     # Patients management
│   │   ├── appointments/ # Appointments
│   │   ├── departments/  # Departments
│   │   ├── nurses/       # Nurses management
│   │   ├── pharmacists/  # Pharmacists management
│   │   ├── accountants/  # Accountants management
│   │   ├── medicine/     # Medicine inventory
│   │   ├── prescriptions/# Prescriptions
│   │   ├── admin/        # User management
│   │   └── chat/         # AI Chatbot
│   ├── styles/           # Global CSS
│   ├── App.jsx           # Main app with routing
│   └── main.jsx          # Entry point
├── public/               # Static assets
├── index.html            # HTML template
├── package.json          # Dependencies
└── vite.config.js        # Vite configuration
```

## 🎨 Design Features

- **Dark Theme**: Modern dark color scheme
- **Glassmorphism**: Backdrop blur effects
- **Responsive**: Mobile-friendly design
- **Animations**: Smooth transitions and hover effects
- **Role-Based UI**: Different views for Admin, Doctor, Patient roles

## 🔐 User Roles

- **Admin**: Full access to all modules
- **Doctor**: Appointments, Patients, Prescriptions
- **Patient**: Book appointments, AI chatbot
- **Pharmacist**: Medicine inventory, Prescriptions
- **Nurse**: Limited access
- **Accountant**: Financial management

## 📝 Default Test Credentials

After running the API and seeding data, you can use:

- **Email**: admin@hospital.com
- **Password**: Admin@123

(Update based on your API's seeded data)

## 🐛 Troubleshooting

### PowerShell Script Execution Error

```
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### API Connection Error

1. Ensure the API is running on `http://localhost:5151`
2. Check CORS settings in the API
3. Verify the API base URL in `src/api/axiosConfig.js`

### Port Already in Use

```bash
# Kill process on port 5173
npx kill-port 5173
```

## 📦 Dependencies

- **react**: ^18.3.1
- **react-dom**: ^18.3.1
- **react-router-dom**: ^6.22.0
- **axios**: ^1.6.7
- **vite**: ^5.1.4

## 🚀 Deployment

### Build

```bash
npm run build
```

The build output will be in the `dist/` folder.

### Deploy to Netlify/Vercel

1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Update API base URL for production

## 📄 License

MIT

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For issues and questions, please open an issue on GitHub.
