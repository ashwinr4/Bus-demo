export type BusStatus = 
  | 'in_transit' 
  | 'stopped' 
  | 'not_started' 
  | 'stale_gps' 
  | 'offline' 
  | 'completed';

export type DutyStatus = 'on_duty' | 'off_duty' | 'on_break';

export type AlertSeverity = 'info' | 'low' | 'medium' | 'high' | 'critical';

export type AlertType = 
  | 'approaching_500m' 
  | 'approaching_300m' 
  | 'stale_gps' 
  | 'offline' 
  | 'trip_started' 
  | 'trip_completed' 
  | 'delay_warning';

export interface GeoPoint {
  x: number; // 0 to 100 percentage in our coordinate grid
  y: number; // 0 to 100 percentage in our coordinate grid
  label?: string;
}

export interface Stop {
  id: string;
  name: string;
  sequence: number;
  address: string;
  eta: string;
  scheduledTime: string;
  coordinates: GeoPoint;
  studentCount: number;
  status: 'pending' | 'approaching' | 'arrived' | 'departed';
  landmark?: string;
}

export interface Route {
  id: string;
  code: string;
  name: string;
  busId: string;
  driverId: string;
  totalDistanceKm: number;
  estimatedDurationMins: number;
  stops: Stop[];
  pathPoints: GeoPoint[];
  status: 'in_progress' | 'scheduled' | 'completed' | 'idle';
}

export interface Driver {
  id: string;
  name: string;
  employeeId: string;
  phone: string;
  licenseNumber: string;
  experienceYears: number;
  assignedBusId: string;
  assignedRouteId: string;
  dutyStatus: DutyStatus;
  rating: number;
  emergencyContact: string;
  shift: string;
}

export interface Bus {
  id: string;
  fleetNumber: string;
  registrationNumber: string;
  model: string;
  capacity: number;
  assignedRouteId: string;
  assignedDriverId: string;
  operationalStatus: BusStatus;
  lastLocationUpdate: string;
  lastGpsTimestamp: string;
  speedKmh: number;
  currentLocationName: string;
  currentCoordinates: GeoPoint;
  currentStopIndex: number;
  nextStopName: string;
  staleReason?: string;
  fuelLevelPercent: number;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  rollNumber: string;
  parentId: string;
  busId: string;
  routeId: string;
  pickupStopId: string;
  dropoffStopId: string;
  bloodGroup: string;
  emergencyPhone: string;
}

export interface Parent {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  studentIds: string[];
  assignedBusId: string;
  relationship: string;
}

export interface OperationalAlert {
  id: string;
  busId: string;
  busFleetNumber: string;
  routeId: string;
  routeName: string;
  stopId?: string;
  stopName?: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  description: string;
  timestamp: string;
  acknowledged: boolean;
}

export type Role = 'admin' | 'driver' | 'parent';

export type DriverTripState = 'pre_trip' | 'active_trip' | 'completed_trip';

