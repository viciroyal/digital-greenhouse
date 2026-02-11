import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { MasterCrop } from '@/hooks/useMasterCrops';
import CropRow from './CropRow';
import { TABLE_HEADERS } from './constants';

const ROW_HEIGHT = 24;
const MAX_VISIBLE_ROWS = 30;

interface Props {
  crops: MasterCrop[];
}

const VirtualizedZoneTable = ({ crops }: Props) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const needsVirtualization = crops.length > MAX_VISIBLE_ROWS;

  const virtualizer = useVirtualizer({
    count: crops.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
    enabled: needsVirtualization,
  });

  if (!needsVirtualization) {
    // Small zones render normally (no virtualization overhead)
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[9px] font-apothecary uppercase tracking-wider text-muted-foreground print:text-black/60 border-b-2 border-border/50">
              {TABLE_HEADERS.map((h) => (
                <th key={h.label} className={`py-1 px-1.5 ${h.align}`}>{h.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {crops.map((crop) => (
              <CropRow key={crop.id} crop={crop} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const containerHeight = Math.min(crops.length, MAX_VISIBLE_ROWS) * ROW_HEIGHT + 32;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-[9px] font-apothecary uppercase tracking-wider text-muted-foreground print:text-black/60 border-b-2 border-border/50">
            {TABLE_HEADERS.map((h) => (
              <th key={h.label} className={`py-1 px-1.5 ${h.align}`}>{h.label}</th>
            ))}
          </tr>
        </thead>
      </table>
      <div
        ref={parentRef}
        className="overflow-y-auto print:overflow-visible print:h-auto"
        style={{ height: containerHeight, maxHeight: '70vh' }}
      >
        {/* Print fallback: render all rows */}
        <table className="w-full text-left border-collapse hidden print:table">
          <tbody>
            {crops.map((crop) => (
              <CropRow key={crop.id} crop={crop} />
            ))}
          </tbody>
        </table>
        {/* Screen: virtualized rows */}
        <div
          className="relative w-full print:hidden"
          style={{ height: virtualizer.getTotalSize() }}
        >
          <table className="w-full text-left border-collapse">
            <tbody>
              {virtualizer.getVirtualItems().map((virtualRow) => {
                const crop = crops[virtualRow.index];
                return (
                  <tr
                    key={crop.id}
                    className="absolute w-full"
                    style={{
                      height: ROW_HEIGHT,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <td colSpan={TABLE_HEADERS.length} className="p-0">
                      <table className="w-full text-left border-collapse">
                        <tbody>
                          <CropRow crop={crop} />
                        </tbody>
                      </table>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VirtualizedZoneTable;
