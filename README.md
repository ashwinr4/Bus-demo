# School Bus Live Tracking System
### Production-Quality Visual Prototype | White Theme | Zero AI Slop

A modern, responsive, white-theme frontend prototype for a **School Bus Live Tracking and Fleet Management System** designed for school administrators, drivers, and parents.

---

## 🚌 Features & User Panels

### 1. Admin Control Center (Desktop-First)
- **Fleet Overview Dashboard:** Quick summary metrics (Total Fleet, In Transit, Stopped, Needs Attention) with an interactive road-network vector map and live fleet status list.
- **Bus Management:** Fleet inventory tracking bus registration numbers, chassis models, seating capacities, and assigned drivers/routes with "Add Bus" capabilities.
- **Bus Details:** Comprehensive technical and telemetry dossier with real-time speed, fuel level, GPS timestamp, driver contact, and stop progress.
- **Driver Personnel:** Certified operator directory with licensing, contact details, assigned routes, and duty shifts.
- **Parents & Students:** Student permits with parent-guardian linkages, privacy partitions, emergency contacts, and designated boarding stops.
- **Route Corridors:** Sequenced route stop manifests with arrival windows, landmarks, and route path vectors.
- **Stop Management & Geofencing:** Searchable residential locations with static GPS coordinates, map pin preview, and geofence creation.
- **Live Trip Surveillance:** Real-time monitoring of in-flight morning runs vs standby/depot vehicles.
- **Operational Alerts:** Proximity triggers (500m & 300m), stale GPS notices, offline transponder alerts, and trip milestones.

### 2. Driver Console (Mobile-First)
- **Pre-Trip:** Assigned bus, plate number, route stops count, readiness checklist, and a prominent **START TRIP** button.
- **Active Trip:** In-progress status banner, large readable **Next Stop** card with ETA and boarding student count, in-cab map, and a prominent **END TRIP** button (**Start Trip button is completely absent**).
- **Trip Completed:** Concluded run summary, completion time, stops serviced, and shift reset.
- **Stops Manifest & Driver Profile:** Chronological stops list with touch-friendly targets and driver safety credentials.

### 3. Parent SafeTransit (Mobile-First)
- **Parent Dashboard:** Automatically defaults to the child's assigned bus (`BUS-04`) and student (`Aarav Raghavan`, Grade 5-B). Displays arrival estimates, live map with a **gold highlight pin marking the child's stop**, and approach alert notices.
- **Explore Other Buses:** Authorized routes search for parents whose children may have missed their assigned bus.
- **Bus & Route Details:** Detailed view of alternative or assigned routes with an instant "Return to My Bus" action.
- **Notifications:** Filtered specifically for the child's assigned bus and stop (300m/500m approach notices).
- **Parent Profile:** Guardian credentials, linked student permit, and toggleable SMS/push notification preferences.

---

## 🛠️ Tech Stack
- **Framework:** React 18 with TypeScript
- **Bundler & Dev Server:** Vite
- **Styling:** Tailwind CSS (Strict White Theme)
- **Routing:** React Router DOM (v6)
- **Icons:** Lucide React

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Running Locally
```bash
# 1. Clone repository
git clone https://github.com/ashwinr4/Bus-demo.git
cd Bus-demo

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
http://localhost:5173
```

### Build for Production
```bash
npm run build
```
