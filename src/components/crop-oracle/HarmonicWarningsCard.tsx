import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ShieldAlert, Droplets, Zap, Link2, Shield } from 'lucide-react';
import type { MasterCrop } from '@/hooks/useMasterCrops';
import { HARMONIC_ZONES, getZoneByFrequency } from '@/data/harmonicZoneProtocol';

/* ─── Harmonic Inter-Zone Dependency Warnings ───
   Enforces biological dependencies between frequency zones:
   - "No Fruit without Root": 528Hz tasks blocked if 396Hz Phosphorus is low
   - "Hydration Fuels Expression": 741Hz blocked if 417Hz irrigation is irregular
   - "Source Shield": 963Hz triggers Violet Shield directive on pest alert
   - General zone dependency chain
─── */

interface Warning {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  severity: 'critical' | 'caution' | 'info';
  color: string;
  dependencyZone: number; // freq of the zone this depends on
}

/** Get harmonic dependency warnings for a crop based on its frequency zone */
function getHarmonicWarnings(crop: MasterCrop): Warning[] {
  const warnings: Warning[] = [];
  const freq = crop.frequency_hz;
  const zone = getZoneByFrequency(freq);
  if (!zone) return warnings;

  // 528Hz (Alchemy/Solar) depends on 396Hz (Root/Phosphorus)
  if (freq === 528) {
    warnings.push({
      id: 'no-fruit-without-root',
      icon: <Zap className="w-3.5 h-3.5" />,
      title: 'NO FRUIT WITHOUT ROOT',
      description: 'Zone 3 (528Hz Alchemy) requires Zone 1 (396Hz Foundation) Phosphorus status to be active. Verify root anchoring before planting solar crops.',
      severity: 'critical',
      color: 'hsl(0 60% 50%)',
      dependencyZone: 396,
    });
  }

  // 741Hz (Expression/Voice) depends on 417Hz (Flow/Hydration)
  if (freq === 741) {
    warnings.push({
      id: 'hydration-fuels-expression',
      icon: <Droplets className="w-3.5 h-3.5" />,
      title: 'HYDRATION FUELS EXPRESSION',
      description: 'Zone 5 (741Hz Signal) requires Zone 2 (417Hz Flow) irrigation to be regular. Brix validation fails without consistent water transit.',
      severity: 'critical',
      color: 'hsl(210 60% 50%)',
      dependencyZone: 417,
    });
  }

  // 963Hz (Source/Shield) — triggers cross-zone garlic/onion directive
  if (freq === 963) {
    warnings.push({
      id: 'source-shield',
      icon: <Shield className="w-3.5 h-3.5" />,
      title: 'VIOLET SHIELD ACTIVE',
      description: 'Zone 7 (963Hz Source) activates the Garlic/Onion Shield across all zones when pest pressure is detected. This crop is part of the perimeter defense protocol.',
      severity: 'info',
      color: 'hsl(300 50% 50%)',
      dependencyZone: 963,
    });
  }

  // 639Hz (Heart) depends on both Root (396) and Flow (417)
  if (freq === 639) {
    warnings.push({
      id: 'heart-bridge',
      icon: <Link2 className="w-3.5 h-3.5" />,
      title: 'BRIDGE REQUIRES FOUNDATION',
      description: 'Zone 4 (639Hz Heart) bridges guilds via mycorrhizal networks. Requires both Zone 1 (Root) anchoring and Zone 2 (Flow) hydration to function as the integration layer.',
      severity: 'caution',
      color: 'hsl(120 50% 45%)',
      dependencyZone: 396,
    });
  }

  // 852Hz (Vision) depends on 528Hz (Solar/Alchemy)
  if (freq === 852) {
    warnings.push({
      id: 'vision-needs-alchemy',
      icon: <ShieldAlert className="w-3.5 h-3.5" />,
      title: 'VISION REQUIRES ALCHEMY',
      description: 'Zone 6 (852Hz Vision) medicinal/alkaloid density depends on Zone 3 (528Hz) nitrogen metabolism. Ensure solar crops are active before monitoring alkaloid output.',
      severity: 'caution',
      color: 'hsl(270 50% 50%)',
      dependencyZone: 528,
    });
  }

  return warnings;
}

