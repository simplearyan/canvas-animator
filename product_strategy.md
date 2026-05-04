# Canvas Animator: Product Strategy
## The "Hub and Spoke" Architecture

When managing 12+ specialized high-fidelity canvas engines with vastly different aesthetics (Newsroom, Blueprint, Dark Glass), the most effective product strategy is the **Hub and Spoke** model.

### 1. The Hub (The Portal / Studio Launcher)
*   **The Aesthetic**: A unified, clean, and highly professional aesthetic (e.g., modern macOS Glass or clean SaaS UI). It must be neutral to host diverse content.
*   **The Purpose**: Acts as the central command center where users log in, manage projects, and browse the "App Store" of your tools.
*   **The Value**: Promotes the platform as the ultimate "Canvas Animator Suite".

### 2. The Spokes (The Individual Studios)
*   **The Aesthetic**: Maintain their unique, specialized UI themes (e.g., Editorial Chart uses "Newsroom", Waveform uses "Dark Glass").
*   **The Purpose**: Each tool is an isolated, high-performance workspace tailored to put the creator in the exact right mindset for that specific task.
*   **The Value**: Makes each tool feel like premium, specialized software rather than a generic widget.

### 3. Dual Promotion Strategy
Because the studios are technically independent engines launched from the Hub, you can market them in two ways:
*   **Micro-SaaS Marketing**: Create dedicated landing pages for individual tools (e.g., "Editorial Chart Animator Pro"). Run targeted ads to specific niches (journalists, data analysts). When they sign up, they are routed through the Hub and drop seamlessly into the specialized tool.
*   **Platform Marketing**: Promote the entire suite to agencies and content creators as the "Canva for advanced motion graphics," highlighting the massive library of tools available in the Hub.

### Execution Summary
1.  **Do not homogenize the studios.** The distinct styles add massive value and character.
2.  **Build a neutral, premium Hub.** Use the clean macOS style for the template gallery.
3.  **Standardize the hidden UX.** Ensure cross-platform consistency in behaviors (e.g., export buttons always in the top right, synchronized dark mode, shared keyboard shortcuts) using a global `StudioBridge`.
