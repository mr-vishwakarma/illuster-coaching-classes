import { FileText, PlayCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudyMaterialsWidget = ({ materials }: { materials: any[] }) => {
  if (materials.length === 0) {
    return (
      <div className="card p-8 text-center bg-gray-50/50 border-dashed">
        <FileText className="mx-auto text-gray-300 mb-3" size={32} />
        <h3 className="font-bold text-gray-800 mb-1">No Study Materials</h3>
        <p className="text-xs text-gray-500">Your materials will appear here when assigned.</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden divide-y divide-[var(--border-light)]">
      {materials.map((mat: any) => (
        <div key={mat.id} className="flex items-center justify-between p-4 hover:bg-[var(--bg-main)] transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`p-2 rounded-lg shrink-0 ${mat.type === 'video' ? 'bg-purple-500/10 text-purple-400' : mat.type === 'pdf' ? 'bg-red-500/10 text-red-400' : 'bg-orange-500/10 text-orange-400'}`}>
              {mat.type === 'video' ? <PlayCircle size={18} /> : <FileText size={18} />}
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-xs text-[var(--text-main)] truncate">{mat.title}</h4>
              <p className="text-[10px] text-[var(--text-muted)] truncate mt-0.5">{mat.topic}</p>
            </div>
          </div>
          <button className="p-2 hover:bg-[var(--border-light)] rounded-lg text-[var(--text-muted)] transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      ))}
      
      <Link to="#materials" className="block p-3 text-center text-xs font-bold text-orange-500 hover:bg-orange-500/5 transition-colors uppercase tracking-widest">
        View All Materials
      </Link>
    </div>
  );
};