const SEVERITY_STYLES = {
  critical: {
    bg: 'hsl(0 30% 7%)',
    border: 'hsl(0 40% 25%)',
    badge: 'hsl(0 60% 50%)',
    badgeBg: 'hsl(0 40% 15%)',
  },
  caution: {
    bg: 'hsl(45 20% 7%)',
    border: 'hsl(45 30% 20%)',
    badge: 'hsl(45 70% 55%)',
    badgeBg: 'hsl(45 30% 12%)',
  },
  info: {
    bg: 'hsl(270 15% 7%)',
    border: 'hsl(270 25% 20%)',
    badge: 'hsl(270 50% 60%)',
    badgeBg: 'hsl(270 25% 15%)',
  },
};

interface HarmonicWarningsCardProps {
  crop: MasterCrop;
}

const HarmonicWarningsCard = ({ crop }: HarmonicWarningsCardProps) => {
  const warnings = useMemo(() => getHarmonicWarnings(crop), [crop]);

  if (warnings.length === 0) return null;

  const zone = getZoneByFrequency(crop.frequency_hz);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl overflow-hidden"
      style={{
        background: 'hsl(0 0% 4%)',
        border: '1px solid hsl(0 0% 12%)',
      }}
    >
      <div className="p-3">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2.5">
          <AlertTriangle className="w-4 h-4" style={{ color: 'hsl(45 80% 55%)' }} />
          <span
            className="text-[10px] font-mono font-bold tracking-wider"
            style={{ color: 'hsl(45 80% 55%)' }}
          >
            HARMONIC DEPENDENCIES ({warnings.length})
          </span>
        </div>

        {/* Dependency chain visualization */}
        <div className="flex items-center gap-0.5 mb-3 px-1">
          {HARMONIC_ZONES.map((hz) => {
            const isActive = hz.frequencyHz === crop.frequency_hz;
            const isDependency = warnings.some(w => w.dependencyZone === hz.frequencyHz);
            return (
              <div key={hz.zone} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-full"
                  style={{
                    height: isActive ? 6 : isDependency ? 4 : 2,
                    background: isActive
                      ? hz.colorHsl
                      : isDependency
                        ? hz.colorHsl.replace(')', ' / 0.6)')
                        : 'hsl(0 0% 12%)',
                    boxShadow: isActive ? `0 0 8px ${hz.colorHsl}` : 'none',
                  }}
                />
                <span
                  className="text-[7px] font-mono"
                  style={{
                    color: isActive || isDependency ? hz.colorHsl : 'hsl(0 0% 20%)',
                    fontWeight: isActive ? 700 : 400,
                  }}
                >
                  {hz.note}
                </span>
              </div>
            );
          })}
        </div>

        {/* Warning items */}
        <div className="space-y-2">
          {warnings.map((warning, i) => {
            const style = SEVERITY_STYLES[warning.severity];
            const depZone = getZoneByFrequency(warning.dependencyZone);
            return (
              <motion.div
                key={warning.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-lg p-2.5"
                style={{
                  background: style.bg,
                  border: `1px solid ${style.border}`,
                }}
              >
                <div className="flex items-start gap-2">
                  <span style={{ color: warning.color }} className="mt-0.5 shrink-0">
                    {warning.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[9px] font-mono font-bold tracking-wider"
                        style={{ color: warning.color }}
                      >
                        {warning.title}
                      </span>
                      <span
                        className="text-[7px] font-mono px-1 py-0.5 rounded"
                        style={{
                          background: style.badgeBg,
                          color: style.badge,
                          border: `1px solid ${style.badge}40`,
                        }}
                      >
                        {warning.severity.toUpperCase()}
                      </span>
                    </div>
                    <p
                      className="text-[9px] font-mono leading-relaxed"
                      style={{ color: 'hsl(0 0% 50%)' }}
                    >
                      {warning.description}
                    </p>
                    {depZone && depZone.frequencyHz !== crop.frequency_hz && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ background: depZone.colorHsl }}
                        />
                        <span className="text-[8px] font-mono" style={{ color: 'hsl(0 0% 40%)' }}>
                          Depends on: {depZone.note}/{depZone.frequencyHz}Hz ({depZone.agroIdentity})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default HarmonicWarningsCard;
