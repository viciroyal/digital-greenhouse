import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Map, PenTool } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GrimoireView from './GrimoireView';
import StewardsLog from './StewardsLog';
import { VibrationalLegend, SevenPillars, SovereigntyFooter } from '@/components/almanac';

interface PathContentViewProps {
  userId?: string;
  displayModules: Array<{
    id: string;
    level: number;
    title: string;
    mission: string;
    lineage: string;
    color: string;
    iconName: string;
    isUnlocked: boolean;
    isCompleted: boolean;
    completionPercent: number;
  }>;
  onModuleSelect: (module: any) => void;
  onEnterKidsMode: () => void;
}

/**
 * PATH CONTENT VIEW
 * 
 * The "Why" / Theory / Vision section with tabbed navigation:
 * - THE ALMANAC: Living reference book (Grimoire)
 * - THE SPIRIT: Deep knowledge (Vibrational Legend + 7 Pillars)
 * - THE LOG: Personal journal for recording
 */
const PathContentView = ({ userId, displayModules, onModuleSelect, onEnterKidsMode }: PathContentViewProps) => {
  const [activeTab, setActiveTab] = useState('almanac');

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Tabbed Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <TabsList
            className="grid grid-cols-3 gap-1 p-1.5 rounded-full"
            style={{
              background: 'hsl(20 30% 10% / 0.95)',
              border: '1px solid hsl(40 40% 25%)',
            }}
          >
            <TabsTrigger
              value="almanac"
              className="flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs tracking-wider transition-all data-[state=active]:bg-[hsl(40_45%_22%)] data-[state=active]:text-[hsl(40_70%_70%)] data-[state=inactive]:text-[hsl(40_30%_50%)]"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">ALMANAC</span>
            </TabsTrigger>
            <TabsTrigger
              value="spirit"
              className="flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs tracking-wider transition-all data-[state=active]:bg-[hsl(270_45%_25%)] data-[state=active]:text-[hsl(270_70%_75%)] data-[state=inactive]:text-[hsl(40_30%_50%)]"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">SPIRIT</span>
            </TabsTrigger>
            <TabsTrigger
              value="log"
              className="flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs tracking-wider transition-all data-[state=active]:bg-[hsl(140_40%_22%)] data-[state=active]:text-[hsl(140_60%_65%)] data-[state=inactive]:text-[hsl(40_30%_50%)]"
            >
              <PenTool className="w-4 h-4" />
              <span className="hidden sm:inline">LOG</span>
            </TabsTrigger>
          </TabsList>
        </motion.div>

        {/* Tab Content */}
        <TabsContent value="almanac" className="mt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GrimoireView
              onEnterFieldLab={(moduleLevel) => {
                const targetModule = displayModules.find(m => m.level === moduleLevel);
                if (targetModule) {
                  onModuleSelect(targetModule);
                }
              }}
            />
          </motion.div>
        </TabsContent>

        <TabsContent value="spirit" className="mt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-12"
          >
            {/* Header for Spirit Section */}
            <div className="text-center mb-8">
              <h2
                className="text-2xl md:text-3xl tracking-wider mb-2"
                style={{
                  fontFamily: "'Staatliches', sans-serif",
                  color: 'hsl(270 60% 70%)',
                  textShadow: '0 0 30px hsl(270 50% 40% / 0.5)',
                }}
              >
                THE VIBRATIONAL LEGEND
              </h2>
              <p
                className="text-sm font-mono"
                style={{ color: 'hsl(270 40% 60%)' }}
              >
                The Solfeggio Frequencies & The Seven Pillars of Sovereign Agriculture
              </p>
            </div>
            
            <VibrationalLegend />
            <SevenPillars />
          </motion.div>
        </TabsContent>

        <TabsContent value="log" className="mt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <StewardsLog userId={userId} />
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Sovereignty Footer */}
      <SovereigntyFooter />
    </div>
  );
};

export default PathContentView;
