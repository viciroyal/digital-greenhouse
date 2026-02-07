import { useEffect, useRef, useCallback } from 'react';
import { useAudioBiome } from '@/contexts/AudioBiomeContext';

// Ambient audio URLs - using free ambient sound samples
const AUDIO_SOURCES = {
  ether: 'https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3', // Wind ambience
  labor: 'https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3', // Nature/birds
  roots: 'https://assets.mixkit.co/active_storage/sfx/78/78-preview.mp3', // Water stream
};

const AudioBiomeManager = () => {
  const { isAudioEnabled, setZoneVolumes, setCurrentZone } = useAudioBiome();
  
  const audioRefs = useRef<{
    ether: HTMLAudioElement | null;
    labor: HTMLAudioElement | null;
    roots: HTMLAudioElement | null;
  }>({ ether: null, labor: null, roots: null });
  
  const animationFrameRef = useRef<number>();
  const targetVolumesRef = useRef({ ether: 1, labor: 0, roots: 0 });
  const currentVolumesRef = useRef({ ether: 0, labor: 0, roots: 0 });

  // Initialize audio elements
  useEffect(() => {
    const zones = ['ether', 'labor', 'roots'] as const;
    
    zones.forEach(zone => {
      const audio = new Audio(AUDIO_SOURCES[zone]);
      audio.loop = true;
      audio.volume = 0;
      audio.preload = 'auto';
      audioRefs.current[zone] = audio;
    });

    return () => {
      zones.forEach(zone => {
        const audio = audioRefs.current[zone];
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      });
    };
  }, []);

  // Smooth volume interpolation
  const interpolateVolumes = useCallback(() => {
    const LERP_SPEED = 0.05; // Smooth fade speed
    let needsUpdate = false;

    (['ether', 'labor', 'roots'] as const).forEach(zone => {
      const target = targetVolumesRef.current[zone];
      const current = currentVolumesRef.current[zone];
      const diff = target - current;

      if (Math.abs(diff) > 0.01) {
        currentVolumesRef.current[zone] = current + diff * LERP_SPEED;
        needsUpdate = true;
        
        const audio = audioRefs.current[zone];
        if (audio) {
          audio.volume = Math.max(0, Math.min(1, currentVolumesRef.current[zone]));
        }
      } else {
        currentVolumesRef.current[zone] = target;
      }
    });

    if (needsUpdate) {
      animationFrameRef.current = requestAnimationFrame(interpolateVolumes);
    }
  }, []);

  // Calculate zone volumes based on scroll position
  const calculateZoneVolumes = useCallback(() => {
    const scrollY = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = documentHeight > 0 ? scrollY / documentHeight : 0;

    // Zone boundaries
    const etherEnd = 0.3;
    const laborStart = 0.25;
    const laborEnd = 0.75;
    const rootsStart = 0.7;

    let etherVol = 0;
    let laborVol = 0;
    let rootsVol = 0;

    // Ether zone (0% - 30%)
    if (scrollPercent <= etherEnd) {
      if (scrollPercent <= laborStart) {
        etherVol = 1;
      } else {
        // Fade out from laborStart to etherEnd
        etherVol = 1 - ((scrollPercent - laborStart) / (etherEnd - laborStart));
      }
    }

    // Labor zone (25% - 75%)
    if (scrollPercent >= laborStart && scrollPercent <= laborEnd) {
      if (scrollPercent <= etherEnd) {
        // Fade in from laborStart to etherEnd
        laborVol = (scrollPercent - laborStart) / (etherEnd - laborStart);
      } else if (scrollPercent >= rootsStart) {
        // Fade out from rootsStart to laborEnd
        laborVol = 1 - ((scrollPercent - rootsStart) / (laborEnd - rootsStart));
      } else {
        laborVol = 1;
      }
    }

    // Roots zone (70% - 100%)
    if (scrollPercent >= rootsStart) {
      if (scrollPercent <= laborEnd) {
        // Fade in from rootsStart to laborEnd
        rootsVol = (scrollPercent - rootsStart) / (laborEnd - rootsStart);
      } else {
        rootsVol = 1;
      }
    }

    // Clamp values
    etherVol = Math.max(0, Math.min(1, etherVol));
    laborVol = Math.max(0, Math.min(1, laborVol));
    rootsVol = Math.max(0, Math.min(1, rootsVol));

    targetVolumesRef.current = { ether: etherVol, labor: laborVol, roots: rootsVol };
    setZoneVolumes({ ether: etherVol, labor: laborVol, roots: rootsVol });

    // Determine current dominant zone
    if (etherVol >= laborVol && etherVol >= rootsVol) {
      setCurrentZone('ether');
    } else if (laborVol >= rootsVol) {
      setCurrentZone('labor');
    } else {
      setCurrentZone('roots');
    }

    // Start interpolation
    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(interpolateVolumes);
    }
  }, [setZoneVolumes, setCurrentZone, interpolateVolumes]);

  // Handle audio enable/disable
  useEffect(() => {
    const zones = ['ether', 'labor', 'roots'] as const;

    if (isAudioEnabled) {
      zones.forEach(zone => {
        const audio = audioRefs.current[zone];
        if (audio) {
          audio.play().catch(() => {
            // Autoplay blocked - user needs to interact first
            console.log('Audio autoplay blocked for zone:', zone);
          });
        }
      });
      calculateZoneVolumes();
    } else {
      zones.forEach(zone => {
        const audio = audioRefs.current[zone];
        if (audio) {
          audio.pause();
        }
      });
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
    }
  }, [isAudioEnabled, calculateZoneVolumes]);

  // Scroll listener
  useEffect(() => {
    if (!isAudioEnabled) return;

    const handleScroll = () => {
      calculateZoneVolumes();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isAudioEnabled, calculateZoneVolumes]);

  return null; // This is a logic-only component
};

export default AudioBiomeManager;
