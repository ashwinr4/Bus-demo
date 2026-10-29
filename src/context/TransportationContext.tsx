import React, { createContext, useContext, useState } from 'react';
import { 
  Bus, 
  Driver, 
  DriverTripState, 
  OperationalAlert, 
  Parent, 
  Route, 
  Stop, 
  Student 
} from '../types';
import { 
  INITIAL_ALERTS, 
  INITIAL_BUSES, 
  INITIAL_DRIVERS, 
  INITIAL_PARENTS, 
  INITIAL_ROUTES, 
  INITIAL_STUDENTS 
} from '../data/mockData';

interface TransportationContextType {
  buses: Bus[];
  routes: Route[];
  drivers: Driver[];
  students: Student[];
  parents: Parent[];
  alerts: OperationalAlert[];
  
  // Driver state machine
  driverTripState: DriverTripState;
  startDriverTrip: () => void;
  endDriverTrip: () => void;
  resetDriverTrip: () => void;
  currentDriver: Driver;

  // Parent context
  parentSelectedBusId: string;
  setParentSelectedBusId: (busId: string) => void;
  currentParent: Parent;
  parentAssignedBus: Bus;
  parentAssignedRoute: Route;
  parentSelectedBus: Bus;
  parentSelectedRoute: Route;
  parentStudent: Student;

  // Admin mutation helpers (prototype in-memory)
  addBus: (newBus: Partial<Bus>) => void;
  addStopToRoute: (routeId: string, newStop: Omit<Stop, 'id'>) => void;
  addDriver: (newDriver: Partial<Driver>) => void;
  addStudent: (newStudent: Partial<Student>) => void;
  addParent: (newParent: Partial<Parent>) => void;
  acknowledgeAlert: (alertId: string) => void;
}

const TransportationContext = createContext<TransportationContextType | undefined>(undefined);

