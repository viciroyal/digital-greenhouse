import { motion } from 'framer-motion';
import { Users, Store, Leaf, Globe, ExternalLink } from 'lucide-react';

interface GACommunityResourcesProps {
  variant?: 'compact' | 'full';
}

const ORGS = [
  {
    name: 'HABESHA',
    type: 'Cultural Community Organization',
    note: 'Ethiopian & Eritrean agricultural heritage network in Georgia',
    color: 'hsl(45 60% 55%)',
    icon: '🌍',
    url: null,
  },
  {
    name: 'Collectively Sustainable',
    type: 'Sustainability Collective',
    note: 'Black-led sustainability education & community organizing',
    color: 'hsl(160 50% 50%)',
    icon: '♻️',
    url: null,
  },
  {
    name: 'Black Sustainability',
    type: 'Environmental Justice',
    note: 'Centering Black communities in sustainability movements',
    color: 'hsl(270 40% 55%)',
    icon: '✊🏿',
    url: 'https://blacksustainability.org',
  },
  {
    name: 'Love Is Love Farm',
    type: 'Community Farm',
    note: 'Local GA farm rooted in love, land stewardship & community food access',
    color: 'hsl(340 55% 55%)',
    icon: '❤️',
    url: 'https://loveislovefarm.com',
  },
  {
    name: 'Grow Where You Are',
    type: 'Urban Farm & Education',
    note: 'Rooted in GA — growing food, community & resilience where you stand',
    color: 'hsl(90 45% 50%)',
    icon: '🌱',
    url: 'https://growwhereyouare.farm',
  },
  {
    name: 'Soul Fire Farm',
    type: 'Afro-Indigenous Land Stewardship',
    note: 'BIPOC-centered community farm — ending racism in the food system through land justice',
    color: 'hsl(25 65% 55%)',
    icon: '🔥',
    url: 'https://www.soulfirefarm.org',
  },
  {
    name: 'Community Farmers Markets',
    type: 'Local Markets & Land Access',
    note: 'Find your local farmers market — support sovereign food systems',
    color: 'hsl(120 40% 50%)',
    icon: '🧑‍🌾',
    url: null,
  },
];

const GACommunityResources = ({ variant = 'full' }: GACommunityResourcesProps) => {
  if (variant === 'compact') {
    return (
      <div
        className="p-3 rounded-xl"
        style={{
          background: 'hsl(45 15% 6%)',
          border: '1px solid hsl(45 20% 15%)',
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-4 h-4" style={{ color: 'hsl(45 60% 55%)' }} />
          <span className="text-[9px] font-mono tracking-widest font-bold" style={{ color: 'hsl(45 60% 55%)' }}>
            GA COMMUNITY RESOURCES
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {ORGS.map(org => (
            <div
              key={org.name}
              className="px-2 py-1.5 rounded-lg"
              style={{ background: 'hsl(0 0% 7%)', border: '1px solid hsl(0 0% 14%)' }}
            >
              <span className="text-[9px] font-mono font-bold block" style={{ color: org.color }}>
                {org.icon} {org.name}
              </span>
              <span className="text-[7px] font-mono block mt-0.5" style={{ color: 'hsl(0 0% 45%)' }}>
                {org.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="p-6 rounded-xl text-center"
      style={{
        background: 'linear-gradient(135deg, hsl(45 20% 7%), hsl(45 10% 4%))',
        border: '1px solid hsl(45 25% 16%)',
      }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-center gap-3 mb-4">
        <Users className="w-6 h-6" style={{ color: 'hsl(45 60% 55%)' }} />
        <h4 className="font-bubble text-xl tracking-wider" style={{ color: 'hsl(40 50% 90%)' }}>
          GA COMMUNITY
        </h4>
      </div>
      <p className="font-body text-xs italic mb-4" style={{ color: 'hsl(0 0% 50%)' }}>
        Local organizations to connect with & learn from
      </p>
      <div className="space-y-3 text-left">
        {ORGS.map(org => {
          const Wrapper = org.url ? 'a' : 'div';
          const linkProps = org.url ? { href: org.url, target: '_blank' as const, rel: 'noopener noreferrer' } : {};
          return (
            <Wrapper
              key={org.name}
              {...linkProps}
              className={`px-4 py-3 rounded-lg block ${org.url ? 'hover:border-current transition-colors' : ''}`}
              style={{ background: 'hsl(0 0% 6%)', border: '1px solid hsl(0 0% 13%)' }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">{org.icon}</span>
                <span className="font-body font-bold text-sm" style={{ color: org.color }}>
                  {org.name}
                </span>
                {org.url && <ExternalLink className="w-3 h-3 ml-auto" style={{ color: 'hsl(0 0% 35%)' }} />}
              </div>
              <p className="font-body text-xs" style={{ color: 'hsl(0 0% 50%)' }}>
                {org.type}
              </p>
              <p className="font-body text-[11px] mt-1" style={{ color: 'hsl(0 0% 40%)' }}>
                {org.note}
              </p>
            </Wrapper>
          );
        })}
      </div>
    </motion.div>
  );
};

export default GACommunityResources;
