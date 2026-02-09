import { useState } from 'react';
import { KeyholeButton } from '@/components/portal';
import { Menu, X } from 'lucide-react';

interface MenuNode {
  id: string;
  label: string;
  href: string;
}

const menuNodes: MenuNode[] = [
  { id: 'garden', label: 'The Living Garden', href: '#matrix' },
  { id: 'source', label: 'Secure Dosage', href: '#shop' },
  { id: 'mapping', label: 'Star Mapping', href: '/star-mapping' },
  { id: 'griot', label: 'Consult the Griot', href: '#oracle' },
  { id: 'top', label: 'Return to Crown', href: '#' },
];

interface MycelialMenuProps {
  onInitiationClick?: () => void;
}

/**
 * Simple Navigation Menu
 * Clean dropdown without complex animations
 */
const MycelialMenu = ({ onInitiationClick }: MycelialMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-6 left-6 z-50 flex items-center gap-3">
      {/* The Initiation Keyhole */}
      <KeyholeButton onClick={onInitiationClick || (() => {})} />
      
      {/* Menu Button */}
      <div className="relative">
        <button
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, hsl(40 60% 45%), hsl(20 50% 30%))',
            border: '2px solid hsl(40 50% 40%)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          }}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open navigation menu"
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <X className="w-5 h-5" style={{ color: 'hsl(40 50% 90%)' }} />
          ) : (
            <Menu className="w-5 h-5" style={{ color: 'hsl(40 50% 90%)' }} />
          )}
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            className="absolute top-full left-0 mt-2 py-2 rounded-xl min-w-[200px]"
            style={{
              background: 'hsl(20 30% 12%)',
              border: '2px solid hsl(40 40% 30%)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
            }}
          >
            {menuNodes.map((node) => (
              <a
                key={node.id}
                href={node.href}
                className="block px-4 py-3 transition-colors"
                style={{
                  color: 'hsl(40 50% 85%)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'hsl(40 40% 20%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
                onClick={() => setIsOpen(false)}
              >
                <span className="text-sm font-mono tracking-wide">
                  {node.label}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MycelialMenu;
