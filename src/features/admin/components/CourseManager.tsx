import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CheckCircle, XCircle, Search, BookOpen } from 'lucide-react';
import { supabase } from '../../../shared/lib/supabase';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  image_url: string;
  is_published: boolean;
}

export const CourseManager = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    category: 'JEE',
    price: 0,
    image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop',
    is_published: true
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('courses')
      .select('id, title, description, category, price, image_url, is_published, created_at')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast.error("Failed to load courses");
    } else {
      setCourses(data || []);
    }
    setIsLoading(false);
  };

  const handleOpenModal = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        id: course.id,
        title: course.title,
        description: course.description,
        category: course.category,
        price: course.price,
        image_url: course.image_url,
        is_published: course.is_published
      });
    } else {
      setEditingCourse(null);
      setFormData({
        id: '',
        title: '',
        description: '',
        category: 'JEE',
        price: 0,
        image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop',
        is_published: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (editingCourse) {
      const { error } = await supabase
        .from('courses')
        .update(formData)
        .eq('id', editingCourse.id);
      
      if (error) toast.error("Update failed");
      else {
        toast.success("Course updated!");
        setIsModalOpen(false);
        fetchCourses();
      }
    } else {
      // Remove empty id to let Supabase generate UUID if not provided
      const submitData = { ...formData };
      if (!submitData.id) delete (submitData as any).id;

      const { error } = await supabase
        .from('courses')
        .insert([submitData]);
      
      if (error) toast.error("Creation failed");
      else {
        toast.success("Course created!");
        setIsModalOpen(false);
        fetchCourses();
      }
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);
    
    if (error) toast.error("Delete failed");
    else {
      toast.success("Course deleted");
      fetchCourses();
    }
  };

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl border border-light">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search courses..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="btn btn-primary flex items-center gap-2 w-full md:w-auto"
        >
          <Plus size={20} /> Create New Course
        </button>
      </div>

      {/* Courses List */}
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : filteredCourses.length > 0 ? (
          filteredCourses.map(course => (
            <div key={course.id} className="bg-white p-4 rounded-2xl border border-light hover:shadow-lg transition-all flex flex-col md:flex-row items-center gap-6 group">
              <div className="w-full md:w-40 h-28 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                <img src={course.image_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex-1 space-y-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                    {course.category}
                  </span>
                  {course.is_published ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-green-600">
                      <CheckCircle size={10} /> Published
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                      <XCircle size={10} /> Draft
                    </span>
                  )}
                </div>
                <h3 className="font-display font-black text-lg text-gray-800">{course.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-1">{course.description}</p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right hidden md:block px-4 border-r border-light mr-4">
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Price</div>
                  <div className="text-lg font-black text-gray-800">₹{course.price}</div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleOpenModal(course)}
                    className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                  >
                    <Edit size={20} />
                  </button>
                  <button 
                    onClick={() => handleDelete(course.id)}
                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-light">
            <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 font-medium">No courses found matching your search.</p>
          </div>
        )}
      </div>

      {/* Course Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden relative z-10 shadow-2xl"
            >
              <div className="p-8 border-b border-light flex justify-between items-center">
                <h2 className="text-2xl font-display font-black text-gray-800">
                  {editingCourse ? 'Edit Course' : 'Create New Course'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <XCircle size={24} className="text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
                <div className="grid md:grid-cols-2 gap-6">
                  {!editingCourse && (
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-400">Course ID / Slug (Optional)</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 bg-gray-50 border border-light rounded-xl focus:outline-none focus:border-primary/50"
                        value={formData.id}
                        onChange={(e) => setFormData({...formData, id: e.target.value})}
                        placeholder="e.g. course-jee-physics"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Course Title</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-3 bg-gray-50 border border-light rounded-xl focus:outline-none focus:border-primary/50"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g. JEE Advanced Physics"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Category</label>
                  <select 
                    className="w-full px-4 py-3 bg-gray-50 border border-light rounded-xl focus:outline-none focus:border-primary/50"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="JEE">JEE</option>
                    <option value="NEET">NEET</option>
                    <option value="Foundation">Foundation</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Description</label>
                  <textarea 
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 border border-light rounded-xl focus:outline-none focus:border-primary/50"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe the course curriculum and benefits..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Price (₹)</label>
                    <input 
                      required
                      type="number" 
                      className="w-full px-4 py-3 bg-gray-50 border border-light rounded-xl focus:outline-none focus:border-primary/50"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Status</label>
                    <div className="flex gap-4 pt-2">
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, is_published: true})}
                        className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all ${formData.is_published ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-400 border-light hover:border-gray-300'}`}
                      >
                        Publish
                      </button>
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, is_published: false})}
                        className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all ${!formData.is_published ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-400 border-light hover:border-gray-300'}`}
                      >
                        Draft
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button type="submit" disabled={isLoading} className="btn btn-primary w-full py-4 text-lg">
                    {isLoading ? 'Processing...' : (editingCourse ? 'Update Course' : 'Create Course')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
