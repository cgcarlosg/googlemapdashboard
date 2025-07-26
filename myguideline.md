## Header Component

The Header component renders a box that allows the use of [`Autocomplete`] (https://github.com/visgl/react-google-maps/blob/main/examples/autocomplete/src/autocomplete-control.tsx) in order to select an address and search for it on the map

[`ExampleAutocomplete search`](https://visgl.github.io/react-google-maps/examples/autocomplete) function ControlPanel

## 🗺️ MapContainer Component

### Purpose

The `MapContainer` component renders a Google Map using the [`@vis.gl/react-google-maps`](https://visgl.github.io/react-google-maps/docs/get-started) library. It allows the user to click on the map and dynamically place markers.

To add markers follow
[`markers`](https://visgl.github.io/react-google-maps/docs/guides/interacting-with-google-maps-api#refs)

---

### Features

- Renders a Google Map centered on Bogotá, Colombia.
- Adds a marker each time the user clicks on the map.
- Removes a marker when it is clicked.
- Uses the `AdvancedMarker` and `Pin` components provided by the library.

---

### How it works

- It wraps the map with `APIProvider` to inject the API key.
- Uses React `useState` to manage a list of markers.
- On each map click (`onClick`), it reads the coordinates from the `MapMouseEvent` and adds a new marker to the state.
- Each marker is rendered with an `AdvancedMarker` component and removed on click.

---

### Technologies

- React
- TypeScript
- [@vis.gl/react-google-maps](https://visgl.github.io/react-google-maps/docs/get-started)

---

### Types

Marker data (type MarkerData) is defined in `types.ts`:

MarkerData

