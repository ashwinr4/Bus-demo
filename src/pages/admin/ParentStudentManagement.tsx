import React, { useState } from 'react';
import { useTransportation } from '../../context/TransportationContext';
import {
  GraduationCap,
  Search,
  Plus,
  Phone,
  Mail,
  Bus,
  MapPin,
  CheckCircle2,
  X,
  Shield,
} from 'lucide-react';

export const ParentStudentManagement: React.FC = () => {
  const { students, parents, buses, routes, addStudent } = useTransportation();
  const [activeTab, setActiveTab] = useState<'students' | 'parents'>('students');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Form State
  const [studentName, setStudentName] = useState('');
  const [grade, setGrade] = useState('Grade 5-B');
  const [rollNumber, setRollNumber] = useState('');
  const [selectedParentId, setSelectedParentId] = useState(parents[0]?.id || 'par-501');
  const [selectedBusId, setSelectedBusId] = useState(buses[0]?.id || 'bus-01');

  const filteredStudents = students.filter((s) => {
    return (
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const filteredParents = parents.filter((p) => {
    return (
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !rollNumber) return;

    const bus = buses.find((b) => b.id === selectedBusId);
    const route = routes.find((r) => r.id === bus?.assignedRouteId);
    const pickupStopId = route?.stops[0]?.id || 'stop-04-1';

    addStudent({
      name: studentName,
      grade,
      rollNumber,
      parentId: selectedParentId,
      busId: selectedBusId,
      routeId: bus?.assignedRouteId || 'route-04',
      pickupStopId,
      dropoffStopId: pickupStopId,
      bloodGroup: 'B+',
    });

    setShowAddModal(false);
    setStudentName('');
    setRollNumber('');
    setFeedbackMsg(`Student ${studentName} enrolled.`);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-teal-700" />
            <span>Parents & Students</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Student bus permits, parent linkages, and designated boarding stops
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Student</span>
        </button>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-md flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Tabs & Search Bar */}
      <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center bg-slate-100 p-1 rounded-md border border-slate-200 text-xs font-medium">
          <button
            onClick={() => setActiveTab('students')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === 'students'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Students ({students.length})
          </button>
          <button
            onClick={() => setActiveTab('parents')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeTab === 'parents'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Parents ({parents.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              activeTab === 'students'
                ? 'Search student, roll, or grade...'
                : 'Search parent name, phone, email...'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-md border border-slate-300 bg-white text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-teal-700"
          />
        </div>
      </div>

      {/* Table based on active tab */}
      {activeTab === 'students' ? (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs font-semibold">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Grade & Roll</th>
                  <th className="py-3 px-4">Parent / Guardian</th>
                  <th className="py-3 px-4">Assigned Bus</th>
                  <th className="py-3 px-4">Boarding Stop</th>
                  <th className="py-3 px-4 text-right">Emergency Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => {
                  const parent = parents.find((p) => p.id === student.parentId);
                  const bus = buses.find((b) => b.id === student.busId);
                  const route = routes.find((r) => r.id === student.routeId);
                  const stop = route?.stops.find((s) => s.id === student.pickupStopId);

                  return (
                    <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {student.name}
                      </td>

                      <td className="py-3 px-4 text-slate-600">
                        {student.grade} • Roll: {student.rollNumber}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">
                          {parent ? parent.name : 'Unknown'}
                        </div>
                        <div className="text-xs text-slate-400">
                          {parent ? `${parent.relationship} (${parent.phone})` : ''}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {bus ? (
                          <div className="flex items-center gap-1 font-semibold text-slate-900">
                            <Bus className="w-3.5 h-3.5 text-teal-700" />
                            <span>{bus.fleetNumber}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">None</span>
                        )}
                      </td>

                      <td className="py-3 px-4 max-w-[200px]">
                        <div className="font-medium text-slate-800 flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-teal-700 shrink-0" />
                          <span>{stop ? stop.name : 'Stop Assigned'}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right text-slate-700 font-mono">
                        {student.emergencyPhone}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 flex items-center justify-between">
            <span>{filteredStudents.length} students enrolled</span>
            <span className="text-slate-500 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-600" /> Privacy partitioned
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs font-semibold">
                  <th className="py-3 px-4">Parent / Guardian</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Address</th>
                  <th className="py-3 px-4">Children</th>
                  <th className="py-3 px-4 text-right">Bus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredParents.map((parent) => {
                  const linkedStudents = students.filter((s) => s.parentId === parent.id);
                  const bus = buses.find((b) => b.id === parent.assignedBusId);

                  return (
                    <tr key={parent.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{parent.name}</div>
                        <div className="text-xs text-slate-500">{parent.relationship}</div>
                      </td>

                      <td className="py-3 px-4 text-slate-800 font-medium">
                        {parent.phone}
                      </td>

                      <td className="py-3 px-4 text-slate-600">
                        {parent.email}
                      </td>

                      <td className="py-3 px-4 max-w-[200px] text-slate-700 truncate" title={parent.address}>
                        {parent.address}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {linkedStudents.map((st) => (
                            <span
                              key={st.id}
                              className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded text-xs font-medium"
                            >
                              {st.name}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        {bus ? (
                          <span className="font-bold text-slate-900">
                            {bus.fleetNumber}
                          </span>
                        ) : (
                          <span className="text-slate-400">None</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 flex items-center justify-between">
            <span>{filteredParents.length} parent accounts</span>
            <span>SMS & approach notices active</span>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-md w-full p-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-teal-700" />
                <span>Enroll Student</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Student Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advait Sharma"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-teal-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Class / Grade
                  </label>
                  <input
                    type="text"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-teal-700"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="5B-22"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded font-mono focus:ring-1 focus:ring-teal-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Parent / Guardian
                </label>
                <select
                  value={selectedParentId}
                  onChange={(e) => setSelectedParentId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-teal-700"
                >
                  {parents.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.relationship})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Assign Bus
                </label>
                <select
                  value={selectedBusId}
                  onChange={(e) => setSelectedBusId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-teal-700"
                >
                  {buses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.fleetNumber} ({b.registrationNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded font-semibold"
                >
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