export const TransportationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [buses, setBuses] = useState<Bus[]>(INITIAL_BUSES);
  const [routes, setRoutes] = useState<Route[]>(INITIAL_ROUTES);
  const [drivers, setDrivers] = useState<Driver[]>(INITIAL_DRIVERS);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [parents, setParents] = useState<Parent[]>(INITIAL_PARENTS);
  const [alerts, setAlerts] = useState<OperationalAlert[]>(INITIAL_ALERTS);

  // Driver state: starts in 'pre_trip', can transition to 'active_trip', then 'completed_trip'
  const [driverTripState, setDriverTripState] = useState<DriverTripState>('pre_trip');

  // Parent selected bus: defaults to parent's assigned bus (BUS-04 -> bus-01)
  const [parentSelectedBusId, setParentSelectedBusId] = useState<string>('bus-01');

  // Hardcoded logged-in identities for simulation
  const currentDriver = drivers.find((d) => d.id === 'drv-804') || drivers[0];
  const currentParent = parents.find((p) => p.id === 'par-501') || parents[0];
  const parentStudent = students.find((s) => s.parentId === currentParent.id) || students[0];

  const parentAssignedBus = buses.find((b) => b.id === currentParent.assignedBusId) || buses[0];
  const parentAssignedRoute = routes.find((r) => r.id === parentAssignedBus.assignedRouteId) || routes[0];

  const parentSelectedBus = buses.find((b) => b.id === parentSelectedBusId) || parentAssignedBus;
  const parentSelectedRoute = routes.find((r) => r.id === parentSelectedBus.assignedRouteId) || parentAssignedRoute;

  const startDriverTrip = () => {
    setDriverTripState('active_trip');
    setBuses((prev) =>
      prev.map((bus) =>
        bus.id === 'bus-01'
          ? {
              ...bus,
              operationalStatus: 'in_transit',
              speedKmh: 34,
              lastLocationUpdate: 'Just now (Live)',
              currentLocationName: 'In transit - Greenwood 4th Avenue Approach',
            }
          : bus
      )
    );
  };

  const endDriverTrip = () => {
    setDriverTripState('completed_trip');
    setBuses((prev) =>
      prev.map((bus) =>
        bus.id === 'bus-01'
          ? {
              ...bus,
              operationalStatus: 'completed',
              speedKmh: 0,
              lastLocationUpdate: 'Trip concluded at school',
              currentLocationName: 'Oakridge Senior School - Main Gate (Parked)',
            }
          : bus
      )
    );
  };

  const resetDriverTrip = () => {
    setDriverTripState('pre_trip');
    setBuses((prev) =>
      prev.map((bus) =>
        bus.id === 'bus-01'
          ? {
              ...bus,
              operationalStatus: 'not_started',
              speedKmh: 0,
              lastLocationUpdate: 'Ready for next shift',
              currentLocationName: 'Oakridge South Terminal (Depot)',
            }
          : bus
      )
    );
  };

  const addBus = (newBus: Partial<Bus>) => {
    const id = `bus-${Date.now().toString().slice(-4)}`;
    const fullBus: Bus = {
      id,
      fleetNumber: newBus.fleetNumber || `BUS-${Math.floor(Math.random() * 90 + 10)}`,
      registrationNumber: newBus.registrationNumber || 'KA-01-EE-9999',
      model: newBus.model || 'Standard 32S School Carrier',
      capacity: newBus.capacity || 32,
      assignedRouteId: newBus.assignedRouteId || 'route-02',
      assignedDriverId: newBus.assignedDriverId || 'drv-802',
      operationalStatus: 'not_started',
      lastLocationUpdate: 'Idle at Depot',
      lastGpsTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      speedKmh: 0,
      currentLocationName: 'South Depot Bay 7',
      currentCoordinates: { x: 14, y: 78 },
      currentStopIndex: 0,
      nextStopName: 'Not Started',
      fuelLevelPercent: 95,
      ...newBus,
    };
    setBuses((prev) => [fullBus, ...prev]);
  };

  const addStopToRoute = (routeId: string, newStopData: Omit<Stop, 'id'>) => {
    const newStop: Stop = {
      ...newStopData,
      id: `stop-custom-${Date.now().toString().slice(-4)}`,
    };

    setRoutes((prev) =>
      prev.map((rt) => {
        if (rt.id === routeId) {
          const updatedStops = [...rt.stops, newStop].sort((a, b) => a.sequence - b.sequence);
          return {
            ...rt,
            stops: updatedStops,
            pathPoints: [...rt.pathPoints, newStop.coordinates],
          };
        }
        return rt;
      })
    );
  };

  const addDriver = (newDriver: Partial<Driver>) => {
    const id = `drv-${Date.now().toString().slice(-4)}`;
    const fullDriver: Driver = {
      id,
      name: newDriver.name || 'New Driver',
      employeeId: newDriver.employeeId || `DRV-${Math.floor(Math.random() * 900 + 100)}`,
      phone: newDriver.phone || '+91 98000 00000',
      licenseNumber: newDriver.licenseNumber || 'KA-01-2024-00000',
      experienceYears: newDriver.experienceYears || 5,
      assignedBusId: newDriver.assignedBusId || 'bus-04',
      assignedRouteId: newDriver.assignedRouteId || 'route-02',
      dutyStatus: 'on_duty',
      rating: 4.8,
      emergencyContact: '+91 99000 00000 (Family)',
      shift: 'Morning Regular (06:30 AM - 11:30 AM)',
      ...newDriver,
    };
    setDrivers((prev) => [fullDriver, ...prev]);
  };

  const addStudent = (newStudent: Partial<Student>) => {
    const id = `stu-${Date.now().toString().slice(-4)}`;
    const fullStudent: Student = {
      id,
      name: newStudent.name || 'Student Name',
      grade: newStudent.grade || 'Grade 5',
      rollNumber: newStudent.rollNumber || 'R-01',
      parentId: newStudent.parentId || 'par-501',
      busId: newStudent.busId || 'bus-01',
      routeId: newStudent.routeId || 'route-04',
      pickupStopId: newStudent.pickupStopId || 'stop-04-3',
      dropoffStopId: newStudent.dropoffStopId || 'stop-04-3',
      bloodGroup: newStudent.bloodGroup || 'O+',
      emergencyPhone: newStudent.emergencyPhone || '+91 98450 12894',
      ...newStudent,
    };
    setStudents((prev) => [fullStudent, ...prev]);
  };

  const addParent = (newParent: Partial<Parent>) => {
    const id = `par-${Date.now().toString().slice(-4)}`;
    const fullParent: Parent = {
      id,
      name: newParent.name || 'Guardian Name',
      phone: newParent.phone || '+91 90000 00000',
      email: newParent.email || 'parent@example.com',
      address: newParent.address || 'Bengaluru',
      studentIds: newParent.studentIds || [],
      assignedBusId: newParent.assignedBusId || 'bus-01',
      relationship: newParent.relationship || 'Guardian',
      ...newParent,
    };
    setParents((prev) => [fullParent, ...prev]);
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alt) => (alt.id === alertId ? { ...alt, acknowledged: true } : alt))
    );
  };

  return (
    <TransportationContext.Provider
      value={{
        buses,
        routes,
        drivers,
        students,
        parents,
        alerts,
        driverTripState,
        startDriverTrip,
        endDriverTrip,
        resetDriverTrip,
        currentDriver,
        parentSelectedBusId,
        setParentSelectedBusId,
        currentParent,
        parentAssignedBus,
        parentAssignedRoute,
        parentSelectedBus,
        parentSelectedRoute,
        parentStudent,
        addBus,
        addStopToRoute,
        addDriver,
        addStudent,
        addParent,
        acknowledgeAlert,
      }}
    >
      {children}
    </TransportationContext.Provider>
  );
};

export const useTransportation = () => {
  const context = useContext(TransportationContext);
  if (!context) {
    throw new Error('useTransportation must be used within a TransportationProvider');
  }
  return context;
};

