# Studio Pro Design System & UX Analysis

This document outlines the core design tokens, structural choices, UI depth strategies, and UX patterns utilized within the **Studio Pro** (`studio_pro.html`) application.

## 1. Color Palette

Studio Pro uses a highly tailored Tailwind CSS configuration to achieve a premium, high-contrast look in both Light and Dark modes.

### Neutral Scale (`pro`)
A custom grayscale palette used for the application's structural skeleton, panels, text, and borders.
- **50**: `#f8f8f8` *(Light mode app background)*
- **100**: `#eeeeee` *(Light mode secondary backgrounds, hovered inputs)*
- **200**: `#dddddd` *(Light mode canvas workspace area)*
- **300**: `#bbbbbb` *(Light mode borders)*
- **400**: `#888888` *(Muted text)*
- **500**: `#555555` *(Secondary text, icons)*
- **600**: `#333333` *(Primary text in light mode)*
- **700**: `#262626` *(Dark mode borders)*
- **800**: `#1a1a1a` *(Dark mode elevated panels/headers)*
- **900**: `#111111` *(Dark mode app background / sidebar)*
- **950**: `#0a0a0a` *(Dark mode canvas workspace area)*

### Primary Accent (`brand`)
An Indigo/Blue spectrum used strictly for active states, prominent buttons, bounding boxes, and branding.
- **50 to 400**: Active state backgrounds and soft highlights.
- **500**: `#6366f1` *(Primary action color, active tabs, floating action buttons)*
- **600 to 700**: Hover states for primary buttons.

---

## 2. Typography

- **App UI Font**: `Plus Jakarta Sans` provides a sleek, modern, and highly legible interface.
- **Canvas Text Rendering**: A robust suite of Google Fonts is loaded specifically for user-generated text on the canvas: *Rubik, Montserrat, Oswald, Bebas Neue, Bangers, Fredoka, Inter, and Lora.*

---

## 3. UI Depth, Shadows, and Borders

The application recently transitioned from heavy shadows to a **Flat, Modern Aesthetic** relying heavily on borders for structure.

- **Structural Layout (Header & Sidebar)**: Completely devoid of drop shadows. Instead, separation is achieved using precise 1px borders (`border-b`, `border-r`) utilizing `border-pro-200` in light mode and `border-pro-700` in dark mode.
- **Canvas Workspace**: Uses a highly customized, extremely subtle inner shadow (`shadow-[inset_0_2px_10px_rgba(0,0,0,0.03)]` / `dark:shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]`) to visually recess the working area without making it feel muddy or heavy.
- **Contextual Top Toolbar**: Sits at the highest elevation (`z-20`). Because it floats over the canvas, it uses a heavy `shadow-2xl` coupled with a glassmorphism effect (`backdrop-blur-md` and slight opacity `bg-pro-900/95`) to ensure maximum contrast against the user's artwork.

---

## 4. Layout Structure

- **Header**: Contains branding, global theme toggles, and primary export actions. It is intentionally kept clean.
- **Sidebar (Left)**: Houses grouped tooling. Recently refactored so that **Canvas Settings** (Grid Guides and Aspect Ratios) live cleanly inside a dedicated "Canvas" tab instead of cluttering the global header.
- **Scrollbar Stability**: The sidebar panels utilize `scrollbar-gutter: stable;` to ensure that content does not horizontally jump or shift when the scrollbar appears/disappears between tabs of different heights.
- **Properties Panel (Right)**: Contextually dynamic based on selection.

---

## 5. UX Patterns & Interactions

- **Contextual UI**: 
  - **Single Selection**: The right-hand property panel opens, allowing deep, advanced edits (3D extrusion, specific font adjustments, exact pixel cropping).
  - **Multi-Selection**: The property panel intentionally hides to avoid conflicting values, and the Floating Top Action Bar handles bulk actions (Scaling, Rotating, Color changes).
- **Progressive Disclosure**: Advanced properties (like Drop Shadow and 3D Extrusion) are hidden behind sleek toggle-able accordion menus within the property panel.
- **Smart Tooltips/Hints**: The canvas features an animated "Drag to arrange" hint that automatically and permanently fades out (`opacity-0`) as soon as the user executes their first successful drag operation.
- **Multi-Drag Synchronization**: When multiple elements are selected, the application calculates and maintains their exact relative coordinates during drag events, allowing grouped dragging without explicitly grouping the nodes.
