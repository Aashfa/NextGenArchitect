# NextGenArchitect 🏗️

**An AI-powered platform for custom floor plan generation and seamless plot purchasing.**

NextGenArchitect lets users design, validate, and approve architectural projects through an intuitive interface — combining generative algorithms for automated floor plan creation with a full plot-browsing and compliance-management workflow for admins.

<p align="left">
  <img src="https://img.shields.io/badge/React-18.0+-61DAFB?style=flat&logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-4.0+-646CFF?style=flat&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.0+-06B6D4?style=flat&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
</p>

---

## 🎬 Live Demo

<p align="center">
  <a href="https://drive.google.com/file/d/17XhV8er3RlMxsNMybm_OdDIoF8aj7Vrn/view?usp=sharing">
    <img width="956" height="374" alt="3dview" src="https://github.com/user-attachments/assets/a3442d77-8f98-4e8c-acec-6abbe411b7a7" alt="Watch the NextGenArchitect demo video" width="800" />
  </a>
</p>

<p align="center"><i>Click the screenshot above to watch the full demo — from browsing societies to generating and customizing a floor plan in 3D.</i></p>

---



## 🛠️ Technology Stack

NextGenArchitect is built as a modern, component-driven single-page application, optimized for fast local development and a smooth production build.

| Layer | Technology | Why it's used |
|---|---|---|
| **UI Library** | ![React](https://img.shields.io/badge/-React_18-61DAFB?style=flat&logo=react&logoColor=black) | Component-based architecture for reusable UI across user and admin dashboards |
| **Build Tool** | ![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat&logo=vite&logoColor=white) | Near-instant dev server startup and Hot Module Replacement for fast iteration |
| **Styling** | ![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white) | Utility-first styling for a consistent design system without custom CSS overhead |
| **CSS Processing** | ![PostCSS](https://img.shields.io/badge/-PostCSS-DD3A0A?style=flat&logo=postcss&logoColor=white) | Autoprefixing and Tailwind compilation pipeline |
| **Routing** | ![React Router](https://img.shields.io/badge/-React_Router-CA4245?style=flat&logo=reactrouter&logoColor=white) | Client-side navigation between user, sub-admin, and profile views |
| **Backend** | ![Python](https://img.shields.io/badge/-Python-3776AB?style=flat&logo=python&logoColor=white) ![Flask](https://img.shields.io/badge/-Flask-000000?style=flat&logo=flask&logoColor=white) | Handles floor plan generation logic (genetic algorithms), compliance validation, and API endpoints for the frontend |
| **Database** | ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?style=flat&logo=mongodb&logoColor=white) | Stores plot listings, user accounts, floor plans, and advertisement/approval records |
| **3D Visualization** | ![Three.js](https://img.shields.io/badge/-Three.js-000000?style=flat&logo=three.js&logoColor=white) | Renders interactive, walkthrough-ready 3D models of generated floor plans directly in the browser |
| **Payments** | ![Stripe](https://img.shields.io/badge/-Stripe-635BFF?style=flat&logo=stripe&logoColor=white) | Secure checkout for plot purchases and advertisement requests |
| **Notifications** | Email & in-app alerts | Automatic notifications for approvals, rejections, compliance flags, and purchase confirmations |
| **Icons** | React Icons | Consistent iconography across the interface |
| **Linting** | ![ESLint](https://img.shields.io/badge/-ESLint-4B32C3?style=flat&logo=eslint&logoColor=white) | Enforces code quality and consistency |

**Design system:** a consistent primary/secondary color palette (`#2F3D57` / `#ED7600`) is applied throughout via Tailwind's theme configuration, giving the platform a cohesive, professional look across every page.

---

## 🎯 Key Features

### 🏠 For Users
- **Homepage** with an image carousel introducing the platform
- **Society-Integrated Plot Listings** — browse plots organized by housing society, each with full specifications
- **AI-Generated Floor Plans** — auto-generate custom floor plans using genetic algorithms based on plot size and preferences
- **Interactive 3D View & Walkthrough** — explore generated floor plans in an interactive 3D model, with a virtual walkthrough to experience the layout before committing
- **Floor Plan Customization** — adjust walls, windows, doors, and furniture placement in real time within the 3D view
- **Save, Edit & Delete Floor Plans** — manage your own library of generated plans, revisit and modify them anytime, or remove ones you no longer need
- **Plot Purchasing with Stripe** — secure, integrated checkout powered by Stripe for buying a listed plot
- **Advertisement Requests** — submit a request (with supporting plans/documents) to advertise a plot or listing on the platform
- **Automatic Alerts & Email Notifications** — get notified automatically when a floor plan is approved/rejected, an advertisement request is reviewed, or a plot purchase is confirmed
- **User Authentication** — secure login and account management
- **Responsive Design** — works seamlessly across desktop, tablet, and mobile

### 👨‍💼 For Admins (Platform-Level)
- **Analytics Dashboard** — view platform-wide analytics and activity overview
- **Advertisement Approval** — review and approve advertisements before they go live for display
- **Society Management** — create, add, edit, and delete societies on the platform
- **Platform Control & Monitoring** — oversee overall platform operations, users, and activity

### 🏘️ For Sub-Admins (Registered Societies)
- **Society Registration** — societies register on the platform as sub-admins
- **Plot Details Upload** — upload and manage plot listings and their details
- **Floor Plan Compliance Checks** — validate uploaded/generated floor plans against society-specific compliance rules
- **Floor Plan Approval** — review user-requested floor plans and approve them online
- **Edit & Re-upload Approved Plans** — modify already-approved floor plans and re-upload updated versions
- **Advertisement Plan Subscription** — subscribe to advertisement plans to promote offers and announcements for their society

---

