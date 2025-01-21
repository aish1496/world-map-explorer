import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Globe2, TrendingUp, Users, Heart, Wifi } from 'lucide-react';

// World map data and country data are now aligned
const countryData = {
  USA: {
    name: 'United States',
    population: 331.9,
    gdp: 63544,
    lifeExpectancy: 76.1,
    internetAccess: 89.4,
    historicalData: [
      { year: 2018, value: 61000 },
      { year: 2019, value: 62000 },
      { year: 2020, value: 63544 }
    ]
  },
  CAN: {
    name: 'Canada',
    population: 38.25,
    gdp: 43242,
    lifeExpectancy: 82.3,
    internetAccess: 92.7,
    historicalData: [
      { year: 2018, value: 41000 },
      { year: 2019, value: 42000 },
      { year: 2020, value: 43242 }
    ]
  },
  MEX: {
    name: 'Mexico',
    population: 128.9,
    gdp: 8329,
    lifeExpectancy: 75.0,
    internetAccess: 70.1,
    historicalData: [
      { year: 2018, value: 8000 },
      { year: 2019, value: 8200 },
      { year: 2020, value: 8329 }
    ]
  },
  BRA: {
    name: 'Brazil',
    population: 214.3,
    gdp: 6797,
    lifeExpectancy: 75.5,
    internetAccess: 75.0,
    historicalData: [
      { year: 2018, value: 6500 },
      { year: 2019, value: 6600 },
      { year: 2020, value: 6797 }
    ]
  },
  RUS: {
    name: 'Russia',
    population: 144.1,
    gdp: 10127,
    lifeExpectancy: 73.2,
    internetAccess: 82.6,
    historicalData: [
      { year: 2018, value: 9800 },
      { year: 2019, value: 9900 },
      { year: 2020, value: 10127 }
    ]
  }
};

// Only include paths for countries we have data for
const worldMapPaths = {
  USA: "M 170 80 L 220 80 L 235 85 L 240 90 L 238 95 L 242 100 L 238 105 L 235 110 L 180 110 L 175 105 L 170 100 Z",
  CAN: "M 160 50 L 230 50 L 240 55 L 245 60 L 240 65 L 235 70 L 170 70 L 165 65 L 160 60 Z",
  MEX: "M 175 110 L 205 110 L 210 115 L 215 120 L 210 125 L 205 130 L 180 130 L 175 125 L 170 120 Z",
  BRA: "M 220 150 L 250 150 L 255 155 L 260 160 L 255 165 L 250 170 L 225 170 L 220 165 L 215 160 Z",
  RUS: "M 300 50 L 400 50 L 410 55 L 415 60 L 410 65 L 405 70 L 310 70 L 305 65 L 300 60 Z"
};

