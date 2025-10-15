# 🎓 2025-S8 Pràctica Acadèmica / 2025-S8 Academic Practice

📍 Yisti 📍

## 📚 Índex / Table of Contents

  1. [Sobre el projecte / About](#1-sobre-el-projecte--about)
  2. [Funcionalitats / Features](#2-funcionalitats--features)
  3. [Tecnologia / Tech Stack](#3-tecnologia--tech-stack)
  4. [Demo en línia / Live Demo](#4-demo-en-línia--live-demo)
  5. [Repositori front / Front repository](#5-repositori-front--front-repository)
  6. [Repositori backend / Backend repository](#6-repositori-backend--backend-repository)
  7. [Instal·lació / Installation](#7-instal·lació--installation)
  8. [Testing](#8-testing)
  9. [Estructura / Structure](#9-estructura--structure)

## 1. Sobre el projecte / About

  **CAT:**

    Aquest projecte, `Yisti`, és una aplicació web completa dissenyada com un panell d'administració interactiu. El frontend està desenvolupat amb `React` i `TypeScript` sobre `Vite`, i ofereix una interfície robusta per gestionar usuaris, esdeveniments de calendari i localitzacions geogràfiques. L'estat global de l'aplicació es gestiona de manera centralitzada amb `Redux Toolkit`.

    Els usuaris poden autenticar-se per accedir a les funcionalitats principals: un **CRUD d'usuaris** complet amb formularis modals, un **calendari interactiu** per crear i gestionar esdeveniments (integrat amb `FullCalendar`), un **mapa dinàmic** (`Mapbox GL`) que permet cercar, marcar i desar ubicacions personalitzades, i una **pàgina de gràfics** per visualitzar dades amb `Chart.js`.

    S'ha posat èmfasi en la qualitat del codi, amb una estructura modular, estils `SASS` seguint la metodologia BEM, i una cobertura de tests completa utilitzant `Jest`.

  **EN:**

    This project, `Yisti`, is a comprehensive web application designed as an interactive admin dashboard. The frontend is built with `React` and `TypeScript` on `Vite`, providing a robust interface for managing users, calendar events, and geographical locations. The global application state is centrally managed with `Redux Toolkit`.

    Users can authenticate to access the main features: a full **user CRUD** with modal forms, an **interactive calendar** for creating and managing events (integrated with `FullCalendar`), a **dynamic map** (`Mapbox GL`) that allows searching, marking, and saving custom locations, and a **graphs page** for data visualization using `Chart.js`.

    Emphasis has been placed on code quality, featuring a modular structure, `SASS` styling following the BEM methodology, and comprehensive test coverage using `Jest`.

## 2. Funcionalitats / Features

  - ✅ **Gestió d'usuaris (CRUD):** Creació, lectura, actualització i eliminació d'usuaris amb diferents rols.
  - ✅ **Calendari Interactiu:** Visualització i gestió d'esdeveniments amb `FullCalendar`.
  - ✅ **Mapa Dinàmic:** Integració amb `Mapbox GL` per cercar adreces, marcar punts i desar localitzacions.
  - ✅ **Visualització de Dades:** Gràfics dinàmics amb `Chart.js` per representar dades de l'aplicació.
  - ✅ **Autenticació:** Sistema de login per a l'accés segur a les rutes privades.
  - ✅ **Testing:** Cobertura de tests per a components, hooks i lògica de Redux.

## 3. Tecnologia / Tech Stack

  - **React**
  - **Axios**
  - **Mapbox GL**
  - **Chart.js**
  - **Vite**
  - **TypeScript**
  - **Redux Toolkit**
  - **Jest**
  - **SASS**
  - **Git & GitHub**

## 4. Demo en línia / Live Demo

  **Live:** 👉 https://yisti.netlify.app
  **Usuari / User:** `guest@gmail.com` 
  **Contrasenya / Password:** `guest2025` 
  
  **CAT:**
    Visita la demo en línia per veure l’aplicació en funcionament.

  **EN:**
    Check out the live demo to see the application in action.

## 5. Repositori front / Front repository

  **Github:** 👉 https://github.com/albertvallsbe/2025-s8-f-yisti ---

## 6. Repositori backend / Backend repository

  **Github:** 👉 https://github.com/albertvallsbe/2025-s8-b-yisti ---

## 7. Instal·lació / Installation

  **CAT:**

    _Segueix aquests passos per clonar el projecte i fer servir el compilador Vite per obrir el projecte en mode de desenvolupament local._

  **EN:**

    _Follow these steps to clone the project and use the Vite compiler to open the project in local developer mode._

  **Requeriments / Prerequisites**

    -   Node.js (versió 20.19.x o superior)
    -   npm (versió 10.5.x o superior)

  ### 1. Clonar el repositori / Clone the repository

    ```bash
    git clone [https://github.com/albertvallsbe/2025-s8-f-yisti.git](https://github.com/albertvallsbe/2025-s8-f-yisti.git)
    ```

  ### 2. Entrar al directori del projecte / Navigate into the project directory

    ```bash
    cd 2025-s8-f-yisti
    ```

  ### 3. Instal·lar dependències / Install dependencies

    ```bash
    npm install
    ```
  ### 4. Crear arxiu d'entorn / Create environment file
    
    Crea un arxiu .env a l'arrel del projecte i afegeix les variables necessàries, basant-te en l'arxiu .env.example.

    ```exemple:
    VITE_API_URL=http://localhost:3006
    VITE_API_TIMEOUT=10000
    VITE_MAPBOXGL_ACCESS_TOKEN=el_teu_token_de_mapbox
    ``` 

  ### 5. Executar el projecte en mode desenvolupament / Run the project in development mode
    ```bash
    npm run dev
    ```

  ### 6. Obre el servidor local de Vite / Open the local Vite server
  
    http://localhost:5173

  ### IMPORTANT:

    És imprescindible clonar, instal·lar i executar abans el projecte de backend. Les instruccions per a fer-ho estàn incloses al README del repositori on es troba el backend. 

    ```Enllaç al repositori:
    https://github.com/albertvallsbe/2025-s8-b-yisti.git
    ```

    ```bash
    git clone https://github.com/albertvallsbe/2025-s8-b-yisti.git
    ```

## 8. Testing
  
  **CAT:**

    El projecte inclou una suite de tests unitaris i d'integració desenvolupada amb Jest i React Testing Library. Per executar tots els tests, fes servir la següent comanda:

  **EN:**

    The project includes a suite of unit and integration tests developed with Jest and React Testing Library. To run all tests, use the following command:

  ```bash
  npm run test
  ```

  També pots executar els tests en mode watch per a un desenvolupament interactiu:
  _You can also run the tests in watch mode for interactive development:_

  ```bash
  npm run test-w
  ```


## 9. Estructura / Structure
  .
  ├── public/
  │   ├── logo.jpg
  │   ├── style.css
  │   └── vite.svg
  ├── src/
  │   ├── app/
  │   │   ├── hooks.ts
  │   │   └── store.ts
  │   ├── assets/
  │   │   ├── images/
  │   │   └── react.svg
  │   ├── classes/
  │   │   └── Location.ts
  │   ├── components/
  │   │   ├── Calendar/
  │   │   │   └── CalendarView.tsx
  │   │   ├── Layout/
  │   │   │   └── Layout.tsx
  │   │   ├── LoginForm/
  │   │   │   ├── LoginForm.test.tsx
  │   │   │   └── LoginForm.tsx
  │   │   ├── Modals/
  │   │   │   ├── __tests__/
  │   │   │   │   ├── EventActionModal.test.tsx
  │   │   │   │   ├── EventFormModal.test.tsx
  │   │   │   │   ├── ModalShell.test.tsx
  │   │   │   │   ├── SaveConfirmationModal.test.tsx
  │   │   │   │   └── SaveLocationModal.test.tsx
  │   │   │   ├── EventActionModal.tsx
  │   │   │   ├── EventFormModal.tsx
  │   │   │   ├── ModalShell.tsx
  │   │   │   ├── SaveConfirmationModal.tsx
  │   │   │   ├── SaveLocationModal.tsx
  │   │   │   └── UserFormModal.tsx
  │   │   ├── Navbar/
  │   │   │   └── Navbar.tsx
  │   │   ├── ReqireAuth/
  │   │   │   └── RequireAuth.tsx
  │   │   ├── RowItem/
  │   │   │   └── RowItem.tsx
  │   │   ├── RowsList/
  │   │   │   └── RowsList.tsx
  │   │   ├── SavedLocationBox/
  │   │   │   └── SavedLocationBox.tsx
  │   │   └── SearchBox/
  │   │       ├── SearchBox.test.tsx
  │   │       └── SearchBox.tsx
  │   ├── elements/
  │   │   ├── Form/
  │   │   │   └── InputForm.tsx
  │   │   └── Toast/
  │   │       ├── Toast.tsx
  │   │       ├── Toasts.tsx
  │   │       └── toastListeners.ts
  │   ├── features/
  │   │   ├── auth/
  │   │   │   ├── authSelectors.ts
  │   │   │   ├── authSlice.test.ts
  │   │   │   └── authSlice.ts
  │   │   ├── calendar/
  │   │   │   ├── __mocks__/
  │   │   │   │   └── calendarSlice.ts
  │   │   │   ├── calendarSelectors.ts
  │   │   │   └── calendarSlice.ts
  │   │   ├── locations/
  │   │   │   ├── __mocks__/
  │   │   │   │   └── locationsSlice.ts
  │   │   │   ├── locationsSelectors.ts
  │   │   │   └── locationsSlice.ts
  │   │   ├── ui/
  │   │   │   ├── uiSelectors.test.ts
  │   │   │   ├── uiSelectors.ts
  │   │   │   ├── uiSlice.test.ts
  │   │   │   └── uiSlice.ts
  │   │   └── users/
  │   │       ├── __mocks__/
  │   │       │   └── usersSlice.ts
  │   │       ├── usersSelectors.ts
  │   │       └── usersSlice.ts
  │   ├── hooks/
  │   │   ├── useCalendar/
  │   │   │   ├── __mocks__/
  │   │   │   │   └── useCalendar.ts
  │   │   │   ├── useCalendar.test.ts
  │   │   │   └── useCalendar.ts
  │   │   └── useMap/
  │   │       ├── __mocks__/
  │   │       │   └── useMap.ts
  │   │       ├── useMap.test.ts
  │   │       └── useMap.ts
  │   ├── pages/
  │   │   ├── CalendarPage/
  │   │   │   ├── CalendarPage.test.tsx
  │   │   │   └── CalendarPage.tsx
  │   │   ├── GraphsPage/
  │   │   │   └── GraphsPage.tsx
  │   │   ├── HomePage/
  │   │   │   └── HomePage.tsx
  │   │   ├── LocationsPage/
  │   │   │   ├── LocationsPage.test.tsx
  │   │   │   └── LocationsPage.tsx
  │   │   ├── LoginPage/
  │   │   │   └── LoginPage.tsx
  │   │   ├── MapPage/
  │   │   │   ├── MapPage.test.tsx
  │   │   │   └── MapPage.tsx
  │   │   └── UsersPage/
  │   │       ├── UsersPage.test.tsx
  │   │       └── UsersPage.tsx
  │   ├── services/
  │   │   ├── __mocks__/
  │   │   │   ├── backend.ts
  │   │   │   └── mapboxApiService.ts
  │   │   ├── backend.ts
  │   │   ├── calendarService.ts
  │   │   └── mapboxApiService.ts
  │   ├── styles/
  │   │   ├── base/
  │   │   ├── components/
  │   │   ├── elements/
  │   │   ├── globals/
  │   │   ├── modals/
  │   │   ├── pages/
  │   │   ├── reset/
  │   │   └── main.scss
  │   ├── types/
  │   │   ├── calendarTypes.ts
  │   │   ├── forms.ts
  │   │   ├── locationTypes.ts
  │   │   ├── types.ts
  │   │   ├── uiTypes.ts
  │   │   └── userTypes.ts
  │   ├── App.tsx
  │   ├── main.tsx
  │   ├── setupTests.ts
  │   └── vite-env.d.ts
  ├── .editorconfig
  ├── .env.example
  ├── .gitignore
  ├── eslint.config.js
  ├── index.html
  ├── jest.config.js
  ├── package-lock.json
  ├── package.json
  ├── README.md
  ├── tsconfig.json
  ├── tsconfig.test.json
  └── vite.config.ts
