// ============================================================
// TradingView Real-Time Chart Widget
// ============================================================
// Renders a high-quality real-time financial market overview
// widget from TradingView for the analyzed stock ticker.
// Supports automatic dark/light theme switching.
// ============================================================

import { useTheme } from '../hooks/useTheme';

export default function TradingViewWidget({ symbol }) {
  const { theme } = useTheme();

  // Normalize ticker: standard TradingView expects EXCHANGE:SYMBOL or just SYMBOL
  const cleanSymbol = symbol && typeof symbol === 'string' 
    ? symbol.trim().toUpperCase().replace(/[^A-Z0-9:]/g, '') 
    : 'AAPL';

  // Construct standard TradingView embed HTML inside an iframe
  // to avoid cross-origin script error noise on React unmounts.
  const iframeHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: transparent;
          }
          .tradingview-widget-container {
            width: 100%;
            height: 100%;
          }
        </style>
      </head>
      <body>
        <div class="tradingview-widget-container">
          <div class="tradingview-widget-container__widget"></div>
          <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js" async>
            {
              "symbols": [["${cleanSymbol}"]],
              "chartOnly": false,
              "width": "100%",
              "height": "100%",
              "locale": "en",
              "colorTheme": "${theme === 'dark' ? 'dark' : 'light'}",
              "gridLineColor": "${theme === 'dark' ? 'rgba(240, 243, 250, 0.06)' : 'rgba(0, 0, 0, 0.06)'}",
              "fontColor": "${theme === 'dark' ? '#9ca3af' : '#4b5563'}",
              "isTransparent": true,
              "showVolume": false,
              "showMA": false,
              "valuesTracking": "1",
              "changeMode": "price-and-percent",
              "chartType": "area",
              "maLineColor": "#3b82f6",
              "maLineWidth": 1,
              "maLength": 9,
              "lineWidth": 2,
              "lineColor": "#3b82f6",
              "topColor": "rgba(59, 130, 246, 0.25)",
              "bottomColor": "rgba(59, 130, 246, 0.0)"
            }
          </script>
        </div>
      </body>
    </html>
  `;

  return (
    <div className="w-full h-[350px] overflow-hidden rounded-xl bg-transparent">
      <iframe
        title="TradingView Chart"
        srcDoc={iframeHtml}
        style={{ width: '100%', height: '100%', border: 'none', background: 'transparent' }}
      />
    </div>
  );
}

