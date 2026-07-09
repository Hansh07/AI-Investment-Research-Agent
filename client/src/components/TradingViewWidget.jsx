// ============================================================
// TradingView Real-Time Chart Widget
// ============================================================
// Renders a high-quality real-time financial market overview
// widget from TradingView for the analyzed stock ticker.
// Supports automatic dark/light theme switching.
// ============================================================

import { useEffect, useRef } from 'react';
import { useTheme } from '../hooks/useTheme';

export default function TradingViewWidget({ symbol }) {
  const containerRef = useRef(null);
  const { theme } = useTheme();

  // Normalize ticker: standard TradingView expects EXCHANGE:SYMBOL or just SYMBOL
  // If the symbol contains space or is not provided, default to AAPL
  const cleanSymbol = symbol && typeof symbol === 'string' 
    ? symbol.trim().toUpperCase().replace(/[^A-Z0-9:]/g, '') 
    : 'AAPL';

  useEffect(() => {
    // Clear previous widget script/elements on change
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    // Create the outer widget element TradingView expects
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container__widget';
    containerRef.current.appendChild(widgetContainer);

    // Create the script tag to pull the embed widget
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [[cleanSymbol]],
      chartOnly: false,
      width: '100%',
      height: '350',
      locale: 'en',
      colorTheme: theme === 'dark' ? 'dark' : 'light',
      gridLineColor: theme === 'dark' ? 'rgba(240, 243, 250, 0.06)' : 'rgba(0, 0, 0, 0.06)',
      fontColor: theme === 'dark' ? '#9ca3af' : '#4b5563',
      isTransparent: true,
      showVolume: false,
      showMA: false,
      valuesTracking: '1',
      changeMode: 'price-and-percent',
      chartType: 'area',
      maLineColor: '#3b82f6',
      maLineWidth: 1,
      maLength: 9,
      lineWidth: 2,
      lineColor: '#3b82f6',
      topColor: 'rgba(59, 130, 246, 0.25)',
      bottomColor: 'rgba(59, 130, 246, 0.0)',
    });

    containerRef.current.appendChild(script);

    return () => {
      // Clean up DOM on unmount
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [cleanSymbol, theme]);

  return (
    <div className="w-full h-[350px] overflow-hidden rounded-xl bg-transparent">
      <div className="tradingview-widget-container w-full h-full" ref={containerRef} />
    </div>
  );
}
