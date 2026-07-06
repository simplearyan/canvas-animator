## 🔥 Studio Pro - Ultimate Thumbnail Maker - Mobile Design Tool

Studio Pro is a professional, web-based thumbnail and animation creator built with **Tailwind CSS v4** and **HTMX**. It offers a rich, layered editing experience for creating high-quality YouTube thumbnails and animations, with a focus on mobile-first responsive design and advanced editing features.

[![Live Preview](https://img.shields.io/badge/Preview-Live-green)](https://thefireworks.in/design/firethumb)
[![GitHub](https://img.shields.io/badge/GitHub-Repo-black)](https://github.com/aryan-900/firethumb)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Features

### ✨ What You'll Get

- **Premium Editing Interface**:
  - **Layer-Based Editing**: Advanced layers panel with reordering (Bring Forward/Backward), opacity control, and blend modes.
  - **Color Picker**:
    - 🔥 **Gradient Generator**: Create multi-color linear and radial gradients with live previews.
    - 🎨 **Color Picker**: Professional color selection with HEX input.
  - **Effects**:
    - **Dropshadow**: Distance, blur, and angle control.
    - **Outline**: Inner/outer stroke with custom color and width.
  - **Transform**:
    - **Smart Scaling**: Maintain aspect ratio with visual handles.
    - **Rotation & Crop**: Precise manipulation tools.
  - **AI Tools**: Built-in prompts for AI image generation.

- **Responsive Design (Mobile-First)**:
  - **Three Breakpoints**: Optimized for Mobile (<640px), Tablet (640px-1024px), and Desktop (1024px+).
  - **Flexible Canvas**: Adapts to different screen sizes while maintaining design integrity.

- **Community Ecosystem**:
  - **Community Tab**: Import custom presets shared by other users.
  - **Share**:
    - Submit your own presets (text styles, custom shapes) to the community database.
    - **Two-Phase Upload**: First to server, then trigger from client to update JSON.

- **Advanced Canvas Features**:
  - **Unlimited Canvas**: Zoom in and out with a dedicated navigation HUD.
  - **Grid System**: Toggleable grid with adjustable snap sensitivity.
  - **Guides**: Smart guides that snap to canvas and other elements.
  - **Smart Resize**: Auto-adjust canvas size when dragging from edges.
  - **Auto-Reorder**: Layers automatically reorder when using Bring Forward/Backward.
  - **Image Tools**: Paste images directly, with smart downscaling to prevent browser crashes.
  - **Color Picker Integration**: Works seamlessly with the advanced gradient/color generator.
  - **Import/Export**: Download projects as JSON or export as high-quality images.

- **Premium Presets**:
  - **AI-Powered Presets**: Auto-generated with AI-suggested names and colors.
  - **Modern Styles**: Includes Neon, Chrome, Gradients, and more.
  - **3D Text Support**: Advanced manipulation for depth effects.
  - **Outline Presets**: Specialized outlines for polished looks.

- **Performance**:
  - **HTMX**: Partial page updates for a snappy, app-like feel without full page reloads.
  - **Optimized Rendering**: Debounced rendering to save resources.
  - **Auto-Saving**: Frequent local saves to prevent data loss.

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari).
- **Local Development**: Ensure your `community-presets.json` has data in it, otherwise community shapes/texts will not load. You can sync it with the production file.

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd firethumb
    ```

2.  Open `studio_pro.html` in your browser.
    *For local development, using a simple HTTP server (like VS Code Live Server or Python's `http.server`) is recommended.*

## Usage

### Basic Controls

- **Add Elements**: Use the "Text", "Image", or "Shape" buttons in the left toolbar.
- **Layers Management**:
  - Click an element to select it.
  - Use the "Bring Forward", "Send Backward", "Bring to Front", "Send to Back" buttons in the layers panel.
- **Editing**:
  - **Text**: Click the "Edit Text" button in the properties panel.
  - **Shapes**: Use the "Edit Shape" button to modify points and curves.
  - **Properties**: Adjust size, position, rotation, opacity, and effects in the right-hand panel.

### Advanced Features

- **Gradient Generator**: Click the color swatch in the properties panel to open the advanced gradient tool.
  - Add/remove stops by clicking the gradient bar.
  - Adjust colors and positions using the sliders.
  - Preview updates live.

- **Community**: Switch to the "Community" tab to browse and import presets shared by other users.
  - Click a preset to add it to your canvas.
  - Use the "Share" button to contribute your own designs.

### Uploading Presets

1.  Create your design with text and shapes.
2.  Open the **Share** tab (right-hand panel).
3.  Click **Send to Community** (this uploads the preset to the server).
4.  Wait for the "Upload successful" message.
5.  Click **Update JSON** (this updates the `community-presets.json` file).
6.  Your preset is now live in the Community tab!

### Responsive Editing

- Use the **Breakpoint Toggles** in the top-right corner to switch between Mobile, Tablet, and Desktop views.
- Edit your design in each breakpoint to ensure it looks perfect on all devices.
- The canvas size will adjust automatically based on the selected breakpoint.

## Technical Details

### Architecture

- **Main File**: `studio_pro.html` - Contains the entire UI, canvas logic, and HTMX endpoints.
- **Community Database**: `community-presets.json` - Stores community-shared text and shape presets.
- **Server Endpoints** (defined in `studio_pro.html`):
  - `add-text`, `add-shape`, `update-shape`, `add-preset`, `update-preset`: Backend endpoints for managing presets.

### Data Structure

**Elements**: Each element on the canvas has a unique ID and properties like:

```javascript
{
    "id": "el_1678886400000",
    "type": "text", // "text", "image", or "shape"
    "content": "Hello World", // For text elements
    "shape": { ... }, // For shape elements (path data)
    "x": 400,
    "y": 300,
    "scale": 1,
    "rotation": 0,
    "color": "#ffffff",
    "fontFamily": "Bangers",
    "fontSize": 72,
    "fontWeight": "normal",
    "blendMode": "source-over",
    "dropshadow": { "enabled": true, "color": "#000000", "blur": 10, "offsetX": 5, "offsetY": 5 },
    "stroke": { "enabled": false, "color": "#ffffff", "width": 5 }
}
```

**Presets**:Stored in `community-presets.json`:

```javascript
{
  "shapes": {},
  "text": {},
  "shadows": {},
  "strokes": {}
}
```

### Community Data Flow

**Client -> Server -> JSON**

1.  **UI Interaction**: User clicks "Send to Community" in the Share tab.
2.  **HTMX POST**: Sends the preset data to the `add-preset` endpoint.
3.  **Server Processing**: The server appends the new preset to the JSON file.
4.  **Client Update**: On success, the UI displays "Upload successful".
5.  **Finalization**: User clicks "Update JSON" to write the changes to the file.

## Supported Browsers

- Chrome 70+
- Firefox 60+
- Edge 79+
- Safari 12+
- **Mobile Support**: Fully functional on mobile browsers with touch controls.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - See [LICENSE](LICENSE) for

- **Text and Shape Presets**: Easily add and manipulate custom text and geometric shapes on the canvas.
- **Community Ecosystem**: 
  - **Community Tab**: Browse and import custom presets created and shared by other users.
  - **Share**: Submit your own presets (text styles, custom shapes) to the community database.
- **Layers Management**: Organize elements precisely using the built-in layers panel.
- **Canvas Controls**: Customize dimensions, background colors, and export settings for your designs.
- **Responsive & Modern UI**: Sleek dark mode design with Tailwind CSS and Phosphor Icons for a premium look and feel.

## Architecture

- `studio_pro.html`: The main entry point and UI for the Studio Pro application.
- `community-presets.json`: The database file used to store and load community-submitted shapes and text presets.

## Local Development

If you are running the application locally (e.g., using Live Server on `127.0.0.1:5500`), ensure your `community-presets.json` has data in it, otherwise community shapes/texts will not load. You can sync it with the production file using `curl` or `Invoke-WebRequest`.
