/**
 * _config.js - Configuration for Canvas Animator Studio (Blueprint Edition)
 */
module.exports = {
    title: "Animator Studio",
    description: "Blueprint repository for high-fidelity animation components, whiteboard engines, and design prototypes.",
    baseUrl: ".",
    
    // Theme colors for the Blueprint style
    theme: {
        primary: "#0047AB", // Blueprint Blue
        secondary: "#e0e8f0", // Light Paper Blue
        text: "#002a66",
        accent: "#ff6b6b", // Pencil Red for annotations
        gridLine: "rgba(0, 71, 171, 0.1)"
    },

    // Metadata overrides for top-level folders
    categories: {
        'design-demos': {
            label: 'Animation Lab',
            icon: '🧪',
            desc: 'Experimental engines for lip-sync, charts, and procedural motion.'
        },
        'Borads': {
            label: 'Whiteboard Engines',
            icon: '📋',
            desc: 'Infinte canvas and artistic whiteboard prototypes.'
        }
    }
};
