import { useState, useEffect } from 'react';
import { Database, HardDrive, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../../../shared/lib/supabase';

interface TableStat {
  table_name: string;
  row_count: number;
  total_size: string;
  bytes: number;
}

export const DatabaseHealth = () => {
  const [stats, setStats] = useState<TableStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data, error } = await supabase.rpc('get_db_stats');
      if (error) throw error;
      setStats(data || []);
    } catch (err: any) {
      console.error('Error fetching DB stats:', err);
      setError(err.message || 'Failed to fetch database health.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Free Tier limit is 500MB (approx 524288000 bytes).
  // Let's calculate the total from our user tables (note: this doesn't include PG system tables).
  const totalUserBytes = stats.reduce((acc, curr) => acc + curr.bytes, 0);
  const totalUserMB = (totalUserBytes / (1024 * 1024)).toFixed(2);
  
  // Fake an estimated system overhead (PostgreSQL system takes ~200MB out of the box)
  const estimatedTotalMB = (Number(totalUserMB) + 200).toFixed(2);
  const percentUsed = (Number(estimatedTotalMB) / 500) * 100;

  let healthStatus = 'Healthy';
  let healthColor = 'text-green-500';
  let HealthIcon = CheckCircle;

  if (percentUsed > 85) {
    healthStatus = 'Critical';
    healthColor = 'text-red-500';
    HealthIcon = AlertTriangle;
  } else if (percentUsed > 70) {
    healthStatus = 'Warning';
    healthColor = 'text-amber-500';
    HealthIcon = AlertTriangle;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-light">
        <div>
          <h2 className="text-xl font-display font-black flex items-center gap-2">
            <Database className="text-primary" /> Database Health (Free Tier)
          </h2>
          <p className="text-sm text-gray-500 mt-1">Monitor storage and table sizes to stay within limits.</p>
        </div>
        <button 
          onClick={fetchStats}
          className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-gray-600"
          title="Refresh Stats"
        >
          <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3">
          <AlertTriangle size={20} /> {error} 
          <span className="text-xs opacity-75">(Did you run the 20240504_db_stats_rpc.sql migration?)</span>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Overview Card */}
          <div className="bg-white p-6 rounded-2xl border border-light lg:col-span-1">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Storage Overview</h3>
            
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gray-50 ${healthColor}`}>
                <HealthIcon size={28} />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</div>
                <div className={`text-xl font-black ${healthColor}`}>{healthStatus}</div>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-gray-600">Estimated Disk Usage</span>
                <span className="text-gray-900">{estimatedTotalMB} MB / 500 MB</span>
              </div>
              <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${percentUsed > 85 ? 'bg-red-500' : percentUsed > 70 ? 'bg-amber-500' : 'bg-primary'}`}
                  style={{ width: `${Math.min(percentUsed, 100)}%` }}
                />
              </div>
            </div>

            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
              <div className="flex items-start gap-3">
                <HardDrive size={20} className="text-primary mt-0.5" />
                <div className="text-xs text-primary-dark font-medium leading-relaxed">
                  Supabase pauses free tier projects exceeding 500MB disk space. 
                  User tables currently consume <strong>{totalUserMB} MB</strong>.
                </div>
              </div>
            </div>
          </div>

          {/* Tables List */}
          <div className="bg-white rounded-2xl border border-light lg:col-span-2 overflow-hidden flex flex-col">
            <div className="p-4 bg-gray-50 border-b border-light">
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-500">Table Analytics</h3>
            </div>
            
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-light text-xs uppercase tracking-wider text-gray-400">
                    <th className="p-4 font-bold">Table Name</th>
                    <th className="p-4 font-bold">Rows (Est.)</th>
                    <th className="p-4 font-bold text-right">Size on Disk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-light">
                  {isLoading && stats.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-gray-400">Loading statistics...</td>
                    </tr>
                  ) : stats.map((stat, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold text-gray-700">{stat.table_name}</td>
                      <td className="p-4 text-gray-600 font-medium">
                        {stat.row_count.toLocaleString()}
                        {stat.table_name === 'live_messages' && stat.row_count > 1000 && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-700 uppercase tracking-widest">
                            Growing
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right font-black text-gray-900">{stat.total_size}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