const WorldMapExplorer = () => {
  const [selectedIndicator, setSelectedIndicator] = useState('population');
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const indicators = [
    { id: 'population', name: 'Population', unit: 'million', icon: Users },
    { id: 'gdp', name: 'GDP per capita', unit: 'USD', icon: TrendingUp },
    { id: 'lifeExpectancy', name: 'Life Expectancy', unit: 'years', icon: Heart },
    { id: 'internetAccess', name: 'Internet Access', unit: '%', icon: Wifi }
  ];

  const getMinMaxValues = () => {
    const values = Object.values(countryData).map(country => country[selectedIndicator]);
    return {
      min: Math.min(...values),
      max: Math.max(...values)
    };
  };

  const { min, max } = getMinMaxValues();

  const getColorForValue = (value) => {
    if (value === undefined || value === null) return '#e5e5e5';
    const normalizedValue = (value - min) / (max - min);
    return `hsl(220, ${Math.round(normalizedValue * 100)}%, ${Math.round(70 - normalizedValue * 40)}%)`;
  };

  const legendSteps = Array.from({ length: 5 }, (_, i) => {
    const value = min + (max - min) * (i / 4);
    return {
      value: value.toFixed(0),
      color: getColorForValue(value)
    };
  });

  const IndicatorIcon = indicators.find(i => i.id === selectedIndicator)?.icon || Globe2;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-white rounded-xl">
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
        <CardHeader className="border-b bg-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <IndicatorIcon className="w-6 h-6 text-blue-600" />
              <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Global Indicators Explorer
              </CardTitle>
            </div>
            <Select
              value={selectedIndicator}
              onValueChange={setSelectedIndicator}
            >
              <SelectTrigger className="w-[200px] bg-white">
                <SelectValue placeholder="Select indicator" />
              </SelectTrigger>
              <SelectContent>
                {indicators.map(indicator => (
                  <SelectItem key={indicator.id} value={indicator.id}>
                    <div className="flex items-center gap-2">
                      <indicator.icon className="w-4 h-4" />
                      {indicator.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-4">
              <div className="relative aspect-[16/9] w-full">
                <svg
                  viewBox="0 0 500 300"
                  className="w-full h-full"
                  style={{
                    background: 'linear-gradient(to bottom, #f8fafc, #f1f5f9)'
                  }}
                >
                  {Object.entries(worldMapPaths).map(([id, path]) => {
                    const country = countryData[id];
                    if (!country) return null;

                    return (
                      <path
                        key={id}
                        d={path}
                        fill={getColorForValue(country[selectedIndicator])}
                        stroke="white"
                        strokeWidth="1"
                        className="transition-all duration-300 hover:brightness-90 cursor-pointer"
                        style={{
                          filter: selectedCountry === id ? 'drop-shadow(0 0 4px rgba(0,0,0,0.2))' : 'none'
                        }}
                        onMouseEnter={() => setHoveredCountry(id)}
                        onMouseLeave={() => setHoveredCountry(null)}
                        onClick={() => setSelectedCountry(id)}
                      />
                    );
                  })}
                </svg>

                {/* Legend */}
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur p-3 rounded-lg shadow-lg">
                  <div className="text-sm font-semibold mb-2 text-gray-700">
                    {indicators.find(i => i.id === selectedIndicator).name}
                  </div>
                  <div className="flex items-center space-x-1">
                    {legendSteps.map((step, i) => (
                      <div key={i} className="text-xs">
                        <div
                          className="w-8 h-4 rounded-sm"
                          style={{ backgroundColor: step.color }}
                        />
                        <div className="mt-1 text-gray-600">{step.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tooltip */}
                {hoveredCountry && countryData[hoveredCountry] && (
                  <div
                    className="absolute bg-white/95 backdrop-blur p-3 rounded-lg shadow-lg border border-gray-100 transform -translate-x-1/2"
                    style={{
                      left: '50%',
                      top: '10%',
                    }}
                  >
                    <p className="font-bold text-gray-800">{countryData[hoveredCountry].name}</p>
                    <div className="flex items-center gap-2 text-gray-600">
                      <IndicatorIcon className="w-4 h-4" />
                      <p>
                        {countryData[hoveredCountry][selectedIndicator].toLocaleString()}
                        {' '}
                        {indicators.find(i => i.id === selectedIndicator).unit}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Details Panel */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              {selectedCountry && countryData[selectedCountry] ? (
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="text-xl font-bold text-gray-800">
                      {countryData[selectedCountry].name}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {indicators.map(indicator => (
                      <div key={indicator.id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-2 text-gray-600">
                          <indicator.icon className="w-5 h-5" />
                          <span>{indicator.name}:</span>
                        </div>
                        <span className="font-semibold text-gray-800">
                          {countryData[selectedCountry][indicator.id].toLocaleString()} {indicator.unit}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-semibold text-gray-600 mb-4">GDP Trend Analysis</h4>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={countryData[selectedCountry].historicalData}>
                          <XAxis
                            dataKey="year"
                            tick={{ fill: '#64748b' }}
                          />
                          <YAxis
                            tick={{ fill: '#64748b' }}
                          />
                          <RechartsTooltip
                            contentStyle={{
                              background: 'rgba(255, 255, 255, 0.95)',
                              border: 'none',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                          <Bar
                            dataKey="value"
                            fill="#3b82f6"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-12 text-gray-400">
                  <Globe2 className="w-16 h-16 mb-4 animate-pulse" />
                  <p className="text-center">Select a country on the map<br />to explore detailed statistics</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorldMapExplorer;
