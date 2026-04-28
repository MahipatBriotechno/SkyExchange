import React from 'react';

/**
 * BookmakerTable Component
 * 
 * Renders the Bookmaker market table (0% Commission markets).
 */
const BookmakerTable = ({ bookmakerData, onBetClick }) => {
  // Using dummy data based on the image if no data is provided
  const runners = bookmakerData || [
    { id: 1, name: 'Canada', isSuspended: true },
    {
      id: 2,
      name: 'United Arab Emirates',
      isSuspended: false,
      b3: 33, b2: 34, b1: 35,
      l1: 37, l2: 38, l3: 39
    }
  ];

  return (
    <div className="mb-4">
      {/* Header Bar */}
      <div className="bg-[#1f2933] text-white flex items-center px-3 py-2">
        <a id="multiMarketPin" class="add-pin" title="Add to Multi Markets">Add Pin</a>
        <span className="font-bold text-sm">Bookmaker Market</span>
        <span className="mx-2 text-gray-400">|</span>
        <span className="text-sm text-gray-300">Zero Commission</span>
      </div>

      {/* Sub-Header */}
      <div className="bg-[#f0f4f7] flex justify-between items-center px-2 py-1.5 border-b border-[#cdd4d9]">
        <div className="text-sm text-gray-800 font-medium">Bookmaker</div>
        <div className="flex items-center gap-2 text-[11px] font-bold">
          <div className="flex items-center gap-1">
            <span className="bg-[#4b5965] text-white px-2 py-0.5 rounded-sm">Min</span>
            <span className="text-gray-800">5.00</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="bg-[#4b5965] text-white px-2 py-0.5 rounded-sm">Max</span>
            <span className="text-gray-800">39,219.00</span>
          </div>
        </div>
      </div>

      {/* Table Area */}
      <div className="w-full">
        {/* Table Header Row */}
        <div className="flex border-b border-[#e5e5e5] bg-[#fffce3] h-[24px]">
          <div className="flex-1"></div>
          <div className="w-[594px] flex text-center">
            {/* 6 columns mapping to the odds cells below */}
            <div className="w-[99px]"></div>
            <div className="w-[99px]"></div>
            <div 
              className="w-[99px] flex items-center justify-center"
              style={{ fontFamily: 'Tahoma, Helvetica, sans-serif', fontSize: '12px', lineHeight: '22px', fontWeight: 400, letterSpacing: 'normal', color: '#1E1E1E' }}
            >
              Back
            </div>
            <div 
              className="w-[99px] flex items-center justify-center"
              style={{ fontFamily: 'Tahoma, Helvetica, sans-serif', fontSize: '12px', lineHeight: '22px', fontWeight: 400, letterSpacing: 'normal', color: '#1E1E1E' }}
            >
              Lay
            </div>
            <div className="w-[99px]"></div>
            <div className="w-[99px]"></div>
          </div>
        </div>

        {/* Table Body */}
        <div className="flex flex-col">
          {runners.map((runner) => (
            <div key={runner.id} className="flex border-b border-[#e5e5e5] bg-[#fffce3] min-h-[42px]">
              {/* Runner Name */}
              <div className="flex-1 px-3 flex flex-col justify-center border-r border-[#e5e5e5]">
                <span className="font-bold text-sm text-black">{runner.name}</span>
              </div>

              {/* Odds Area */}
              <div className="relative flex w-[594px] h-[42px]">
                {runner.isSuspended ? (
                  // Suspended State
                  <>
                    <div className="absolute inset-0 flex bg-[#a4b0b5]">
                      <div className="w-[99px]"></div>
                      <div className="w-[99px]"></div>
                      {/* Main boxes with borders and faint colors under gray */}
                      <div className="w-[99px] border border-white bg-[#5f8eb5]/60"></div>
                      <div className="w-[99px] border border-white bg-[#b57a8a]/60"></div>
                      <div className="w-[99px]"></div>
                      <div className="w-[99px]"></div>

                      {/* Suspend Overlay Text */}
                      <div className="absolute inset-0 flex items-center justify-center text-white text-xs">
                        Suspend
                      </div>
                    </div>
                  </>
                ) : (
                  // Active State
                  <>
                    <div
                      className="flex items-center justify-center bg-[#e4eff6] cursor-pointer hover:opacity-80 transition-opacity border-r border-white/50"
                      style={{ fontFamily: 'Tahoma, Helvetica, sans-serif', fontSize: '12px', lineHeight: '15px', fontWeight: 400, letterSpacing: 'normal', color: '#1E1E1E', width: '99px', height: '42px' }}
                    >
                      {runner.b3 || ''}
                    </div>
                    <div
                      className="flex items-center justify-center bg-[#cfe3f1] cursor-pointer hover:opacity-80 transition-opacity border-r border-white/50"
                      style={{ fontFamily: 'Tahoma, Helvetica, sans-serif', fontSize: '12px', lineHeight: '15px', fontWeight: 400, letterSpacing: 'normal', color: '#1E1E1E', width: '99px', height: '42px' }}
                    >
                      {runner.b2 || ''}
                    </div>
                    <div
                      className="flex items-center justify-center bg-[#72bbef] border border-white cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ fontFamily: 'Tahoma, Helvetica, sans-serif', fontSize: '12px', lineHeight: '15px', fontWeight: 400, letterSpacing: 'normal', color: '#1E1E1E', width: '99px', height: '42px' }}
                    >
                      {runner.b1 || ''}
                    </div>
                    <div
                      className="flex items-center justify-center bg-[#faa9ba] border border-white cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ fontFamily: 'Tahoma, Helvetica, sans-serif', fontSize: '12px', lineHeight: '15px', fontWeight: 400, letterSpacing: 'normal', color: '#1E1E1E', width: '99px', height: '42px' }}
                    >
                      {runner.l1 || ''}
                    </div>
                    <div
                      className="flex items-center justify-center bg-[#f2cfd5] cursor-pointer hover:opacity-80 transition-opacity border-l border-white/50"
                      style={{ fontFamily: 'Tahoma, Helvetica, sans-serif', fontSize: '12px', lineHeight: '15px', fontWeight: 400, letterSpacing: 'normal', color: '#1E1E1E', width: '99px', height: '42px' }}
                    >
                      {runner.l2 || ''}
                    </div>
                    <div
                      className="flex items-center justify-center bg-[#f6e3e7] cursor-pointer hover:opacity-80 transition-opacity border-l border-white/50"
                      style={{ fontFamily: 'Tahoma, Helvetica, sans-serif', fontSize: '12px', lineHeight: '15px', fontWeight: 400, letterSpacing: 'normal', color: '#1E1E1E', width: '99px', height: '42px' }}
                    >
                      {runner.l3 || ''}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookmakerTable;
