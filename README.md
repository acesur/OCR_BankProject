<<<<<<< HEAD
# Bank Fraud Detection System - Angular Application

## Overview

A modern, responsive Angular application for OCR-Enabled Fraudulent Bank Account Reporting and Risk Assessment System using Artificial Neural Networks (ANN). This system provides role-based access for Police Officers, Administrators, and Bank Officials to report, review, and manage fraudulent bank accounts.

## 🌟 Features

### 🔐 Authentication & Authorization
- **Role-based access control** (Police, Admin, Bank)
- **JWT-based authentication**
- **Protected routes** with guards
- **Session management**

### 👮 Police Module
- **Dashboard** with personal statistics
- **New Fraud Report** with OCR and ANN integration
- **OCR Processing** for automatic data extraction from documents
- **AI Risk Assessment** using neural network analysis
- **Report Management** and status tracking

### 👨‍💼 Admin Module  
- **Comprehensive dashboard** with system-wide analytics
- **Report review and approval** workflow
- **High-risk account monitoring**
- **Bank and user management**
- **Freeze request coordination**

### 🏦 Bank Module
- **Freeze request management**
- **Account action tracking**
- **Status updates** and reporting
- **Historical data access**

### 🤖 AI & Technology Integration
- **OCR Service** for document processing
- **ANN Risk Scoring** with confidence levels
- **Risk factor analysis** and visualization
- **Real-time processing** status updates

## 🚀 Technology Stack

- **Frontend**: Angular 17+ with Standalone Components
- **UI Framework**: Angular Material
- **Authentication**: JWT with HTTP Interceptors
- **State Management**: RxJS & Services
- **Routing**: Angular Router with Guards
- **Styling**: SCSS with Material Design
- **HTTP**: Angular HttpClient with Interceptors

## 📁 Project Structure

```
src/
├── app/
│   ├── core/                    # Core functionality
│   │   ├── guards/             # Route guards (auth, role)
│   │   ├── interceptors/       # HTTP interceptors
│   │   ├── models/             # Data models and interfaces
│   │   └── services/           # Core services
│   ├── features/               # Feature modules
│   │   ├── auth/               # Authentication
│   │   ├── dashboard/          # Dashboard components
│   │   ├── police/             # Police module
│   │   ├── admin/              # Admin module
│   │   └── bank/               # Bank module
│   ├── shared/                 # Shared components
│   │   └── layout/             # Main layout components
│   ├── app.component.*         # Root component
│   ├── app.config.ts           # App configuration
│   └── app.routes.ts           # Route definitions
└── styles.scss                # Global styles
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Angular CLI 17+

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fraud-detection-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Development server**
   ```bash
   ng serve
   ```
   Navigate to `http://localhost:4200`

4. **Build for production**
   ```bash
   ng build --configuration production
   ```

## 🔑 Demo Credentials

The application includes demo accounts for testing:

| Role | Username | Password | Description |
|------|----------|----------|-------------|
| **Police** | `police1` | `pass123` | Police Officer - Inspector Sharma |
| **Admin** | `admin1` | `pass123` | Admin - Sarah Johnson |
| **Bank** | `bank1` | `pass123` | Bank Officer - Michael Chen |

## 🎯 Key Components

### Police New Report Component
- **OCR Integration**: Upload and process bank documents
- **Form Validation**: Comprehensive validation with error handling  
- **ANN Risk Assessment**: Real-time fraud risk analysis
- **File Management**: Drag-and-drop file upload with preview
- **Auto-population**: Use OCR results to fill form fields

### Dashboard Components
- **Role-specific dashboards** with relevant metrics
- **Interactive statistics cards** with trend indicators
- **Recent reports table** with filtering and sorting
- **Quick action buttons** for common tasks

### Layout System
- **Responsive sidebar navigation** with role-based menu items
- **Professional header** with user info and notifications
- **Collapsible navigation** for mobile devices
- **Consistent Material Design** theming

## 🔧 Services

### AuthService
- User authentication and session management
- Role-based access control
- Token management and refresh

### FraudReportService  
- CRUD operations for fraud reports
- OCR processing simulation
- ANN analysis integration
- Statistics and analytics

## 📱 Responsive Design

- **Mobile-first approach** with breakpoints at 768px, 1024px
- **Adaptive layouts** for different screen sizes
- **Touch-friendly interactions** for mobile devices
- **Optimized performance** across devices

## 🎨 UI/UX Features

- **Professional color scheme** (blues, greys, whites)
- **Status badges** with color coding
- **Risk level indicators** with visual hierarchy
- **Loading states** and progress indicators
- **Error handling** with user-friendly messages
- **Accessibility** compliance with WCAG guidelines

## 🚧 Future Enhancements

- [ ] Real OCR service integration
- [ ] Actual ANN model implementation  
- [ ] Advanced reporting and analytics
- [ ] Multi-language support
- [ ] Real-time notifications
- [ ] Advanced filtering and search
- [ ] Export functionality (PDF, Excel)
- [ ] Audit trail and logging

## 📝 Development Notes

### Code Organization
- **Standalone components** for better tree-shaking
- **Lazy loading** for feature modules
- **Reactive forms** with custom validators
- **Observable patterns** for state management

### Best Practices
- **TypeScript strict mode** enabled
- **Component composition** over inheritance
- **Service injection** with dependency injection
- **Error boundaries** and proper error handling
- **Performance optimization** with OnPush change detection

### Testing Strategy
- Unit tests for services and utilities
- Component testing with Angular Testing Library
- E2E testing with Cypress (planned)
- Code coverage reporting

## 📄 License

This project is developed for educational and demonstration purposes. Please ensure compliance with relevant banking and financial regulations when adapting for production use.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Built with ❤️ using Angular and Material Design**
=======
# OCR_BankProject
>>>>>>> a8889173399fa7730583202173e176d85f9889f0
