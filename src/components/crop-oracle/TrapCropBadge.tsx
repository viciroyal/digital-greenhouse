/**
 * TrapCropBadge — identifies crops that serve as trap crops or pest deterrents.
 * Detects from description text and guild_role fields.
 */

interface TrapCropBadgeProps {
  description: string | null | undefined;
  guildRole: string | null | undefined;
  size?: 'sm' | 'md';
}

const TRAP_KEYWORDS = ['trap crop', 'pest deterrent', 'pest-deterrent', 'repel', 'deterr'];
const PEST_KEYWORDS = ['aphid', 'whitefl', 'hornworm', 'beetle', 'nematode', 'mosquito', 'cabbage worm', 'squash bug', 'leafhopper', 'mite', 'flea beetle', 'carrot fly'];

export const isTrapOrPestCrop = (
  description: string | null | undefined,
  guildRole: string | null | undefined
): { isTrap: boolean; pests: string[] } => {
  const desc = (description || '').toLowerCase();
  const role = (guildRole || '').toLowerCase();
  
  const isTrap = TRAP_KEYWORDS.some(k => desc.includes(k)) || role === 'sentinel';
  if (!isTrap) return { isTrap: false, pests: [] };

  const pests: string[] = [];
  if (desc.includes('aphid')) pests.push('Aphids');
  if (desc.includes('whitefl')) pests.push('Whiteflies');
  if (desc.includes('hornworm')) pests.push('Hornworms');
  if (desc.includes('beetle')) pests.push('Beetles');
  if (desc.includes('nematode')) pests.push('Nematodes');
  if (desc.includes('mosquito')) pests.push('Mosquitoes');
  if (desc.includes('cabbage worm')) pests.push('Cabbage Worms');
  if (desc.includes('squash bug')) pests.push('Squash Bugs');
  if (desc.includes('leafhopper')) pests.push('Leafhoppers');
  if (desc.includes('mite')) pests.push('Mites');
  if (desc.includes('flea beetle')) pests.push('Flea Beetles');
  if (desc.includes('carrot fly')) pests.push('Carrot Flies');
  if (desc.includes('mosquito') && !pests.includes('Mosquitoes')) pests.push('Mosquitoes');

  return { isTrap, pests };
};

const TrapCropBadge = ({ description, guildRole, size = 'sm' }: TrapCropBadgeProps) => {
  const { isTrap, pests } = isTrapOrPestCrop(description, guildRole);
  if (!isTrap) return null;

  const fontSize = size === 'sm' ? 'text-[7px]' : 'text-[8px]';
  const pestText = pests.length > 0 ? pests.slice(0, 2).join(', ') : 'Pests';

  return (
    <span
      className={`${fontSize} font-mono px-1.5 py-0.5 rounded inline-flex items-center gap-1`}
      style={{
        background: 'hsl(0 60% 50% / 0.12)',
        color: 'hsl(0 60% 55%)',
        border: '1px solid hsl(0 60% 50% / 0.2)',
      }}
      title={pests.length > 0 ? `Trap/deterrent for: ${pests.join(', ')}` : 'Pest trap/deterrent crop'}
    >
      🛡️ {pestText}
    </span>
  );
};

export default TrapCropBadge;
