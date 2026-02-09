import JournalView from './JournalView';

interface PathContentViewProps {
  userId?: string;
  displayModules?: Array<{
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
  onModuleSelect?: (module: any) => void;
  onEnterKidsMode?: () => void;
}

/**
 * PATH CONTENT VIEW
 * 
 * The "Why" / Theory / Vision section.
 * Now simplified to the Journal View for beginner-friendly reflection.
 */
const PathContentView = ({ userId }: PathContentViewProps) => {
  return <JournalView userId={userId} />;
};

export default PathContentView;
