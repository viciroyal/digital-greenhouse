import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, Eye, Clock, ArrowLeft, Download, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAdminRole } from '@/hooks/useAdminRole';
import { toast } from 'sonner';

interface Submission {
  id: string;
  user_id: string;
  lesson_id: string;
  file_name: string;
  file_path: string;
  file_type: string | null;
  file_size: number | null;
  status: string;
  uploaded_at: string;
  reviewed_at: string | null;
  lesson?: {
    display_name: string;
    module?: {
      display_name: string;
      chakra_color: string;
    };
  };
}

/**
 * The Hogon's Review Chamber
 * Admin interface for reviewing and certifying user submissions
 */
const HogonReview = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: roleLoading } = useAdminRole();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewed' | 'certified'>('pending');

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      toast.error('Access denied. Only the Hogon may enter.');
      navigate('/ancestral-path');
    }
  }, [isAdmin, roleLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchSubmissions();
    }
  }, [isAdmin, filter]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('field_journal')
        .select(`
          *,
          lesson:lessons (
            display_name,
            module:modules (
              display_name,
              chakra_color
            )
          )
        `)
        .order('uploaded_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData = (data || []).map(item => ({
        ...item,
        lesson: item.lesson ? {
          display_name: item.lesson.display_name,
          module: item.lesson.module ? {
            display_name: item.lesson.module.display_name,
            chakra_color: item.lesson.module.chakra_color
          } : undefined
        } : undefined
      }));
      
      setSubmissions(transformedData);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: 'reviewed' | 'certified') => {
    try {
      const { error } = await supabase
        .from('field_journal')
        .update({ 
          status: newStatus,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Submission ${newStatus === 'certified' ? 'certified' : 'marked as reviewed'}!`);
      fetchSubmissions();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update submission');
    }
  };

  const getFileUrl = async (filePath: string) => {
    const { data, error } = await supabase.storage
      .from('field-journal')
      .createSignedUrl(filePath, 3600); // 1 hour expiry

    if (error) {
      toast.error('Failed to get file URL');
      return null;
    }
    return data.signedUrl;
  };

  const handleDownload = async (submission: Submission) => {
    const url = await getFileUrl(submission.file_path);
    if (url) {
      window.open(url, '_blank');
    }
  };

  const statusColors = {
    pending: { bg: 'hsl(40 40% 15%)', border: 'hsl(40 50% 30%)', text: 'hsl(40 60% 60%)' },
    reviewed: { bg: 'hsl(200 40% 15%)', border: 'hsl(200 50% 40%)', text: 'hsl(200 60% 60%)' },
    certified: { bg: 'hsl(51 50% 15%)', border: 'hsl(51 100% 50%)', text: 'hsl(51 100% 60%)' },
  };

  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'hsl(20 15% 8%)' }}>
        <motion.div
          className="text-xl font-mono"
          style={{ color: 'hsl(40 50% 60%)' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Consulting the Ancestors...
        </motion.div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div 
      className="min-h-screen p-6 md:p-10"
      style={{ background: 'linear-gradient(180deg, hsl(20 15% 8%), hsl(20 20% 5%))' }}
    >
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <motion.button
          onClick={() => navigate('/ancestral-path')}
          className="flex items-center gap-2 mb-6 px-4 py-2 rounded-lg font-mono text-sm"
          style={{
            background: 'hsl(0 0% 12%)',
            border: '1px solid hsl(0 0% 25%)',
            color: 'hsl(40 50% 60%)',
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Path
        </motion.button>

        <div className="flex items-center gap-4 mb-6">
          <div 
            className="p-3 rounded-full"
            style={{
              background: 'linear-gradient(135deg, hsl(51 50% 20%), hsl(40 40% 15%))',
              border: '2px solid hsl(51 100% 50%)',
              boxShadow: '0 0 30px hsl(51 80% 40% / 0.3)',
            }}
          >
            <Shield className="w-8 h-8" style={{ color: 'hsl(51 100% 60%)' }} />
          </div>
          <div>
            <h1 
              className="text-3xl md:text-4xl tracking-wider"
              style={{
                fontFamily: "'Staatliches', sans-serif",
                color: 'hsl(51 100% 50%)',
                textShadow: '0 0 20px hsl(51 80% 40% / 0.5)',
              }}
            >
              THE HOGON'S CHAMBER
            </h1>
            <p 
              className="text-sm font-mono mt-1"
              style={{ color: 'hsl(40 40% 50%)' }}
            >
              Review and certify the work of aspiring Pharmers
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          {(['all', 'pending', 'reviewed', 'certified'] as const).map((f) => (
            <motion.button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-2 rounded-lg font-mono text-sm capitalize"
              style={{
                background: filter === f ? 'hsl(51 40% 20%)' : 'hsl(0 0% 12%)',
                border: filter === f ? '1px solid hsl(51 100% 50%)' : '1px solid hsl(0 0% 25%)',
                color: filter === f ? 'hsl(51 100% 60%)' : 'hsl(0 0% 60%)',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {f === 'all' ? 'All Submissions' : f}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Submissions Grid */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="text-center py-20">
            <motion.div
              className="text-lg font-mono"
              style={{ color: 'hsl(40 50% 60%)' }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Gathering submissions from the field...
            </motion.div>
          </div>
        ) : submissions.length === 0 ? (
          <div 
            className="text-center py-20 rounded-xl"
            style={{
              background: 'hsl(0 0% 10%)',
              border: '1px solid hsl(0 0% 20%)',
            }}
          >
            <Clock className="w-12 h-12 mx-auto mb-4" style={{ color: 'hsl(0 0% 40%)' }} />
            <p className="text-lg font-mono" style={{ color: 'hsl(0 0% 50%)' }}>
              No {filter === 'all' ? '' : filter} submissions awaiting review
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {submissions.map((submission) => {
                const colors = statusColors[submission.status as keyof typeof statusColors] || statusColors.pending;
                
                return (
                  <motion.div
                    key={submission.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-6 rounded-xl"
                    style={{
                      background: 'hsl(20 20% 10%)',
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Submission Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {submission.lesson?.module && (
                            <span 
                              className="px-2 py-1 rounded text-xs font-mono"
                              style={{
                                background: `${submission.lesson.module.chakra_color}20`,
                                color: submission.lesson.module.chakra_color,
                                border: `1px solid ${submission.lesson.module.chakra_color}50`,
                              }}
                            >
                              {submission.lesson.module.display_name}
                            </span>
                          )}
                          <span 
                            className="px-2 py-1 rounded text-xs font-mono uppercase"
                            style={{
                              background: colors.bg,
                              color: colors.text,
                              border: `1px solid ${colors.border}`,
                            }}
                          >
                            {submission.status}
                          </span>
                        </div>
                        
                        <h3 
                          className="text-lg mb-1"
                          style={{
                            fontFamily: "'Staatliches', sans-serif",
                            color: 'hsl(40 60% 70%)',
                          }}
                        >
                          {submission.lesson?.display_name || 'Unknown Lesson'}
                        </h3>
                        
                        <p 
                          className="text-sm font-mono mb-2"
                          style={{ color: 'hsl(40 40% 50%)' }}
                        >
                          File: {submission.file_name}
                          {submission.file_size && ` (${Math.round(submission.file_size / 1024)}KB)`}
                        </p>
                        
                        <p 
                          className="text-xs font-mono"
                          style={{ color: 'hsl(0 0% 50%)' }}
                        >
                          Submitted: {new Date(submission.uploaded_at).toLocaleDateString()} at{' '}
                          {new Date(submission.uploaded_at).toLocaleTimeString()}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <motion.button
                          onClick={() => handleDownload(submission)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm"
                          style={{
                            background: 'hsl(200 40% 20%)',
                            border: '1px solid hsl(200 50% 40%)',
                            color: 'hsl(200 60% 70%)',
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Download className="w-4 h-4" />
                          View
                        </motion.button>

                        {submission.status === 'pending' && (
                          <motion.button
                            onClick={() => updateStatus(submission.id, 'reviewed')}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm"
                            style={{
                              background: 'hsl(0 0% 15%)',
                              border: '1px solid hsl(0 0% 30%)',
                              color: 'hsl(0 0% 70%)',
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Eye className="w-4 h-4" />
                            Mark Reviewed
                          </motion.button>
                        )}

                        {(submission.status === 'pending' || submission.status === 'reviewed') && (
                          <motion.button
                            onClick={() => updateStatus(submission.id, 'certified')}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm"
                            style={{
                              background: 'linear-gradient(135deg, hsl(51 50% 25%), hsl(40 40% 20%))',
                              border: '1px solid hsl(51 100% 50%)',
                              color: 'hsl(51 100% 70%)',
                              boxShadow: '0 0 15px hsl(51 80% 40% / 0.3)',
                            }}
                            whileHover={{ 
                              scale: 1.02,
                              boxShadow: '0 0 25px hsl(51 80% 50% / 0.5)',
                            }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Star className="w-4 h-4" />
                            Certify
                          </motion.button>
                        )}

                        {submission.status === 'certified' && (
                          <div 
                            className="flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm"
                            style={{
                              background: 'hsl(51 50% 15%)',
                              border: '1px solid hsl(51 100% 50%)',
                              color: 'hsl(51 100% 60%)',
                            }}
                          >
                            <CheckCircle className="w-4 h-4" />
                            Certified Steward
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default HogonReview;
