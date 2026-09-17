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
    <img src="https://img.shields.io/badge/▶_Watch_the_Demo_Video-FF0000?style=for-the-badge&logo=googledrive&logoColor=white" alt="Watch Demo Video"/>
  </a>
</p>

<p align="center"><i>See NextGenArchitect in action — from browsing societies to generating a custom floor plan in one click.</i></p>

> 💡 **Tip for future updates:** GitHub renders `.gif` and `.mp4` files uploaded directly to the repo (e.g. under an `assets/` or `docs/` folder) as inline previews right in this README — no click-through needed. Converting the demo into a short GIF/MP4 and embedding it here (`![Demo](assets/demo.gif)`) would let visitors watch it without leaving the page.

---

## 📋 Table of Contents

- [Live Demo](#-live-demo)
- [Technology Stack](#-technology-stack)
- [Key Features](#-key-features)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start-5-minutes-setup)
- [Detailed Setup](#-detailed-setup)
- [Project Structure](#-project-structure)
- [Available Scripts](#-available-scripts)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

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

### 👨‍💼 For Sub-Admins
- **Analytics Dashboard** — administrative overview of platform activity
- **Floor Plan Approval Workflow** — review and approve or reject user-generated floor plans before they go live
- **Advertisement Request Review** — approve or decline incoming advertisement requests along with their submitted plans
- **Compliance Management** — define building compliance rules and validate each plot listing and floor plan against them
- **Room Connections** — configure relationships between rooms in a generated plan
- **Plot Configuration** — set plot sizes and requirements per society
- **Automatic Compliance Alerts** — get notified automatically when a submitted plan or listing fails a compliance check, so it can be flagged for review

---



