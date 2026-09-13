import React, { useState } from 'react';
import { Smartphone, Monitor, Sparkles } from 'lucide-react';

interface IPhone17ProMaxContainerProps {
  children: React.ReactNode;
}

export const IPhone17ProMaxContainer: React.FC<IPhone17ProMaxContainerProps> = ({ children }) => {
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);

  return (
    <div className="min-h-screen bg-[#06080d] text-slate-100 flex flex-col items-center justify-start sm:py-6 px-0 sm:px-4">
      {/* Top Device Switcher Toolbar (Desktop only) */}
      <div className="hidden lg:flex items-center justify-between w-full max-w-[460px] mb-3 px-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00e700] animate-pulse" />
          <span className="font-extrabold text-white tracking-wide">iPhone 17 Pro Max</span>
          <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700 font-mono">
            6.9" Super Retina XDR
          </span>
        </div>

        <div className="flex items-center gap-1 bg-[#131926] p-1 rounded-xl border border-[#222d42]">
          <button
            onClick={() => setIsPhoneFrame(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
              isPhoneFrame ? 'bg-[#0066cc] text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>iPhone View</span>
          </button>
          <button
            onClick={() => setIsPhoneFrame(false)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
              !isPhoneFrame ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Full Width</span>
          </button>
        </div>
      </div>

      {/* Main Container: iPhone 17 Pro Max Chassis */}
      <div
        className={`w-full transition-all duration-300 relative ${
          isPhoneFrame
            ? 'max-w-[440px] min-h-[956px] sm:min-h-[920px] sm:h-[92vh] bg-[#0c1017] sm:rounded-[56px] border-0 sm:border-[5px] border-[#363d4f] shadow-[0_25px_70px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden sm:ring-1 sm:ring-white/10'
            : 'max-w-7xl min-h-screen bg-[#0a0d14] rounded-none sm:rounded-2xl border-0 sm:border border-[#1e273a] flex flex-col'
        }`}
      >
        {/* Hardware Buttons on Titanium Chassis (Desktop Simulation) */}
        {isPhoneFrame && (
          <>
            {/* Left: Action Button */}
            <div className="hidden sm:block absolute -left-[8px] top-[115px] w-[3px] h-[26px] bg-[#4a5266] rounded-l-sm" />
            {/* Left: Volume Up */}
            <div className="hidden sm:block absolute -left-[8px] top-[160px] w-[3px] h-[48px] bg-[#4a5266] rounded-l-sm" />
            {/* Left: Volume Down */}
            <div className="hidden sm:block absolute -left-[8px] top-[220px] w-[3px] h-[48px] bg-[#4a5266] rounded-l-sm" />
            {/* Right: Power / Side Button */}
            <div className="hidden sm:block absolute -right-[8px] top-[170px] w-[3px] h-[75px] bg-[#4a5266] rounded-r-sm" />
            {/* Right: Camera Control Sensor Button */}
            <div className="hidden sm:block absolute -right-[8px] top-[280px] w-[3px] h-[55px] bg-[#5a637a] rounded-r-sm border-r border-[#7b86a3]" />
          </>
        )}

        {/* iPhone 17 Pro Max Status Bar with Dynamic Island & Pulsing Green Glow */}
        <div className="sticky top-0 z-50 w-full h-[48px] bg-[#0a0d14] shrink-0 select-none">
          {/* Pulsing Green Glow Wrapped Snugly Around Dynamic Island */}
          <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[126px] h-[36px] pointer-events-none flex items-center justify-center">
            {/* Symmetrical pulsing neon green halo wrapped tightly around the perimeter */}
            <div className="absolute -inset-[2.5px] rounded-full bg-[#00e700] opacity-85 blur-[4px] animate-pulse" />
            {/* Dynamic Island pill with sharp luminous green edge */}
            <div className="relative w-full h-full rounded-full border-2 border-[#00e700] shadow-[0_0_10px_rgba(0,231,0,0.9),inset_0_0_3px_rgba(0,231,0,0.3)] bg-black" />
          </div>
        </div>

        {/* Child Screen Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {children}
        </div>

        {/* iPhone 17 Pro Max Home Indicator Bar */}
        <div className="sticky bottom-0 z-50 w-full bg-[#0c1017] pt-1 pb-2 flex justify-center shrink-0">
          <div className="w-36 h-1 bg-slate-400/80 rounded-full" />
        </div>
      </div>
    </div>
  );
};
