import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, BookOpen, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="text-center relative z-10 max-w-lg">
        {/* Big 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <h1 className="text-[10rem] md:text-[14rem] font-display font-black leading-none tracking-tighter bg-gradient-to-b from-white/20 to-white/[0.03] bg-clip-text text-transparent select-none">
            404
          </h1>
        </motion.div>

        {/* Messaging */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">
            Page not found
          </h2>
          <p className="text-white/50 text-base md:text-lg mb-10 leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
            <br className="hidden md:block" />
            Let's get you back on track.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/"
            className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-black font-bold text-sm hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-xl w-full sm:w-auto justify-center"
          >
            <Home size={16} />
            Back to Home
          </Link>
          <Link
            to="/courses"
            className="flex items-center gap-2 px-8 py-3.5 rounded-full border border-white/20 text-white font-bold text-sm hover:bg-white/5 hover:border-white/40 transition-all duration-300 w-full sm:w-auto justify-center"
          >
            <BookOpen size={16} />
            Browse Courses
          </Link>
        </motion.div>

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <button
            onClick={() => window.history.back()}
            className="text-white/30 hover:text-white/60 text-sm flex items-center gap-1.5 mx-auto transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            Go back
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
