# My Maps Dashboard - Project Overview
This project is an interactive mapping dashboard built with React and TypeScript, leveraging the Google Maps Platform via the @vis.gl/react-google-maps library. It allows users to visualize geographical data, interact with map layers, and view analytical insights.


## Features

This dashboard is designed with the following key components and functionalities:

1. Navigation Bar (Header)
Location Search: An integrated search field allows users to find and select an address.

Map Centering: Upon selection, the map automatically centers on the chosen location. This simulates integration with a service like Google Places.

2. Interactive Map
The central component of the application, featuring dynamic data layers and interactive functionalities.

Map Layers:
Defined Route: A blue polyline connecting two user-defined points (start and end), following a simulated road path.

Kilometer Milestones (Red Pins): Automatically generated markers along the defined route, simulating points at regular intervals (e.g., every kilometer).

Influence Zones (Pink Circles): Circles drawn around each kilometer milestone, representing an area of influence.

Points of Interest (Black Pins): Randomly generated markers within the influence zones, symbolizing locations of interest or presence of people.

Interactive Functionalities:
Detail Window (Popup):

Clicking a Kilometer Milestone (red pin) opens a floating window.

This popup displays point-specific details (e.g., "Kilometer X", "Estimated flow").

It also integrates a Google Street View preview for that location, offering an immersive visual.

Layer Visibility Controls:

Three independent checkbox controls are available directly on the map.

These allow users to toggle the visibility of Kilometer Milestones, Points of Interest, and Influence Zones.

3. Analytics Panels (Sidebar Widgets)
Located to the right of the map, these panels provide analytical data, primarily focusing on demographic information within the influence zones.

Age Group Chart ("Franjas Etarias"): A horizontal bar chart visualizing the distribution of people by age ranges (0-17, 18-35, 36-55, 56+ years), with bar lengths proportional to simulated population counts.

Socioeconomic Level Chart ("Niveles Socioeconómicos"): Another horizontal bar chart displaying the classification of people by socioeconomic levels (Class A, B, C, D, E).

Points of Interest Summary ("Pontos de Interesse"): A list summarizing the types of Points of Interest present on the map, including their respective counts and descriptive icons.

Data in these panels is generated upon route definition and is static for this evaluation, but the architecture supports dynamic updates.

## Technologies Used
React: For building the user interface.

TypeScript: For enhanced code quality, type safety, and better maintainability.

Vite: A fast build tool for modern web projects.

@vis.gl/react-google-maps: The core library for integrating Google Maps functionalities into React.

Recharts: A composable charting library built with React and D3.

## How it Works
The application's core logic revolves around a central state managed in App.tsx that controls the map's center, drawn paths, and generated data layers.

### Header
The Header component manages a search input. When a user types and selects a location from the simulated suggestions (mockLocations), the selected coordinates are passed up to App.tsx, which then updates the map's center prop, causing the map to pan to the new location.

#### MapContainer
Wraps the Google Map with APIProvider to enable Google Maps API features.

Uses React useState and useRef hooks to manage:

Map Ready State: Ensures map components are rendered only when the Google Map instance is fully loaded.

Path Points: User clicks on the map add/update two points that define the start and end of a route.

Hitos (Milestones): Generated in App.tsx by interpolating points along the defined route at simulated kilometer intervals.

Puntos de Interes (POIs): Randomly generated within circular zones around the hitos.

Circles (Influence Zones): google.maps.Circle objects are dynamically added around each hito based on visibility toggles.

The MapMarkers component is responsible for rendering all markers (path points, hitos, and POIs).

It utilizes AdvancedMarker and Pin components from @vis.gl/react-google-maps.

Clicking a path point removes it, allowing the user to redefine the route.

Clicking a hito triggers an InfoWindow displaying details and attempting to load a StreetViewPanorama via google.maps.StreetViewService.

The MapControls component provides the interactive checkboxes to toggle the visibility of the map layers.

### Sidebar
The Sidebar component receives processed data for age groups, socioeconomic levels, and POI summaries.

It utilizes ChartWidget components, which in turn use GenericBarChart (powered by Recharts) to render the analytical data as horizontal bar charts.

Visibility of these widgets is controlled by props, aligning with the map's layer visibility settings.

## Types
All critical data structures are defined using TypeScript interfaces and types in src/types.ts to ensure type safety and clarity across the application. Key types include:

SearchProps

UserPath

MarkerData

MapControlsProps

MarkerProps

SidebarProps

PoiData

HitosData

AgeGroupData

SocioeconomicData

MapContainerProps

GenericBarChartProps

ChartWidgetProps

MockMapMarkersProps


## Relevant Documentation
For deeper understanding of the libraries and concepts used:

- [@vis.gl/react-google-maps](https://visgl.github.io/react-google-maps/docs/get-started)
- [Markers Guide](https://visgl.github.io/react-google-maps/docs/guides/interacting-with-google-maps-api#refs)
- [Autocomplete Example](https://github.com/visgl/react-google-maps/blob/main/examples/autocomplete/src/autocomplete-control.tsx)
- [Polyline Component in Examples](https://github.com/visgl/react-google-maps/blob/776663c9ff21ba2b6c59f876f2a3cbec7f5e95cd/examples/drawing/src/types.ts#L69)
- [Street View Library Hook](https://visgl.github.io/react-google-maps/docs/api-reference/hooks/use-maps-library)

### Google Maps Platform Documentation:

- [Street View API](https://developers.google.com/maps/documentation/javascript/streetview)


## Getting Started
To run this project locally, follow these steps:

Clone the repository:

Bash

git clone <your-repo-url>
cd my-maps-dashboard
Install dependencies:

Bash

npm install
# or
yarn install
Set up Google Maps API Key:
Create a .env file in the root of your project and add your Google Maps API key:

VITE_Maps_API_KEY=YOUR_API_KEY_HERE
Replace YOUR_API_KEY_HERE with your actual API key obtained from Google Cloud Console.

Run the development server:

Bash

npm run dev
# or
yarn dev
The application will typically be available at http://localhost:5173.
  

## Running Tests
To run the unit and integration tests for the project:

Bash

npm run test
# or
yarn test

Currently, two official plugins are available:

[@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh

[@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh