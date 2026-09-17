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
  <a href="https://drive.google.com/file/d/17XhV8er3RlMxsNMybm_OdDIoF8aj7Vrn/view?usp=sharing" aria-label="Click to watch the full NextGenArchitect demonstration" style="position: relative; display: inline-block; overflow: hidden; border-radius: 12px; line-height: 0;">
    <img width="700" alt="Click to watch the full NextGenArchitect demo video" src="assets/ai-floorplan-generator.png" style="display: block; max-width: 100%; height: auto; filter: blur(3px); transform: scale(1.03);"/>
    <span style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; background: rgba(0, 0, 0, 0.18); color: white; font: 700 16px/1.2 Arial, sans-serif; text-align: center; text-shadow: 0 1px 3px rgba(0,0,0,.8);">
      <span style="display: flex; align-items: center; justify-content: center; width: 72px; height: 72px; border-radius: 50%; background: #ED7600; box-shadow: 0 3px 12px rgba(0,0,0,.45); font-size: 30px; line-height: 1;">▶</span>
      <span>Click to watch the full demo</span>
    </span>
  </a>
</p>

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
      <b>Interactive 3D View & Walkthrough</b><br/>
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

## 📋 Table of Contents

- [Live Demo](#-live-demo)
- [Technology Stack](#-technology-stack)
- [Key Features](#-key-features)
- [Troubleshooting](#-troubleshooting)

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

## 🌐 Available Routes

| Route | Page |
|---|---|
| `/` | Homepage |
| `/society` | Society listings |
| `/login` | User login |
| `/subadmin` | Sub-admin dashboard |
| `/plot-details` | Plot information |

---

## 🐛 Troubleshooting

<details>
<summary><b>"Cannot find module 'tailwindcss'" error</b></summary>

```bash
cd frontend
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```
</details>

<details>
<summary><b>Port 5173 already in use</b></summary>

```bash
npx kill-port 5173
# or run on a different port
npm run dev -- --port 3000
```
</details>

<details>
<summary><b>Node modules issues</b></summary>

```bash
rm -rf node_modules package-lock.json   # Windows: rmdir /s node_modules & del package-lock.json
npm install
```
</details>

<details>
<summary><b>Git clone permission denied</b></summary>

```bash
git clone https://github.com/Aashfa/NextGenArchitect.git   # use HTTPS, not SSH
```
</details>

<details>
<summary><b>Vite build errors</b></summary>

```bash
rm -rf node_modules/.vite
npm run dev
```
</details>

<details>
<summary><b>CSS/Tailwind not loading</b></summary>

```bash
npx tailwindcss init -p
```
Then confirm `index.css` includes:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
</details>

<details>
<summary><b>Full reset (if nothing else works)</b></summary>

```bash
rm -rf node_modules package-lock.json dist
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm run dev
```
</details>

**Platform notes:**
- **Windows:** if you hit execution policy errors, run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- **macOS/Linux:** you may need `sudo` for global npm installs; keep Node.js updated

---

## 📞 Support

1. Check this README first — most setup issues are covered above
2. Search [existing issues](https://github.com/Aashfa/NextGenArchitect/issues)
3. Open a new issue with your Node/npm version, OS, and the full error message

---

## ✅ Setup Verification Checklist

- [ ] Node.js v16+ installed
- [ ] Repository cloned successfully
- [ ] Dependencies installed without errors
- [ ] Tailwind CSS configured
- [ ] Dev server running on port 5173
- [ ] Homepage loads correctly
- [ ] Navigation works between pages
- [ ] No console errors
- [ ] Hot reload works

---

<p align="center"><b>Happy Coding! 🚀</b></p>
