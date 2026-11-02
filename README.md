## Overview

AUTRAIL is intended to help fleet operators manage and monitor vehicle-related information through a centralized interface. The project is organized to support the gradual addition of fleet management modules while keeping the codebase maintainable.

### Project objectives

- Provide a clear overview of fleet operations.
- Organize vehicle-related information in one application.
- Support maintenance and fuel-management workflows.
- Provide a foundation for vehicle location tracking.
- Support geofencing and location-based alerts.
- Present operational information through a consistent dashboard experience.

## Features and planned modules

The following describes the project direction. Check the current application to confirm which functions are implemented and operational.

| Module | Purpose |
|---|---|
| Fleet Dashboard | Centralized overview of fleet information and key metrics |
| Vehicle Management | Organize vehicle details and related information |
| Maintenance Scheduling | Plan services and track maintenance history |
| Fuel Management | Record fuel purchases and review fuel expenses |
| GPS Tracking | Display vehicle locations when a real location source is connected |
| Geofencing | Define geographical zones and detect entry/exit events |
| Analytics | Present fleet-related metrics and trends |

**GPS note:** Genuine live tracking requires a GPS device, a mobile location source with permission, or an external tracking-provider integration. Simulated locations must be clearly labelled as demo data.

---

## Technology Stack

Based on the repository structure:

- **React** – component-based user interface
- **Vite** – development server and build tooling
- **JavaScript / JSX** – application logic and components
- **CSS** – application styling
- **Tailwind CSS** – utility-first styling configuration
- **PostCSS** – CSS processing

The repository also contains `src/components`, `src/pages`, `src/hooks`, `src/services`, `src/data`, and `state`, which provide a modular foundation for the application.

> Additional libraries and backend services should be listed here once confirmed from `package.json` and the actual implementation.

## Repository Structure

```text
AUTRAIL/
├── dist/                  # Generated production build
│   ├── assets/
│   └── index.html
│
├── legacy/                # Earlier HTML/CSS/JavaScript version
│   ├── index.html
│   ├── script.js
│   └── styles.css
│
├── src/                   # Main React application
│   ├── components/        # Reusable UI components
│   ├── data/              # Application data and configuration
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page-level components
│   ├── services/          # API and service logic
│   ├── App.jsx            # Root application component
│   ├── index.css          # Global styles
│   └── main.jsx           # React entry point
│
├── state/                 # Application state-related files
├── index.html             # Vite HTML entry point
├── script.js              # Root-level JavaScript file, if used
├── styles.css             # Root-level stylesheet, if used
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
├── vite.config.js         # Vite configuration
├── package.json           # Project scripts and dependencies
├── package-lock.json      # Locked dependency versions
├── LICENSE                # MIT License
└── README.md              # Project documentation
```

`dist/` is generated output from the build process. In most development workflows, it should be regenerated with the build command rather than edited manually. The `legacy/` directory preserves the earlier version and is separate from the main React application.

---

## Getting Started

### Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (included with Node.js)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/AUTRAIL.git
```

Replace `YOUR_USERNAME/AUTRAIL` with the actual GitHub repository URL.

### 2. Open the project directory

```bash
cd AUTRAIL
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Vite will print the local development URL in the terminal. Open that URL in your browser.

### 5. Create a production build

```bash
npm run build
```

### 6. Preview the production build

```bash
npm run preview
```

---

## Configuration

If the application uses external APIs or a backend, create a `.env` file in the project root and add the environment variables required by the code.

Example format:

```env
VITE_API_BASE_URL=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Only keep variables that the application actually uses. Do not commit `.env` files, passwords, private API keys, or server-side secrets. Never expose a Supabase service-role key in frontend code.

---

## Development Notes

- The main application entry point is `src/main.jsx`.
- The root React component is `src/App.jsx`.
- Reusable interface elements belong in `src/components/`.
- Page-level views belong in `src/pages/`.
- Shared React logic can be organized in `src/hooks/`.
- API integrations and data-access logic belong in `src/services/`.
- Keep application state organized in the existing `state/` structure.
- Preserve the established AUTRAIL interface and component conventions when adding modules.

Before adding a new feature, check whether a similar component, service, hook, or data model already exists.

## Roadmap

Potential areas of continued development:

- Complete vehicle and driver management workflows.
- Automated maintenance scheduling and service reminders.
- Fuel purchase records and expense analytics.
- GPS provider or device integration.
- Journey history and location visualization.
- Circular and polygon geofences.
- Entry, exit, and restricted-zone alerts.
- Role-based access and secure data permissions.
- Reporting and export functionality.
- Automated tests and deployment configuration.

The roadmap is a development direction, not a claim that every item is currently implemented.

## Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make focused changes that follow the existing project structure.
4. Test your changes.
5. Submit a pull request with a clear description.

## Author

**Utkarsh**

GitHub: https://github.com/utkarshx08

## License

This project is licensed under the **MIT License**. See the [`LICENSE`](LICENSE) file for details.

---

<p align="center">
  <strong>AUTRAIL</strong><br />
  Fleet operations, organized in one place.
</p>
"""

license_text = """MIT License

Copyright (c) 2026 Utkarsh

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies
of the Software, and to permit persons to whom the Software is furnished to
do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
"""

base = Path("/mnt/data")
(base / "README.md").write_text(readme, encoding="utf-8")
(base / "LICENSE").write_text(license_text, encoding="utf-8")
print("Created README.md and LICENSE.")
