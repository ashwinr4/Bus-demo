import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransportation } from '../../context/TransportationContext';
import { LiveTransitMap } from '../../components/map/LiveTransitMap';
import {
  Play,
  Square,
  MapPin,
  CheckCircle2,
  Navigation,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';

export const DriverHome: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentDriver,
    buses,
    routes,
    driverTripState,
    startDriverTrip,
    endDriverTrip,
    resetDriverTrip,
  } = useTransportation();

  const assignedBus = buses.find((b) => b.id === currentDriver.assignedBusId) || buses[0];
  const assignedRoute = routes.find((r) => r.id === assignedBus.assignedRouteId) || routes[0];

  // -------------------------------------------------------------
  // STATE 1: PRE-TRIP (Before Starting)
  // Shows assigned bus, route, stop count, and PROMINENT START TRIP button
  // -------------------------------------------------------------
  if (driverTripState === 'pre_trip') {
    return (
      <div className="space-y-4">
        {/* Readiness Status Header (Strict White Theme) */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs text-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
              Morning Run • Ready
            </span>
            <span className="text-xs text-slate-500 font-mono">Shift: 07:00 AM</span>
          </div>

          <h1 className="text-xl font-bold text-slate-900 mt-2.5 tracking-tight">
            Ready to Start Trip?
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Route: <strong className="text-slate-900">{assignedRoute.name} ({assignedRoute.code})</strong>
          </p>

          <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-xs">Bus Assigned</span>
              <span className="font-bold text-slate-900 text-sm">{assignedBus.fleetNumber}</span>
              <span className="text-[11px] text-slate-500 block font-mono">{assignedBus.registrationNumber}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-xs">Total Stops</span>
              <span className="font-bold text-slate-900 text-sm">{assignedRoute.stops.length} Stops</span>
              <span className="text-[11px] text-teal-700 block">Est. 45 Mins</span>
            </div>
          </div>
        </div>

        {/* Simple Pre-Trip Checklist */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700 shadow-xs">
          <div className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Pre-Trip Check Complete</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-600">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>GPS Connected</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Safety equipment verified</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Fuel: {assignedBus.fuelLevelPercent}%</span>
            </li>
          </ul>
        </div>

        {/* Route Overview Preview */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Route Overview
            </span>
            <button
              onClick={() => navigate('/driver/stops')}
              className="text-xs text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1"
            >
              View Stops <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <LiveTransitMap
            bus={assignedBus}
            route={assignedRoute}
            heightClass="h-[210px]"
            interactive={false}
          />
        </div>

        {/* PROMINENT START TRIP BUTTON */}
        <div className="pt-2">
          <button
            onClick={startDriverTrip}
            className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl font-bold text-base tracking-wide flex items-center justify-center gap-2.5 shadow-md transition-colors"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>START TRIP</span>
          </button>
          <p className="text-center text-xs text-slate-400 mt-2">
            Tap when departing depot to begin location sharing
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STATE 2: ACTIVE TRIP (Currently In Progress)
  // CRITICAL RULE: NO START TRIP BUTTON! ONLY 'END TRIP' BUTTON!
  // Large readable text, high contrast, white theme
  // -------------------------------------------------------------
  if (driverTripState === 'active_trip') {
    const nextStop = assignedRoute.stops[2] || assignedRoute.stops[0];

    return (
      <div className="space-y-4">
        {/* Active Banner (Strict White Theme with Accessible Emerald) */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-slate-900 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block shrink-0" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                Trip In Progress
              </span>
              <h1 className="text-base font-bold text-slate-900 leading-tight">
                {assignedRoute.code} • {assignedBus.fleetNumber}
              </h1>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-500 uppercase block">Speed</span>
            <span className="text-lg font-mono font-bold text-slate-900">{assignedBus.speedKmh} km/h</span>
          </div>
        </div>

        {/* NEXT STOP CALLOUT (Large & Clear) */}
        <div className="bg-white border-2 border-teal-600 rounded-xl p-4 shadow-xs text-slate-900">
          <div className="flex items-center justify-between text-xs text-teal-800 font-semibold mb-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-teal-700" />
              <span>NEXT STOP #{nextStop.sequence} OF {assignedRoute.stops.length}</span>
            </span>
            <span className="bg-teal-50 border border-teal-200 text-teal-800 px-2 py-0.5 rounded text-xs font-mono font-bold">
              ETA: {nextStop.eta}
            </span>
          </div>

          <h2 className="text-xl font-bold text-slate-900 mt-1">
            {nextStop.name}
          </h2>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {nextStop.address}
          </p>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-600">
              Students Waiting: <strong className="text-slate-900 font-bold">{nextStop.studentCount}</strong>
            </span>
            <span className="text-slate-600">
              Status: <strong className="text-amber-700 font-bold uppercase">{nextStop.status}</strong>
            </span>
          </div>
        </div>

        {/* In-Cab Route Map */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between mb-2 text-xs">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-teal-700" />
              <span>Route Location</span>
            </span>
            <span className="text-xs font-medium text-emerald-700">
              Location Sharing Active
            </span>
          </div>
          <LiveTransitMap
            bus={assignedBus}
            route={assignedRoute}
            heightClass="h-[230px]"
            interactive={false}
          />
        </div>

        {/* Stop Progress Overview */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700 shadow-xs">
          <div className="font-bold text-slate-900 mb-2 flex items-center justify-between">
            <span>Stops Overview</span>
            <span className="text-slate-500 font-mono text-xs">2 / 6 Departed</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-400 line-through">
              <span>1. Silver Oaks Main Gate</span>
              <span>Departed</span>
            </div>
            <div className="flex items-center justify-between text-slate-400 line-through">
              <span>2. Maple Crest Apartments</span>
              <span>Departed</span>
            </div>
            <div className="flex items-center justify-between text-teal-900 font-bold bg-teal-50 p-1.5 rounded border border-teal-200">
              <span>3. Greenwood Avenue Post Office</span>
              <span className="text-amber-800">Approaching (280m)</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>4. Orchid Enclave Gate 2</span>
              <span>Pending</span>
            </div>
          </div>
        </div>

        {/* CRITICAL BUTTON RULE: ONLY 'END TRIP' BUTTON DISPLAYED */}
        <div className="pt-2">
          <button
            onClick={endDriverTrip}
            className="w-full py-4 px-6 bg-rose-700 hover:bg-rose-800 active:bg-rose-900 text-white rounded-xl font-bold text-base tracking-wide flex items-center justify-center gap-2.5 shadow-md transition-colors"
          >
            <Square className="w-5 h-5 fill-white" />
            <span>END TRIP</span>
          </button>
          <p className="text-center text-xs text-slate-400 mt-2">
            Tap when route is completed at school campus
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STATE 3: TRIP COMPLETED
  // Summary, clearly indicates no longer running, return to home
  // -------------------------------------------------------------
  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-xl p-5 text-center text-slate-900 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-700 mb-3">
          <CheckCircle2 className="w-7 h-7" />
        </div>

        <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
          Trip Completed
        </span>

        <h1 className="text-xl font-bold text-slate-900 mt-3">
          Morning Run Finished
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Location broadcasting for {assignedBus.fleetNumber} is stopped.
        </p>

        {/* Trip Summary Details */}
        <div className="mt-4 p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-left text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Route:</span>
            <span className="font-bold text-slate-900">{assignedRoute.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Completed Time:</span>
            <span className="font-mono text-slate-800 font-medium">07:51 AM</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Stops Serviced:</span>
            <span className="font-bold text-teal-800">{assignedRoute.stops.length} of {assignedRoute.stops.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Final Location:</span>
            <span className="text-slate-800">Oakridge School Campus</span>
          </div>
        </div>

        {/* Reset / Return to Pre-trip button */}
        <button
          onClick={resetDriverTrip}
          className="w-full mt-5 py-3.5 px-4 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset for Afternoon Run</span>
        </button>
      </div>
    </div>
  );
};
