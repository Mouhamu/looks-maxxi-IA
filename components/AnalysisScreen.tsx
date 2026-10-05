import React from 'react';
import { AnalysisResult } from '../types';
import { ResultsDashboard } from './ResultsDashboard';

interface AnalysisScreenProps {
  result: AnalysisResult;
  onBack: () => void;
  onNewAnalysis: () => void;
}

export const AnalysisScreen: React.FC<AnalysisScreenProps> = ({
  result,
  onNewAnalysis,
}) => {
  return (
    <ResultsDashboard
      result={result}
      lang="en"
      onNewAnalysis={onNewAnalysis}
    />
  );
};

export default AnalysisScreen;
