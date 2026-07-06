# Community Preset Sharing Architecture

The goal is to allow users to share and browse community presets (Text, Shapes, Drawings) directly within the app, while maintaining **zero server load**, **no backend costs**, and **no user login requirements**. Since the app is hosted on GitHub Pages, we can leverage GitHub's ecosystem to act as our backend.

## Proposed Architecture: The "Static Backend" Approach

We can achieve a fully functional community tab using a combination of **Google Forms** (or GitHub Issues) and **GitHub Actions**.

### 1. In-App UI Updates (What the user sees)
*   **Export/Import Buttons:** Add a download icon to each saved preset in the "Local" tab. Clicking it downloads the preset as a `.json` file (or copies a minified JSON string to the clipboard). We will also add an "Import Preset" button to load these files.
*   **Sub-tabs:** In both the Text Presets and Shapes tabs, we will add a toggle at the top to switch between `Local` (saved in localStorage) and `Community` (fetched from the cloud).
*   **"Share with Community" Button:** A prominent button in the Local tab that says "Share to Community". 

### 2. The Submission Flow (Zero Login)
When a user clicks "Share to Community":
1. The app generates the JSON data for their preset (including the base64 preview image).
2. The user is redirected to a free **Google Form**.
3. The form asks for a "Preset Name" and has a field to paste the JSON data. (We can even pre-fill the form using URL parameters, though very large JSON strings with images might require them to copy/paste or upload the `.json` file).

### 3. The Automation (Zero Server Load)
*   We set up a **GitHub Action** in your repository that runs automatically on a schedule (e.g., every 6 hours or once a day).
*   The Action script connects to the Google Form's spreadsheet (or uses a free Google Sheets API key).
*   It downloads the new submissions, validates the JSON data to ensure it's safe and doesn't break the app, and merges them into a single `community-presets.json` file.
*   The Action automatically commits and pushes this updated JSON file to your GitHub repository.

### 4. Fetching Presets in the App
*   When a user clicks the "Community" sub-tab, the app simply makes a standard `fetch()` request to `https://your-github-pages-url/community-presets.json`.
*   Since this is just a static JSON file served by GitHub Pages, it can handle infinite traffic with absolutely **zero server load** or cost to you.

## Alternative: The "Reddit/Discord" Approach
If you don't want to deal with GitHub Actions and automated curation, the easiest and most community-driven approach is:
1. Add an **Export** button to download a preset as a `.firethumb` or `.json` file.
2. Add an **Import** button to load a file.
3. Link the "Community" tab to a dedicated Discord Server, Subreddit, or a simple separate GitHub repo where users manually upload and share their files with each other. 

---

## User Review Required

> [!IMPORTANT]
> **Which submission method do you prefer?**
> **Option A (Seamless Integration):** We build the Export/Import UI, the Local/Community sub-tabs, and I will write the GitHub Action Python script for you. You will just need to set up a Google Form and drop the script into your repo.
> **Option B (Manual File Sharing):** We just build the Export/Import UI and rely on an external platform (like Discord or Reddit) for users to share files manually.

## Proposed Next Steps for Implementation (If Option A)
1.  **Modify UI:** Add Local/Community sub-tabs to Text and Shapes panels.
2.  **Add Export/Import:** Implement logic to download a preset as a `.json` file and read a `.json` file back into the local storage.
3.  **Fetch Logic:** Implement the `fetch()` call for the Community tab to read a static `community.json` file from the repo.
4.  **Create Action Script:** I will write the GitHub Action script that you can use to automate the merging of community submissions.
