# Frontend Documentation

## Overview

The frontend is built using Next.js, a React framework for building performant web applications.

## Architecture

The frontend follows a component-based architecture. The main components are:

*   **Pages:** Located in the `src/app` directory, these are the entry points for different routes in the application.
*   **Components:** Reusable UI elements that are used throughout the application.
*   **Contexts:** Provide a way to share data between components without having to pass props manually at every level.
*   **Hooks:** Reusable functions that encapsulate logic and can be used in multiple components.
*   **Services:** Handle API calls and data fetching.

## Key Components

*   **Navbar:** Located in `src/app/components/navbar`, this component displays the navigation bar at the top of the page. It includes links to different pages, a language selector, and a login button.
*   **Footer:** Located in `src/app/components/footer`, this component displays the footer at the bottom of the page. It includes contact information, quick links, and social media links.
*   **SearchEngine:** Located in `src/app/components/search-engine`, this component provides a search form for finding trips and activities.
*   **TripsForm:** Located in `src/app/components/search-engine/components/trips-form`, this component displays the form for searching trips.
*   **ActivitiesForm:** Located in `src/app/components/search-engine/components/activities-form`, this component displays the form for searching activities.
*   **LoginModal:** Located in `src/app/components/login-modal`, this component displays a modal for user login and registration.
*   **Carousel:** Located in `src/app/home/caroussel`, this component displays a carousel of images on the home page.
*   **Updates:** Located in `src/app/home/updates`, this component displays recent updates on the home page.
*   **Newsletter:** Located in `src/app/home/newsletter`, this component allows users to subscribe to the newsletter.

## Routing

The application uses Next.js's file-based routing system. The files in the `src/app` directory define the different routes in the application. For example, the `src/app/page.tsx` file defines the home page, and the `src/app/trips/page.tsx` file defines the trips page.

## State Management

The application uses React's built-in state management features, as well as context providers for sharing state between components.

*   **AuthContext:** Located in `src/context/AuthContext.tsx`, this context provides authentication state to the application.

## API Interactions

The frontend interacts with the backend API using the functions defined in the `src/services/internal_services` directory. These functions handle making HTTP requests to the backend and parsing the responses.

## Internationalization

The application supports internationalization using the `i18next` library. The translations are stored in the `src/locales` directory.
