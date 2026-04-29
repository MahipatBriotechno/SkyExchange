import React from 'react';

/**
 * BookmakerTable Component
 * 
 * Renders the Bookmaker market table (0% Commission markets).
 */
const BookmakerTable = ({ bookmakerData, onBetClick }) => {
  // Extract runners from bookmakerData
  const runnersList = bookmakerData?.runners ? Object.values(bookmakerData.runners) : [];
  const runners = runnersList.length > 0 ? runnersList : [];

  return (
    <div className="mb-4">
      {/* Header Bar */}
      <div className="bg-[#1f2933] text-white flex items-center px-3 py-2">
        <a id="multiMarketPin" class="add-pin" title="Add to Multi Markets">Add Pin</a>
        <span className="font-bold text-sm">{bookmakerData?.name || 'Bookmaker Market'}</span>
        <span className="mx-2 text-gray-400">|</span>
        <span className="text-sm text-gray-300">Zero Commission</span>
      </div>

      {/* Sub-Header */}
      <div className="bg-[#f0f4f7] flex justify-between items-center px-2 py-1.5 border-b border-[#cdd4d9]">
        <div className="text-sm text-gray-800 font-medium">Bookmaker</div>
        <div className="flex items-center gap-2 text-[11px] font-bold">
          <div className="flex items-center gap-1">
            <span className="bg-[#4b5965] text-white px-2 py-0.5 rounded-sm">Min</span>
            <span className="text-gray-800">{bookmakerData?.min || '0.00'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="bg-[#4b5965] text-white px-2 py-0.5 rounded-sm">Max</span>
            <span className="text-gray-800">{bookmakerData?.max || '0.00'}</span>
          </div>
        </div>
      </div>

      {/* Table Area */}
      <div className="w-full">
        {/* Table Header Row */}
        <div className="flex border-b border-[#e5e5e5] bg-[#fffce3] h-[24px]">
          <div className="flex-1 border-r border-[#e4e7ed]"></div>
          <div className="w-[688.128px] flex text-center">
            {/* 6 columns mapping to the odds cells below */}
            <div className="w-[114.688px]"></div>
            <div className="w-[114.688px]"></div>
            <div 
              className="w-[114.688px] flex items-center justify-center"
              style={{ fontFamily: 'Tahoma, Helvetica, sans-serif', fontSize: '12px', lineHeight: '22px', fontWeight: 400, letterSpacing: 'normal', color: '#1E1E1E' }}
            >
              Back
            </div>
            <div 
              className="w-[114.688px] flex items-center justify-center"
              style={{ fontFamily: 'Tahoma, Helvetica, sans-serif', fontSize: '12px', lineHeight: '22px', fontWeight: 400, letterSpacing: 'normal', color: '#1E1E1E' }}
            >
              Lay
            </div>
            <div className="w-[114.688px]"></div>
            <div className="w-[114.688px]"></div>
          </div>
        </div>

        {/* Table Body */}
        <div className="flex flex-col">
          {runners.map((runner, idx) => (
            <div key={idx} className="flex border-b border-[#e5e5e5] bg-[#fffce3] min-h-[42px]">
              {/* Runner Name */}
              <div className="flex-1 px-4 flex flex-col justify-center border-r border-[#e4e7ed]">
                <span className="font-bold text-sm text-black">{runner.RunnerName}</span>
              </div>

              {/* Odds Area */}
              <div className="relative flex w-[688.128px] h-[42px]">
                <div
                  className="flex items-center justify-center bg-[#e4eff6] cursor-pointer hover:opacity-80 transition-opacity border-r border-white/50"
                  style={{ fontFamily: 'Tahoma, Helvetica, sans-serif', fontSize: '12px', lineHeight: '15px', fontWeight: 400, letterSpacing: 'normal', color: '#1E1E1E', width: '114.688px', height: '42px', boxSizing: 'border-box' }}
                  onClick={() => onBetClick(runner.RunnerName, 'back', 0)}
                >
                  -
                </div>
                <div
                  className="flex items-center justify-center bg-[#cfe3f1] cursor-pointer hover:opacity-80 transition-opacity border-r border-white/50"
                  style={{ fontFamily: 'Tahoma, Helvetica, sans-serif', fontSize: '12px', lineHeight: '15px', fontWeight: 400, letterSpacing: 'normal', color: '#1E1E1E', width: '114.688px', height: '42px', boxSizing: 'border-box' }}
                  onClick={() => onBetClick(runner.RunnerName, 'back', 0)}
                >
                  -
                </div>
                <div
                  className="flex items-center justify-center bg-[#72bbef] border border-white cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ fontFamily: 'Tahoma, Helvetica, sans-serif', fontSize: '12px', lineHeight: '15px', fontWeight: 400, letterSpacing: 'normal', color: '#1E1E1E', width: '114.688px', height: '42px', boxSizing: 'border-box' }}
                  onClick={() => onBetClick(runner.RunnerName, 'back', 0)}
                >
                  -
                </div>
                <div
                  className="flex items-center justify-center bg-[#faa9ba] border border-white cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ fontFamily: 'Tahoma, Helvetica, sans-serif', fontSize: '12px', lineHeight: '15px', fontWeight: 400, letterSpacing: 'normal', color: '#1E1E1E', width: '114.688px', height: '42px', boxSizing: 'border-box' }}
                  onClick={() => onBetClick(runner.RunnerName, 'lay', 0)}
                >
                  -
                </div>
                <div
                  className="flex items-center justify-center bg-[#f2cfd5] cursor-pointer hover:opacity-80 transition-opacity border-l border-white/50"
                  style={{ fontFamily: 'Tahoma, Helvetica, sans-serif', fontSize: '12px', lineHeight: '15px', fontWeight: 400, letterSpacing: 'normal', color: '#1E1E1E', width: '114.688px', height: '42px', boxSizing: 'border-box' }}
                  onClick={() => onBetClick(runner.RunnerName, 'lay', 0)}
                >
                  -
                </div>
                <div
                  className="flex items-center justify-center bg-[#f6e3e7] cursor-pointer hover:opacity-80 transition-opacity border-l border-white/50"
                  style={{ fontFamily: 'Tahoma, Helvetica, sans-serif', fontSize: '12px', lineHeight: '15px', fontWeight: 400, letterSpacing: 'normal', color: '#1E1E1E', width: '114.688px', height: '42px', boxSizing: 'border-box' }}
                  onClick={() => onBetClick(runner.RunnerName, 'lay', 0)}
                >
                  -
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookmakerTable;
