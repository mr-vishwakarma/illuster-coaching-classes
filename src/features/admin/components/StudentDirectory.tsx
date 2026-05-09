import { useState, useEffect, useCallback } from 'react';
import { Search, UserPlus, Phone, MapPin, GraduationCap, Shield } from 'lucide-react';
import { supabase } from '../../../shared/lib/supabase';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  role: string;
  batch: string | null;
  phone: string | null;
  address: string | null;
  updated_at: string;
}

const PAGE_SIZE = 24;

export const StudentDirectory = () => {
  const [students, setStudents] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Profile | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchStudents(true);
  }, []);

  const fetchStudents = useCallback(async (reset = false) => {
    setIsLoading(true);
    const from = reset ? 0 : students.length;
    const to = from + PAGE_SIZE - 1;

    const { data, error, count } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, role, batch, phone, address, updated_at', { count: 'exact' })
      .eq('role', 'student')
      .order('full_name', { ascending: true })
      .range(from, to);
    
    if (error) {
      toast.error("Failed to load student directory");
    } else {
      setStudents(prev => reset ? (data || []) : [...prev, ...(data || [])]);
      setHasMore((data?.length || 0) === PAGE_SIZE);
      if (count !== null) setTotalCount(count);
    }
    setIsLoading(false);
  }, [students.length]);

  const handleUpdateBatch = async (studentId: string, newBatch: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ batch: newBatch })
      .eq('id', studentId);
    
    if (error) toast.error("Batch update failed");
    else {
      toast.success("Batch updated successfully!");
      fetchStudents(true);
    }
  };

  const filteredStudents = students.filter(s => 
    s.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.batch?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl border border-light">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or batch..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400 font-bold">
          <GraduationCap size={18} /> {totalCount || students.length} Total Students
        </div>
      </div>

      {/* Student Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-3xl" />
          ))
        ) : filteredStudents.length > 0 ? (
          filteredStudents.map(student => (
            <motion.div 
              layout
              key={student.id} 
              className="bg-white p-6 rounded-3xl border border-light hover:shadow-xl transition-all relative group overflow-hidden"
            >
              {/* Batch Badge */}
              <div className="absolute top-4 right-4">
                <select 
                  value={student.batch || 'Unassigned'}
                  onChange={(e) => handleUpdateBatch(student.id, e.target.value)}
                  className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full outline-none cursor-pointer border-none appearance-none transition-colors ${student.batch ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'}`}
                >
                  <option value="Unassigned">No Batch</option>
                  <option value="Batch A">Batch A</option>
                  <option value="Batch B">Batch B</option>
                  <option value="Batch C">Batch C</option>
                  <option value="Elite">Elite</option>
                </select>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-dark mb-4 p-0.5 shadow-lg">
                  <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center overflow-hidden">
                    {student.avatar_url ? (
                      <img src={student.avatar_url} alt={student.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-black text-primary">
                        {student.full_name?.charAt(0) || 'S'}
                      </span>
                    )}
                  </div>
                </div>
                
                <h3 className="font-display font-black text-lg text-gray-800 mb-1">{student.full_name || 'Anonymous Student'}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mb-4">
                  <Shield size={12} className="text-primary" /> Student Account
                </div>

                <div className="w-full space-y-3 pt-4 border-t border-light">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                      <Phone size={14} />
                    </div>
                    <span>{student.phone || 'No phone set'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                      <MapPin size={14} />
                    </div>
                    <span className="truncate">{student.address || 'Address pending'}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setSelectedStudent(student)}
                className="mt-6 w-full py-3 bg-gray-50 hover:bg-primary/5 text-gray-600 hover:text-primary rounded-xl text-xs font-black uppercase tracking-widest transition-all"
              >
                View Full Profile
              </button>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-light">
            <UserPlus size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">No students found. Start enrolling new users!</p>
          </div>
        )}
      </div>

      {/* Load More */}
      {hasMore && !searchTerm && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => fetchStudents(false)}
            disabled={isLoading}
            className="px-8 py-3 bg-gray-100 hover:bg-primary/10 text-gray-600 hover:text-primary rounded-xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : `Load More Students`}
          </button>
        </div>
      )}

      {/* Student Detail Modal (Simplified for Phase 6) */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStudent(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-[2rem] overflow-hidden relative z-10 shadow-2xl p-8"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center text-3xl font-black text-primary mb-4">
                  {selectedStudent.full_name?.charAt(0)}
                </div>
                <h2 className="text-2xl font-display font-black text-gray-800 mb-1">{selectedStudent.full_name}</h2>
                <span className="text-xs font-black uppercase tracking-widest text-primary px-3 py-1 bg-primary/5 rounded-full mb-6">
                  {selectedStudent.batch || 'Unassigned Batch'}
                </span>

                <div className="w-full space-y-4 text-left">
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Contact Info</label>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone size={14} className="text-primary" />
                      <span className="font-bold">{selectedStudent.phone || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Location</label>
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin size={14} className="text-primary" />
                      <span className="font-bold">{selectedStudent.address || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="mt-8 w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all"
                >
                  Close Directory View
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
