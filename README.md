# NextGenArchitect 🏗️

**An AI-powered platform for custom floor plan generation and seamless plot purchasing.**

NextGenArchitect lets users design, validate, and approve architectural projects through an intuitive interface — combining generative algorithms for automated floor plan creation with a full plot-buying workflow.

<p align="left">
  <img src="https://img.shields.io/badge/React-18.0+-61DAFB?style=flat&logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-4.0+-646CFF?style=flat&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.0+-06B6D4?style=flat&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat" alt="MIT License"/>
</p>

---

## 🎬 Live Demo

<p align="center">
  <a href="https://drive.google.com/file/d/17XhV8er3RlMxsNMybm_OdDIoF8aj7Vrn/view?usp=sharing" style="position: relative; display: inline-block;">
    <img width="700" alt="Watch the NextGenArchitect demo video" src="https://github.com/user-attachments/assets/a3442d77-8f98-4e8c-acec-6abbe411b7a7" style="display: block; max-width: 100%; height: auto;" />
    <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: flex; align-items: center; justify-content: center; width: 64px; height: 64px; border-radius: 50%; background: rgba(237, 118, 0, 0.95); color: white; font-size: 30px; line-height: 1;">▶</span>
  </a>
</p>

<p align="center"><i>Click the thumbnail or the play button above to watch the full demo — from browsing societies to generating and customizing a floor plan in 3D.</i></p>

---

## 📸 Screenshots

<table>
  <tr>
    <td width="50%">
      <b>AI Floor Plan Generator</b><br/>
      <img src="assets/ai-floorplan-generator.png" alt="AI Floor Plan Generator"/>
      <p>Configure a plot, auto-generate compliant floor plans, and browse multiple layout variations ranked by space efficiency.</p>
    </td>
    <td width="50%">
      <b>2D Floor Plan Editor</b><br/>
      <img src="assets/floorplan-editor.png" alt="2D Floor Plan Editor"/>
      <p>Fine-tune the generated layout — add doors, windows, stairs, and rooms with free positioning on an interactive canvas.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <b>Interactive 3D View &amp; Walkthrough</b><br/>
      <img src="assets/3d-view.png" alt="3D View and Walkthrough"/>
      <p>Explore the design in 3D with customizable colors, lighting, and a walkthrough mode — then export as PDF.</p>
    </td>
    <td width="50%">
      <b>Advertisement Management</b><br/>
      <img src="assets/advertisement-management.png" alt="Advertisement Management Dashboard"/>
      <p>Admins review, approve, or reject advertisement requests with payment status and duration tracked per listing.</p>
    </td>
  </tr>
</table>

---

## 🛠️ Technology Stack

NextGenArchitect is built as a modern, component-driven single-page application, optimized for fast local development and a smooth production build.

| Layer | Technology | Why it's used |
|---|---|---|
| **UI Library** | React 18 | Component-based architecture for reusable UI |
| **Build Tool** | Vite | Fast development server and production builds |
| **Styling** | Tailwind CSS | Consistent utility-first design system |
| **Routing** | React Router | Client-side navigation |
| **Backend** | Python / Flask | API and application services |
| **Database** | MongoDB | Stores plots, users, floor plans, and approvals |
| **3D Visualization** | Three.js | Interactive floor-plan visualization and walkthroughs |
| **Payments** | Stripe | Secure plot purchases and advertisement requests |

**Design system:** the primary and secondary colors `#2F3D57` and `#ED7600` are applied throughout the platform via Tailwind's theme configuration.

---

## 🎯 Key Features

### 🏠 For Users
- Homepage with an image carousel
- Society-integrated plot listings
- AI-generated floor plans based on plot size and preferences
- Interactive 3D view and walkthrough
- Floor-plan customization with doors, windows, stairs, rooms, and furniture
- Save, edit, and delete floor plans
- Secure plot purchasing with Stripe
- Advertisement requests with supporting plans and documents
- Automatic alerts and email notifications
- Secure authentication and responsive design

### 👨‍💼 For Admins
- Analytics dashboard
- Advertisement approval
- Society management
- Platform control and monitoring

### 🏘️ For Sub-Admins
- Society registration
- Plot details upload and management
- Society-specific floor-plan compliance checks
- Floor-plan approval workflow
- Edit and re-upload approved plans
- Advertisement plan subscriptions

---

## 📋 Quick Start

Install the frontend dependencies and start the development server:

```bash
cd frontend
npm install
npm run dev
```

See the project configuration and environment files for backend setup instructions.

---

## 🤝 Contributing

Contributions are welcome. Please open an issue to discuss a change before submitting a pull request.
