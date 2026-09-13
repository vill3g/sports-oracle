import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SelectedPrediction, MatchPrediction } from '../types/prediction';
import { formatToEasternTime } from '../utils/timezone';

interface SlipContextType {
  selectedPicks: SelectedPrediction[];
  togglePick: (pick: SelectedPrediction) => void;
  removePick: (id: string) => void;
  clearSlip: () => void;
  isPickSelected: (id: string) => boolean;
  isSlipOpen: boolean;
  setIsSlipOpen: (open: boolean) => void;
  activeLeague: string;
  setActiveLeague: (league: string) => void;
  activeInsightMatch: MatchPrediction | null;
  setActiveInsightMatch: (match: MatchPrediction | null) => void;
  showAccuracyModal: boolean;
  setShowAccuracyModal: (show: boolean) => void;
  savedPortfolios: { id: string; date: string; picks: SelectedPrediction[]; jointProb: number }[];
  saveCurrentSlipToPortfolio: () => void;
}

const SlipContext = createContext<SlipContextType | undefined>(undefined);

export const SlipProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedPicks, setSelectedPicks] = useState<SelectedPrediction[]>(() => {
    try {
      const saved = localStorage.getItem('sports_oracle_slip');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeLeague, setActiveLeague] = useState<string>('all');
  const [isSlipOpen, setIsSlipOpen] = useState<boolean>(false);
  const [activeInsightMatch, setActiveInsightMatch] = useState<MatchPrediction | null>(null);
  const [showAccuracyModal, setShowAccuracyModal] = useState<boolean>(false);

  const [savedPortfolios, setSavedPortfolios] = useState<{ id: string; date: string; picks: SelectedPrediction[]; jointProb: number }[]>(() => {
    try {
      const saved = localStorage.getItem('sports_oracle_portfolios');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('sports_oracle_slip', JSON.stringify(selectedPicks));
  }, [selectedPicks]);

  useEffect(() => {
    localStorage.setItem('sports_oracle_portfolios', JSON.stringify(savedPortfolios));
  }, [savedPortfolios]);

  const togglePick = (pick: SelectedPrediction) => {
    setSelectedPicks(prev => {
      const exists = prev.some(p => p.id === pick.id);
      if (exists) {
        return prev.filter(p => p.id !== pick.id);
      } else {
        // Prevent duplicate picks for the same match & market type
        const filtered = prev.filter(p => !(p.matchId === pick.matchId && p.pickType === pick.pickType));
        return [...filtered, pick];
      }
    });
  };

  const removePick = (id: string) => {
    setSelectedPicks(prev => prev.filter(p => p.id !== id));
  };

  const clearSlip = () => {
    setSelectedPicks([]);
  };

  const isPickSelected = (id: string) => {
    return selectedPicks.some(p => p.id === id);
  };

  const saveCurrentSlipToPortfolio = () => {
    if (selectedPicks.length === 0) return;
    const jointProb = selectedPicks.reduce((acc, p) => acc * p.probability, 1);
    const newEntry = {
      id: Date.now().toString(),
      date: formatToEasternTime(new Date(), { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      picks: [...selectedPicks],
      jointProb: Math.round(jointProb * 1000) / 10
    };
    setSavedPortfolios(prev => [newEntry, ...prev]);
    clearSlip();
    alert('Predictions tracked to your Paper Portfolio successfully!');
  };

  return (
    <SlipContext.Provider
      value={{
        selectedPicks,
        togglePick,
        removePick,
        clearSlip,
        isPickSelected,
        isSlipOpen,
        setIsSlipOpen,
        activeLeague,
        setActiveLeague,
        activeInsightMatch,
        setActiveInsightMatch,
        showAccuracyModal,
        setShowAccuracyModal,
        savedPortfolios,
        saveCurrentSlipToPortfolio
      }}
    >
      {children}
    </SlipContext.Provider>
  );
};

export const useSlip = () => {
  const context = useContext(SlipContext);
  if (!context) {
    throw new Error('useSlip must be used within a SlipProvider');
  }
  return context;
};
