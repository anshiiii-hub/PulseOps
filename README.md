# PulseOps — Real-Time Operational Intelligence Platform

PulseOps is an operational intelligence platform that monitors physical inventory quantities and human capital attendance in real time. It blends proactive machine learning, statistical demand forecasting, and an editorial, data-dense design system.

The system shifts operations from **reactive threshold checks** to **predictive decision-making**, flagging critical stockouts and absenteeism patterns days ahead of operational failure.

---

## Visual & Creative Identity

- **Palette:** 
  - Main Canvas: Warm off-white (`#F7F6F2`)
  - Navigation Sidebar: Deep charcoal-green (`#192A27`)
  - Primary Accent: Forest green (`#39745B`)
  - Secondary Accent: Muted sage (`#DCE9DF`)
  - Warning Status: Warm amber (`#D99A32`)
  - Critical Status: Muted red (`#C85C52`)
  - Primary Text: Deep charcoal (`#202824`)
  - Secondary Text: Slate sage (`#777F79`)
  - Cards: Crisp white with subtle borders (`#E2E6E2`)
- **Typography:** Plus Jakarta Sans for clean data hierarchy, Newsreader serif for editorial titles, and JetBrains Mono for SKUs, timestamps, and metrics.
- **Icons:** Pure Lucide React SVG vectors. Strictly zero emojis across the entire interface.

---

## System Workspaces

1. **Operations Overview:**
   - Editorial headline and contextual date view.
   - Four distinct KPI modules: Inventory Health (ratio & units), Today's Attendance (turnout & delta), Open Alerts (critical & warning breakdown), and Primary Operational Action.
   - Interactive Operational Trajectory charts with selectable date ranges (7d, 14d, 30d).
   - Operational Exceptions triage panel with inline Acknowledge and Resolve actions.
   - Chronological recent activity stream.

2. **Inventory Management:**
   - Complete line-item table: Name, SKU, Category, Current Quantity vs. Threshold, Units, Burn Velocity (units/day), Days-to-Stockout Horizon, Dynamic Reorder Point (ROP), and Status.
   - Live search by SKU or item name.
   - Multi-parameter filtering by Category and Status.
   - Sortable columns (Runout Horizon, Quantity, Name).
   - Quick increment/decrement controls (`+` and `-`) with real-time stock recalculation.
   - Modal forms for registering new SKUs and applying custom logged stock adjustments.
   - True CSV export.

3. **Attendance & Cohort Monitoring:**
   - Today's turnout summary: Present, Absent, Late, and Excused counts with percentage ratios.
   - Department-wise participation comparison bars (AI & Robotics, Data Systems, Robotics Engineering, ML Operations).
   - Interactive attendance table with instant check-in status toggling (`Present`, `Absent`, `Late`, `Excused`).
   - Consecutive absence streak tracking and multi-factor risk tier classification (Critical, High, Moderate, Low).
   - Actionable prescriptive intervention recommendations for each individual.
   - One-click "Mark All Present" batch action.
   - True CSV export of filtered records.

4. **Live Activity Control Room:**
   - Real-time telemetry event stream logging stock decrements, badge scans, alert generations, and threshold updates.
   - Filter stream by event type (Inventory, Attendance, Alerts).
   - Pause / Resume live feed toggle with active tick indicator.

5. **Alerts & Operational Exceptions:**
   - Severity filtering tabs: All, Critical, Warning, and Resolved.
   - Text search across open incidents.
   - Detailed incident dossier modal drawer with entity data, trigger condition, timestamp, and operator SOP.
   - Operator workflow: Acknowledge and Resolve actions with audit timestamps.

6. **Threshold Rules Engine:**
   - Configurable inventory rules: Critical Out-of-Stock Alarm, Minimum Reorder Threshold.
   - Configurable attendance rules: Minimum Policy Target, Repeated Absenteeism Review, Cohort Daily Spike Alarm.
   - Interactive active/inactive toggle switches.
   - Custom threshold rule creation modal with condition and limit validators.

7. **Reports & Operational Audits:**
   - Audit date window selector.
   - Structured analytical dossiers: Physical Inventory & Stockout Audit, Cohort Turnout & Absenteeism Digest, Operational Incidents & Alerts Log.
   - Direct CSV downloads generated from the operational data store.
   - Print-friendly layout stylesheet.

8. **System & Organization Settings:**
   - Institutional profile configuration (Campus name, lead administrative email).
   - Global threshold baselines (Standard vendor lead time, default attendance target).
   - Automated escalation channels (Daily email summary, critical SMS dispatch).

---

## Technical Stack & Architecture

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React icons.
- **Backend:** Python 3.14+, Flask 3.1+, NumPy, Scikit-learn.
- **Data Layer:** Typed service client (`frontend/src/services/api.ts`) supporting both direct REST communication (`/api/...`) and standalone in-memory state.
- **Production Delivery:** Vite builds directly to `static/dist/`, served automatically by Flask on `/`.

---

## Quickstart & Execution

### 1. Install Backend Dependencies
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. (Optional) Build Frontend
The production frontend bundle is already pre-compiled in `static/dist/`. To rebuild after modifying frontend source files:
```bash
cd frontend
npm install
npm run build
cd ..
```

### 3. Launch PulseOps Application
```bash
python app.py
```
Open **http://127.0.0.1:5005** in your browser.

> **Development Mode:** You can also run the Vite dev server with hot reload:
> ```bash
> cd frontend
> npm run dev
> ```
> Open **http://localhost:5173** (proxies API requests to Flask on port 5005).

---

## Repository Map

- `frontend/src/`:
  - `components/layout/`: `Sidebar.tsx`, `TopBar.tsx`
  - `components/navigation/`: `SearchModal.tsx`
  - `features/dashboard/`: `OverviewView.tsx`
  - `features/inventory/`: `InventoryView.tsx`
  - `features/attendance/`: `AttendanceView.tsx`
  - `features/live-activity/`: `LiveActivityView.tsx`
  - `features/alerts/`: `AlertsView.tsx`
  - `features/threshold-rules/`: `ThresholdRulesView.tsx`
  - `features/reports/`: `ReportsView.tsx`
  - `features/settings/`: `SettingsView.tsx`
  - `services/`: `api.ts`
  - `types/`: `index.ts`
  - `index.css`: Design system tokens, color palette, custom typography
  - `App.tsx`: Master shell and routing
- `app.py`: Flask application, RESTful endpoints (`/api/...`), and static SPA server.
- `ai_engine.py`: Machine learning demand forecasting, dynamic safety stock, and absenteeism risk classifier.
- `AI_PROJECT_SPECIFICATION.md`: Academic specification report with mathematical formulations.
- `requirements.txt`: Python package requirements.
