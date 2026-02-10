import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Trash2, FolderOpen, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ENVIRONMENTS, FREQUENCY_PROTOCOLS, type EnvironmentType } from './soilConstants';

interface SoilConfig {
  id: string;
  name: string;
  environment: string;
  bed_width: number | null;
  bed_length: number | null;
  container_size: string | null;
  custom_gallons: number | null;
  frequency_hz: number | null;
  created_at: string;
}

interface SavedSoilConfigsProps {
  environment: EnvironmentType;
  bedWidth: number;
  bedLength: number;
  selectedHz: number | null;
  containerSize?: string;
  customGallons?: number;
  onLoad: (config: SoilConfig) => void;
}

const SavedSoilConfigs = ({
  environment,
  bedWidth,
  bedLength,
  selectedHz,
  containerSize,
  customGallons,
  onLoad,
}: SavedSoilConfigsProps) => {
  const [configs, setConfigs] = useState<SoilConfig[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUserId(session?.user?.id ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (userId && isOpen) fetchConfigs();
  }, [userId, isOpen]);

  const fetchConfigs = async () => {
    const { data, error } = await supabase
      .from('saved_soil_configs')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setConfigs(data as SoilConfig[]);
  };

  const handleSave = async () => {
    if (!userId) { toast.error('Sign in to save configs'); return; }
    if (!saveName.trim()) { toast.error('Enter a name'); return; }
    setIsSaving(true);
    const { error } = await supabase.from('saved_soil_configs').insert({
      user_id: userId,
      name: saveName.trim(),
      environment,
      bed_width: environment !== 'pot' ? bedWidth : null,
      bed_length: environment !== 'pot' ? bedLength : null,
      container_size: environment === 'pot' ? (containerSize || '5gal') : null,
      custom_gallons: environment === 'pot' ? (customGallons || null) : null,
      frequency_hz: selectedHz,
    });
    setIsSaving(false);
    if (error) { toast.error('Failed to save'); return; }
    toast.success(`"${saveName}" saved`);
    setSaveName('');
    setShowNameInput(false);
    fetchConfigs();
  };

  const handleDelete = async (id: string, name: string) => {
    const { error } = await supabase.from('saved_soil_configs').delete().eq('id', id);
    if (!error) {
      toast.success(`"${name}" deleted`);
      setConfigs((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const envLabel = (env: string) => ENVIRONMENTS.find((e) => e.id === env)?.label || env;
  const hzLabel = (hz: number | null) => hz && FREQUENCY_PROTOCOLS[hz] ? `${FREQUENCY_PROTOCOLS[hz].name} ${hz}Hz` : '';

  if (!userId) return null;

  return (
    <div className="mt-4">
      {/* Toggle bar */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-mono"
          style={{
            background: isOpen ? 'hsl(51 30% 15%)' : 'hsl(0 0% 12%)',
            border: `1px solid ${isOpen ? 'hsl(51 50% 35%)' : 'hsl(0 0% 22%)'}`,
            color: isOpen ? 'hsl(51 70% 60%)' : 'hsl(0 0% 55%)',
          }}
        >
          <FolderOpen className="w-3 h-3" />
          MY CONFIGS {configs.length > 0 && `(${configs.length})`}
        </button>

        {!showNameInput ? (
          <button
            onClick={() => setShowNameInput(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded text-[10px] font-mono"
            style={{ background: 'hsl(120 20% 12%)', border: '1px solid hsl(120 30% 30%)', color: 'hsl(120 50% 55%)' }}
          >
            <Save className="w-3 h-3" />
            SAVE CURRENT
          </button>
        ) : (
          <div className="flex items-center gap-1 flex-1">
            <input
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="Config name..."
              className="flex-1 px-2 py-1 rounded text-[10px] font-mono"
              style={{ background: 'hsl(0 0% 12%)', border: '1px solid hsl(51 40% 35%)', color: 'hsl(51 70% 70%)', outline: 'none' }}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              autoFocus
            />
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-2 py-1 rounded text-[10px] font-mono"
              style={{ background: 'hsl(120 30% 20%)', border: '1px solid hsl(120 40% 35%)', color: 'hsl(120 60% 60%)' }}
            >
              {isSaving ? '...' : '✓'}
            </button>
            <button
              onClick={() => { setShowNameInput(false); setSaveName(''); }}
              className="px-1 py-1 rounded"
              style={{ color: 'hsl(0 0% 50%)' }}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Saved configs list */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mt-2 space-y-1.5"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {configs.length === 0 && (
              <p className="text-[10px] font-mono p-3 text-center" style={{ color: 'hsl(0 0% 40%)' }}>
                No saved configs yet. Save your current settings above.
              </p>
            )}
            {configs.map((config) => (
              <div
                key={config.id}
                className="flex items-center gap-2 p-2.5 rounded-lg"
                style={{ background: 'hsl(0 0% 10%)', border: '1px solid hsl(0 0% 18%)' }}
              >
                <button
                  onClick={() => { onLoad(config); toast.success(`Loaded "${config.name}"`); }}
                  className="flex-1 text-left min-w-0"
                >
                  <span className="text-xs font-mono font-bold block truncate" style={{ color: 'hsl(35 60% 65%)' }}>
                    {config.name}
                  </span>
                  <span className="text-[9px] font-mono block" style={{ color: 'hsl(0 0% 50%)' }}>
                    {envLabel(config.environment)}
                    {config.bed_width && config.bed_length ? ` · ${config.bed_width}×${config.bed_length}ft` : ''}
                    {config.container_size ? ` · ${config.container_size}` : ''}
                    {config.frequency_hz ? ` · ${hzLabel(config.frequency_hz)}` : ''}
                  </span>
                </button>
                <button
                  onClick={() => handleDelete(config.id, config.name)}
                  className="p-1.5 rounded shrink-0"
                  style={{ color: 'hsl(0 50% 50%)' }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SavedSoilConfigs;
