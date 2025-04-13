import React from 'react';
import PropTypes from 'prop-types';

/**
 * BarcodeDisplay Component
 * 
 * This component displays a barcode or QR code based on the provided type.
 * In a real implementation, you would use a library like react-barcode or qrcode.react.
 * 
 * @param {Object} props
 * @param {string} props.value - The value to encode in the barcode/QR code
 * @param {string} props.type - The type of code to display ('barcode' or 'qrcode')
 * @param {string} props.format - The format of the barcode (e.g., 'CODE128', 'EAN13')
 * @param {string} props.errorLevel - The error correction level for QR codes ('L', 'M', 'Q', 'H')
 * @param {number} props.width - The width of the code
 * @param {number} props.height - The height of the code
 * @param {boolean} props.displayValue - Whether to display the value below the barcode
 */
const BarcodeDisplay = ({ 
  value, 
  type = 'barcode', 
  format = 'CODE128', 
  errorLevel = 'M',
  width = 150, 
  height = 80, 
  displayValue = true 
}) => {
  // In a real implementation, you would use a library to generate the actual barcode/QR code
  // For this demo, we'll use SVG to simulate the appearance
  
  if (type === 'qrcode') {
    // Simulate a QR code with a simple grid
    const cellSize = Math.floor(width / 25);
    const qrSize = cellSize * 25;
    
    return (
      <div className="inline-block" style={{ width: qrSize, height: qrSize }}>
        <svg 
          width={qrSize} 
          height={qrSize} 
          viewBox={`0 0 ${qrSize} ${qrSize}`} 
          className="border border-gray-200"
        >
          {/* This is just a visual representation, not an actual QR code */}
          <rect x={0} y={0} width={qrSize} height={qrSize} fill="white" />
          
          {/* QR code position detection patterns (corners) */}
          {/* Top-left */}
          <rect x={cellSize * 2} y={cellSize * 2} width={cellSize * 7} height={cellSize * 7} fill="black" />
          <rect x={cellSize * 3} y={cellSize * 3} width={cellSize * 5} height={cellSize * 5} fill="white" />
          <rect x={cellSize * 4} y={cellSize * 4} width={cellSize * 3} height={cellSize * 3} fill="black" />
          
          {/* Top-right */}
          <rect x={qrSize - cellSize * 9} y={cellSize * 2} width={cellSize * 7} height={cellSize * 7} fill="black" />
          <rect x={qrSize - cellSize * 8} y={cellSize * 3} width={cellSize * 5} height={cellSize * 5} fill="white" />
          <rect x={qrSize - cellSize * 7} y={cellSize * 4} width={cellSize * 3} height={cellSize * 3} fill="black" />
          
          {/* Bottom-left */}
          <rect x={cellSize * 2} y={qrSize - cellSize * 9} width={cellSize * 7} height={cellSize * 7} fill="black" />
          <rect x={cellSize * 3} y={qrSize - cellSize * 8} width={cellSize * 5} height={cellSize * 5} fill="white" />
          <rect x={cellSize * 4} y={qrSize - cellSize * 7} width={cellSize * 3} height={cellSize * 3} fill="black" />
          
          {/* Generate some random "data" cells to make it look like a QR code */}
          {Array.from({ length: 100 }).map((_, i) => {
            const x = Math.floor(Math.random() * 25) * cellSize;
            const y = Math.floor(Math.random() * 25) * cellSize;
            
            // Avoid drawing over the position detection patterns
            const isInCorner = (
              (x < cellSize * 10 && y < cellSize * 10) || // Top-left
              (x > qrSize - cellSize * 10 && y < cellSize * 10) || // Top-right
              (x < cellSize * 10 && y > qrSize - cellSize * 10) // Bottom-left
            );
            
            if (!isInCorner) {
              return <rect key={i} x={x} y={y} width={cellSize} height={cellSize} fill="black" />;
            }
            return null;
          })}
        </svg>
        
        {displayValue && (
          <div className="text-center text-xs mt-1 text-gray-600 truncate">
            {value.length > 20 ? value.substring(0, 20) + '...' : value}
          </div>
        )}
      </div>
    );
  } else {
    // Simulate a barcode with simple lines
    const barWidth = Math.max(1, Math.floor(width / 60));
    
    return (
      <div className="inline-block" style={{ width, height: height + (displayValue ? 20 : 0) }}>
        <svg width={width} height={height} className="border border-gray-200">
          <rect x={0} y={0} width={width} height={height} fill="white" />
          
          {/* Generate bars with varying widths to simulate a barcode */}
          {Array.from({ length: Math.floor(width / (barWidth * 2)) }).map((_, i) => {
            const x = i * barWidth * 2;
            const barHeight = height - 10;
            const isBlack = i % 3 !== 0; // Create a pattern of bars
            
            return (
              <rect 
                key={i} 
                x={x} 
                y={5} 
                width={barWidth} 
                height={barHeight} 
                fill={isBlack ? 'black' : 'white'} 
              />
            );
          })}
        </svg>
        
        {displayValue && (
          <div className="text-center text-xs mt-1 text-gray-600">
            {value}
          </div>
        )}
      </div>
    );
  }
};

BarcodeDisplay.propTypes = {
  value: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['barcode', 'qrcode']),
  format: PropTypes.string,
  errorLevel: PropTypes.oneOf(['L', 'M', 'Q', 'H']),
  width: PropTypes.number,
  height: PropTypes.number,
  displayValue: PropTypes.bool
};

export default BarcodeDisplay;