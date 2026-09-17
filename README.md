# NextGenArchitect 🏗️

**An AI-powered platform for custom floor plan generation and seamless plot purchasing.**

NextGenArchitect is an AI-driven platform that makes residential floor plan design fast and effortless. Users can generate customizable, society-compliant floor plans in minutes, explore them in real-time 3D, fine-tune every detail with drag-and-drop editing, and submit them for online approval — all without needing design expertise or making physical visits. The platform serves three roles: Admins overseeing the platform, Societies (Sub-Admins) managing plot listings and compliance rules, and Users designing and submitting floor plans for approval.

<p align="left">
  <img src="https://img.shields.io/badge/React-18.0+-61DAFB?style=flat&logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-4.0+-646CFF?style=flat&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.0+-06B6D4?style=flat&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
</p>

---

## 🎬 Live Demo

<p align="center">
  <a href="https://drive.google.com/file/d/17XhV8er3RlMxsNMybm_OdDIoF8aj7Vrn/view?usp=sharing" aria-label="Click to watch the full NextGenArchitect demonstration">
    <img width="700" alt="Click to watch the full NextGenArchitect demo video" src="https://github.com/user-attachments/assets/81cc5ab7-d63e-49af-862e-ac96259a619e" />

  </a>
</p>

---

## 📸 Screenshots

<table>
  <tr>
    <td width="50%" valign="top">
      <h3 align="center">AI Floor Plan Generator</h3>
      <p align="center">
        <img src="https://github.com/user-attachments/assets/36711650-bebb-4166-aafe-3a1550f0e476" alt="AI Floor Plan Generator" width="100%" />
      </p>
      <p>Configure a plot, auto-generate compliant floor plans, and browse multiple layout variations ranked by space efficiency.</p>
    </td>
    <td width="50%" valign="top">
      <h3 align="center">2D Floor Plan Editor</h3>
      <p align="center">
        <img src="https://github.com/user-attachments/assets/80f1688d-e0d8-47c3-a050-917edde2edf0" alt="2D Floor Plan Editor" width="100%" />
      </p>
      <p>Fine-tune the generated layout by adding doors, windows, stairs, and rooms with free positioning on an interactive canvas.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3 align="center">Interactive 3D View &amp; Walkthrough</h3>
      <p align="center">
        <img src="https://github.com/user-attachments/assets/592a87e5-6021-45a3-99b9-483e560fc5c7" alt="Interactive 3D View and Walkthrough" width="100%" />
      </p>
      <p>Explore the design in 3D with customizable colors, lighting, and walkthrough mode, then export the final design as a PDF.</p>
    </td>
    <td width="50%" valign="top">
      <h3 align="center">Advertisement Management</h3>
      <p align="center">
        <img src="https://github.com/user-attachments/assets/dfd98eeb-85a0-48f4-b2d0-d998e0fb1e5c" alt="Advertisement Management Dashboard" width="100%" />
      </p>
      <p>Admins can review, approve, or reject advertisement requests while tracking payment status and duration for each listing.</p>
    </td>
  </tr>
</table>

---

## 📋 Table of Contents

- [Live Demo](#-live-demo)
- [Technology Stack](#-technology-stack)
- [Key Features](#-key-features)

---

## 🛠️ Technology Stack

NextGenArchitect is built as a modern, component-driven single-page application, optimized for fast local development and a smooth production build.

| Layer | Technology | Why it's used |
|---|---|---|
| **UI Library** | ![React](https://img.shields.io/badge/-React_18-61DAFB?style=flat&logo=react&logoColor=black) | Component-based architecture for reusable UI across user and admin dashboards |
| **Build Tool** | ![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat&logo=vite&logoColor=white) | Near-instant dev server startup and Hot Module Replacement for fast iteration |
| **Styling** | ![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white) | Utility-first styling for a consistent design system without custom CSS[...] |
| **CSS Processing** | ![PostCSS](https://img.shields.io/badge/-PostCSS-DD3A0A?style=flat&logo=postcss&logoColor=white) | Autoprefixing and Tailwind compilation pipeline |
| **Routing** | ![React Router](https://img.shields.io/badge/-React_Router-CA4245?style=flat&logo=reactrouter&logoColor=white) | Client-side navigation between user, sub-admin, and profile views |
| **Backend** | ![Python](https://img.shields.io/badge/-Python-3776AB?style=flat&logo=python&logoColor=white) ![Flask](https://img.shields.io/badge/-Flask-000000?style=flat&logo=flask&logoColor=white) | API and server-side application logic |
| **Database** | ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?style=flat&logo=mongodb&logoColor=white) | Stores plot listings, user accounts, floor plans, and advertisement/approval records[...] |
| **3D Visualization** | ![Three.js](https://img.shields.io/badge/-Three.js-000000?style=flat&logo=three.js&logoColor=white) | Renders interactive, walkthrough-ready 3D models of generated floor plans[...] |
| **Payments** | ![Stripe](https://img.shields.io/badge/-Stripe-635BFF?style=flat&logo=stripe&logoColor=white) | Secure checkout for plot purchases and advertisement requests |
| **Notifications** | Email & in-app alerts | Automatic notifications for approvals, rejections, compliance flags, and purchase confirmations |
| **Icons** | React Icons | Consistent iconography across the interface |
| **Linting** | ![ESLint](https://img.shields.io/badge/-ESLint-4B32C3?style=flat&logo=eslint&logoColor=white) | Enforces code quality and consistency |

**Design system:** a consistent primary/secondary color palette (`#2F3D57` / `#ED7600`) is applied throughout via Tailwind's theme configuration, giving the platform a cohesive, professional look across the interface.

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

