import React from 'react';

interface Planet {
  name: string;
  sign: string;
  house: number;
}

export const DiamondChart = ({ planets }: { planets: Planet[] }) => {
  // Group planets by house index (1-12)
  const houseMap: Record<number, string[]> = {};
  planets.forEach(p => {
    const h = p.house;
    if (!houseMap[h]) houseMap[h] = [];
    houseMap[h].push(p.name.substring(0, 2)); // Use short names like 'Su', 'Mo'
  });

  return (
    <div className="relative w-full aspect-square max-w-125 mx-auto bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-2xl">
      <svg viewBox="0 0 400 400" className="w-full h-full text-amber-500/80">
        {/* Main Frame */}
        <rect width="400" height="400" fill="none" stroke="currentColor" strokeWidth="2" />
        {/* Diagonals */}
        <path d="M0 0 L400 400 M400 0 L0 400" fill="none" stroke="currentColor" strokeWidth="1.5" />
        {/* Inner Diamond */}
        <path d="M200 0 L400 200 L200 400 L0 200 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />

        {/* House Labels & Planets Mapping */}
        {renderHouseText(200, 130, houseMap[1])}   {/* 1st House - Top Center */}
        {renderHouseText(100, 60, houseMap[2])}    {/* 2nd House */}
        {renderHouseText(60, 100, houseMap[3])}    {/* 3rd House */}
        {renderHouseText(130, 200, houseMap[4])}   {/* 4th House */}
        {renderHouseText(60, 300, houseMap[5])}    {/* 5th House */}
        {renderHouseText(100, 340, houseMap[6])}   {/* 6th House */}
        {renderHouseText(200, 270, houseMap[7])}   {/* 7th House */}
        {renderHouseText(300, 340, houseMap[8])}   {/* 8th House */}
        {renderHouseText(340, 300, houseMap[9])}   {/* 9th House */}
        {renderHouseText(270, 200, houseMap[10])}  {/* 10th House */}
        {renderHouseText(340, 100, houseMap[11])}  {/* 11th House */}
        {renderHouseText(300, 60, houseMap[12])}   {/* 12th House */}
      </svg>
    </div>
  );
};

const renderHouseText = (x: number, y: number, planets?: string[]) => (
  <text x={x} y={y} textAnchor="middle" className="fill-slate-300 text-[14px] font-medium uppercase tracking-tighter">
    {planets?.join(' ')}
  </text>
);