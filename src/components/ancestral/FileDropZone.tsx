import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Check, Loader2 } from 'lucide-react';

interface FileDropZoneProps {
  color: string;
  onFileUpload: (file: File) => void;
}

/**
 * File Drop Zone - "The Seed Bed"
 * A dashed border area for uploading proof of work
 */
const FileDropZone = ({ color, onFileUpload }: FileDropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play digging/planting sound effect
  const playPlantingSound = useCallback(() => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = audioContext;

    // Create a "digging" sound with filtered noise
    const bufferSize = audioContext.sampleRate * 0.5;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      // Create granular soil-like texture
      const envelope = Math.sin(Math.PI * i / bufferSize);
      data[i] = (Math.random() * 2 - 1) * envelope * 0.3;
    }

    const source = audioContext.createBufferSource();
    source.buffer = buffer;

    // Low-pass filter for earthy tone
    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, audioContext.currentTime);
    filter.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.5);

    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    source.start();

    // Second "thud" for planting
    setTimeout(() => {
      const thudOsc = audioContext.createOscillator();
      const thudGain = audioContext.createGain();
      thudOsc.type = 'sine';
      thudOsc.frequency.setValueAtTime(80, audioContext.currentTime);
      thudOsc.frequency.exponentialRampToValueAtTime(40, audioContext.currentTime + 0.2);
      thudGain.gain.setValueAtTime(0.3, audioContext.currentTime);
      thudGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      thudOsc.connect(thudGain);
      thudGain.connect(audioContext.destination);
      thudOsc.start();
      thudOsc.stop(audioContext.currentTime + 0.3);
    }, 200);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const processFile = (file: File) => {
    setIsUploading(true);
    playPlantingSound();
    
    // Simulate upload delay
    setTimeout(() => {
      setUploadedFile(file);
      setIsUploading(false);
      onFileUpload(file);
    }, 1500);
  };

  return (
    <motion.div
      className="relative rounded-2xl p-1 cursor-pointer"
      style={{
        background: `linear-gradient(135deg, ${color}30, ${color}10)`,
      }}
      onClick={() => !uploadedFile && fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      whileHover={!uploadedFile ? { scale: 1.02 } : {}}
      whileTap={!uploadedFile ? { scale: 0.98 } : {}}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      <div
        className="relative rounded-xl p-8 flex flex-col items-center justify-center min-h-[200px] transition-all duration-300"
        style={{
          background: 'hsl(0 0% 8%)',
          border: isDragging 
            ? `3px solid ${color}` 
            : uploadedFile 
              ? `2px solid hsl(140 60% 40%)` 
              : `2px dashed ${color}60`,
          boxShadow: isDragging 
            ? `0 0 30px ${color}40, inset 0 0 20px ${color}10`
            : 'none',
        }}
      >
        {/* Seed bed texture */}
        <div 
          className="absolute inset-0 rounded-xl opacity-20 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div
              key="uploading"
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 className="w-12 h-12" style={{ color }} />
              </motion.div>
              <p 
                className="mt-4 text-sm font-mono"
                style={{ color: 'hsl(40 50% 60%)' }}
              >
                PLANTING SEED...
              </p>
            </motion.div>
          ) : uploadedFile ? (
            <motion.div
              key="uploaded"
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: 'hsl(140 50% 25%)',
                  border: '2px solid hsl(140 60% 40%)',
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <Check className="w-8 h-8" style={{ color: 'hsl(140 70% 50%)' }} />
              </motion.div>
              <p 
                className="mt-4 text-sm font-mono text-center"
                style={{ color: 'hsl(140 60% 50%)' }}
              >
                SEED PLANTED
              </p>
              <p 
                className="mt-1 text-xs font-mono opacity-70"
                style={{ color: 'hsl(40 50% 60%)' }}
              >
                {uploadedFile.name}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              className="flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                animate={isDragging ? {
                  y: [0, -10, 0],
                  scale: [1, 1.1, 1],
                } : {}}
                transition={{ duration: 0.5, repeat: isDragging ? Infinity : 0 }}
              >
                <Upload 
                  className="w-12 h-12" 
                  style={{ color: isDragging ? color : `${color}80` }} 
                />
              </motion.div>
              
              <p 
                className="mt-4 text-sm font-mono text-center"
                style={{ color: isDragging ? color : 'hsl(40 50% 60%)' }}
              >
                {isDragging ? 'RELEASE TO PLANT' : 'DROP YOUR EVIDENCE HERE'}
              </p>
              <p 
                className="mt-1 text-xs font-mono opacity-60"
                style={{ color: 'hsl(40 40% 50%)' }}
              >
                to plant the seed
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Corner soil mounds decoration */}
        <div 
          className="absolute bottom-2 left-2 w-8 h-4 rounded-full opacity-30"
          style={{ background: `linear-gradient(0deg, ${color}40, transparent)` }}
        />
        <div 
          className="absolute bottom-2 right-2 w-6 h-3 rounded-full opacity-30"
          style={{ background: `linear-gradient(0deg, ${color}40, transparent)` }}
        />
      </div>
    </motion.div>
  );
};

export default FileDropZone;
