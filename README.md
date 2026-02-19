# VisionAR

A Modern AR Shopping Experience — UI/UX Prototype

---

## Overview

**VisionAR** is a Final Year Project (FYP) application built with [React Native](https://reactnative.dev/) and [Expo](https://expo.dev/). This project is a UI/UX prototype focused on delivering a beautiful, intuitive, and modern interface for an AR-powered shopping app. The goal is to visualize how a next-generation AR shopping experience could look and feel on mobile devices — letting users see products in their real space before buying.

> **Note:** This app is a UI/UX prototype. Core backend and AR logic are not yet implemented.

---

## Features

- **Clean, modern UI** — Responsive design with smooth navigation and transitions
- **Light & dark themes** — Themed components that adapt to system preference
- **Authentication** — Login and signup screens with Firebase integration
- **Product browsing** — Shop with search, categories, and product details
- **AR-focused flows** — "View in AR" CTAs, AR guides, and session prompts
- **Cart & wishlist** — Add to cart, wishlist products, and manage orders
- **Profile** — User profile, theme toggle, AR sessions, and quick actions

---

## Screens

| Screen | Description |
|--------|-------------|
| **Home** | AR call-to-action, "How it works" steps, AR usage guide |
| **Shop** | Product list with search, category filters, and ratings |
| **Product Detail** | Images, pricing, "View in AR" and "Add to cart" actions |
| **Cart** | Cart items, quantity stepper, order summary, checkout |
| **Profile** | Avatar, stats (AR sessions, wishlist, cart), theme toggle, logout |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Expo Go](https://expo.dev/go) app on your phone (optional, for testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/syedqalbe-create/VisionAR.git
   cd VisionAR
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the Expo development server**
   ```bash
   npx expo start
   ```

4. **Run on your device**
   - Scan the QR code with Expo Go (iOS/Android)
   - Or press `a` for Android emulator / `i` for iOS simulator
   - Or press `w` for web

---

## Project Structure

```
VisionAR/
├── app/                    # Expo Router screens
│   ├── (auth)/             # Login, signup
│   ├── (tabs)/             # Home, Shop, Cart, Profile
│   └── product/            # Product detail [id]
├── assets/                 # Images, fonts, icons
├── components/             # Reusable UI components
├── constants/              # Colors, theme values
├── context/                # AuthContext, ThemeContext
├── hooks/                  # useColorScheme, useThemeColor
├── utils/                  # Storage (wishlist, cart)
└── android/                # Native Android project
```

---

## Tech Stack

- **Expo** — Development platform and tooling
- **React Native** — Cross-platform UI
- **Expo Router** — File-based routing
- **Firebase** — Authentication (configured)
- **TypeScript** — Type-safe JavaScript

---

## Acknowledgments

- [Expo](https://expo.dev/) for the rapid development platform
- [React Native](https://reactnative.dev/) for cross-platform UI
- [Ionicons](https://ionic.io/ionicons) for icons

---

> Designed and developed as part of a Final Year Project to explore modern mobile app UI/UX and AR shopping concepts.
