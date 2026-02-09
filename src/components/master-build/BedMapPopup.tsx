import { useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, Play, Square, Signal } from 'lucide-react';
import { GardenBed, BedPlanting } from '@/hooks/useGardenBeds';
import { getZoneByFrequency } from '@/data/harmonicZoneProtocol';

/**
 * BED POPUP — "Liner Notes" for a single bed
 * Shows current crop, NIR waveform visualization, Play Frequency button
 */

interface BedMapPopupProps {
  bed: GardenBed;
  plantings: BedPlanting[];
  onClose: () => void;
}

const BedMapPopup = ({ bed, plantings, onClose }: BedMapPopupProps) => {
  const zone = getZoneByFrequency(bed.frequency_hz);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<OscillatorNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const isPlayingRef = useRef(false);

  const leadPlanting = plantings.find(p => p.crop?.chord_interval === 'Root (Lead)');
  const companionPlantings = plantings.filter(p => p.crop?.chord_interval !== 'Root (Lead)');
  const brix = bed.internal_brix;

  // Draw NIR waveform: smooth sine for high Brix, jagged noise for low
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const color = zone?.colorHsl || 'hsl(0 0% 50%)';

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;

      for (let x = 0; x < w; x++) {
        const t = (x / w) * Math.PI * 6 + frame * 0.03;
        let y: number;

        if (brix !== null && brix >= 12) {
          // Smooth sine wave — high fidelity
          const amp = 15 + (brix / 24) * 15;
          y = h / 2 + Math.sin(t) * amp;
        } else {
          // Jagged noise — low fidelity / dissonant
          const noise = (Math.random() - 0.5) * 30;
          const base = Math.sin(t * 2.5) * 10;
          y = h / 2 + base + noise;
        }

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
      frame++;
      requestAnimationFrame(animate);
    };

    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [brix, zone]);

  const togglePlayFrequency = useCallback(() => {
    if (isPlayingRef.current) {
      audioRef.current?.stop();
      audioRef.current = null;
      audioCtxRef.current?.close();
      audioCtxRef.current = null;
      isPlayingRef.current = false;
      return;
    }

    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = bed.frequency_hz;
    gain.gain.value = 0.15;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();

    // Fade out after 4 seconds
    gain.gain.setTargetAtTime(0, ctx.currentTime + 3, 0.5);
    osc.stop(ctx.currentTime + 5);

    audioRef.current = osc;
    audioCtxRef.current = ctx;
    isPlayingRef.current = true;

    osc.onended = () => {
      isPlayingRef.current = false;
      audioCtxRef.current?.close();
      audioCtxRef.current = null;
    };
  }, [bed.frequency_hz]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      audioRef.current?.stop();
      audioCtxRef.current?.close();
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        className="relative z-10 w-full max-w-sm rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, hsl(20 20% 8%), hsl(0 0% 5%))',
          border: `1px solid ${zone?.colorHsl || 'hsl(0 0% 25%)'}`,
          boxShadow: `0 0 40px ${(zone?.colorHsl || 'hsl(0 0% 25%)').replace(')', ' / 0.3)')}`,
        }}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        {/* Header */}
        <div
          className="p-4 flex items-center justify-between"
          style={{
            background: (zone?.colorHsl || 'hsl(0 0% 30%)').replace(')', ' / 0.1)'),
            borderBottom: `1px solid ${(zone?.colorHsl || 'hsl(0 0% 25%)').replace(')', ' / 0.3)')}`,
          }}
        >
          <div>
            <p className="text-[9px] font-mono tracking-wider" style={{ color: 'hsl(0 0% 45%)' }}>
              BED #{bed.bed_number} • {zone?.agroIdentity.toUpperCase() || bed.zone_name}
            </p>
            <h3
              className="text-xl tracking-wider"
              style={{ fontFamily: "'Staatliches', sans-serif", color: zone?.colorHsl || 'hsl(0 0% 70%)' }}
            >
              {leadPlanting?.crop?.common_name || leadPlanting?.crop?.name || 'In Rehearsal'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full"
            style={{ background: 'hsl(0 0% 15%)', border: '1px solid hsl(0 0% 25%)' }}
          >
            <X className="w-4 h-4" style={{ color: 'hsl(0 0% 50%)' }} />
          </button>
        </div>

        {/* Crop "In Rehearsal" */}
        <div className="p-4">
          <p className="text-[9px] font-mono tracking-wider mb-2" style={{ color: 'hsl(0 0% 40%)' }}>
            CURRENT CROP "IN REHEARSAL"
          </p>
          {leadPlanting ? (
            <div className="flex items-center gap-3 mb-1">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                style={{ background: (zone?.colorHsl || 'hsl(0 0% 30%)').replace(')', ' / 0.2)') }}
              >
                🌱
              </div>
              <div>
                <p className="text-sm font-mono font-bold" style={{ color: 'hsl(0 0% 80%)' }}>
                  {leadPlanting.crop?.common_name || leadPlanting.crop?.name}
                </p>
                <p className="text-[9px] font-mono" style={{ color: 'hsl(0 0% 45%)' }}>
                  {companionPlantings.length} companion{companionPlantings.length !== 1 ? 's' : ''} • {bed.frequency_hz}Hz
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs font-mono" style={{ color: 'hsl(0 0% 35%)' }}>
              No crop assigned — silent channel.
            </p>
          )}
        </div>

        {/* NIR Waveform */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 mb-2">
            <Signal className="w-3 h-3" style={{ color: zone?.colorHsl || 'hsl(0 0% 50%)' }} />
            <span className="text-[9px] font-mono tracking-wider" style={{ color: 'hsl(0 0% 40%)' }}>
              NIR SPECTROSCOPY — {brix !== null ? `${brix}° BRIX` : 'NO DATA'}
            </span>
          </div>
          <canvas
            ref={canvasRef}
            width={320}
            height={60}
            className="w-full rounded-lg"
            style={{
              background: 'hsl(0 0% 4%)',
              border: '1px solid hsl(0 0% 15%)',
            }}
          />
          {brix !== null && (
            <p className="text-[9px] font-mono mt-1 text-center" style={{ color: 'hsl(0 0% 40%)' }}>
              {brix >= 20 ? '◆ STUDIO MASTER' : brix >= 15 ? '◆ HIGH FIDELITY' : brix >= 12 ? '◆ STANDARD DEF' : '◆ LO-FI — NEEDS TUNING'}
            </p>
          )}
        </div>

        {/* Play Frequency Button */}
        <div className="px-4 pb-4">
          <motion.button
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-mono text-sm tracking-wider"
            style={{
              background: `linear-gradient(135deg, ${(zone?.colorHsl || 'hsl(0 0% 40%)').replace(')', ' / 0.2)')}, hsl(0 0% 8%))`,
              border: `1px solid ${zone?.colorHsl || 'hsl(0 0% 30%)'}`,
              color: zone?.colorHsl || 'hsl(0 0% 60%)',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={togglePlayFrequency}
          >
            <Play className="w-4 h-4" />
            PLAY {bed.frequency_hz}Hz — {zone?.note || '?'} TONE
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BedMapPopup;
