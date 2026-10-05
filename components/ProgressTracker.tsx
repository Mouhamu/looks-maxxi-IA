import React from 'react';
import { AnalysisResult } from '../types';
import { ProgressTrackerScreen } from './ProgressTrackerScreen';
import { initialAchievements } from '../services/initialData';

interface ProgressTrackerProps {
  analyses: AnalysisResult[];
  onSelect: (analysis: AnalysisResult) => void;
  onNewAnalysis: () => void;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  analyses,
  onSelect,
  onNewAnalysis,
}) => {
  return (
    <ProgressTrackerScreen
      lang="en"
      analyses={analyses}
      achievements={initialAchievements}
      onSelectAnalysis={onSelect}
      onDeleteAnalysis={() => {}}
      onNewAnalysis={onNewAnalysis}
    />
  );
};

export default ProgressTracker;
