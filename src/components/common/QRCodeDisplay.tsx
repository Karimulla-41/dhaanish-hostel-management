import React, { useEffect, useRef } from 'react';
import { Download, QrCode } from 'lucide-react';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  title?: string;
  subtitle?: string;
  downloadFileName?: string;
  showDownloadBtn?: boolean;
}

/**
 * Generates a deterministically encoded QR pattern on HTML5 Canvas
 * with Dhaanish Institutional styling & PNG Download capabilities.
 */
export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  value,
  size = 240,
  title = 'DHAANISH MONTHLY RENEWAL QR CODE',
  subtitle = 'Official Hostel Entry Pass Renewal QR',
  downloadFileName = 'Dhaanish_Monthly_Renewal_QR.png',
  showDownloadBtn = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gridSize = 29; // 29x29 module QR matrix
    const moduleSize = size / gridSize;

    canvas.width = size;
    canvas.height = size;

    // Fill background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);

    // Hashing function for value
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = (hash << 5) - hash + value.charCodeAt(i);
      hash |= 0;
    }

    const isFinder = (r: number, c: number) => {
      if (r < 7 && c < 7) return true;
      if (r < 7 && c >= gridSize - 7) return true;
      if (r >= gridSize - 7 && c < 7) return true;
      return false;
    };

    const drawFinderPattern = (startR: number, startC: number) => {
      ctx.fillStyle = '#0B192C'; // Navy Blue primary
      ctx.fillRect(startC * moduleSize, startR * moduleSize, 7 * moduleSize, 7 * moduleSize);

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect((startC + 1) * moduleSize, (startR + 1) * moduleSize, 5 * moduleSize, 5 * moduleSize);

      ctx.fillStyle = '#0B192C';
      ctx.fillRect((startC + 2) * moduleSize, (startR + 2) * moduleSize, 3 * moduleSize, 3 * moduleSize);
    };

    // Draw data modules
    ctx.fillStyle = '#0B192C';
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (isFinder(r, c)) continue;

        // Alignment pattern at bottom right
        if (r >= 18 && r <= 22 && c >= 18 && c <= 22) {
          if (r === 18 || r === 22 || c === 18 || c === 22 || (r === 20 && c === 20)) {
            ctx.fillRect(c * moduleSize, r * moduleSize, moduleSize, moduleSize);
          }
          continue;
        }

        // Timing patterns
        if (r === 6 || c === 6) {
          if ((r + c) % 2 === 0) {
            ctx.fillRect(c * moduleSize, r * moduleSize, moduleSize, moduleSize);
          }
          continue;
        }

        // Pseudo-data pattern based on value hash
        const val = Math.abs(Math.sin((r * gridSize + c + hash) * 12.9898) * 43758.5453);
        if (val - Math.floor(val) > 0.45) {
          ctx.fillRect(c * moduleSize, r * moduleSize, moduleSize, moduleSize);
        }
      }
    }

    // Draw 3 Finders
    drawFinderPattern(0, 0);
    drawFinderPattern(0, gridSize - 7);
    drawFinderPattern(gridSize - 7, 0);

    // Center Branding Shield Badge
    const centerSize = Math.floor(size * 0.22);
    const centerPos = (size - centerSize) / 2;

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(centerPos, centerPos, centerSize, centerSize, 8);
    } else {
      ctx.fillRect(centerPos, centerPos, centerSize, centerSize);
    }
    ctx.fill();

    ctx.strokeStyle = '#0B192C';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Inner Crimson Emblem
    ctx.fillStyle = '#C51605';
    ctx.font = `bold ${Math.floor(centerSize * 0.45)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('DC', size / 2, size / 2);

  }, [value, size]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a printable card canvas
    const printCanvas = document.createElement('canvas');
    const pCtx = printCanvas.getContext('2d');
    if (!pCtx) return;

    const padding = 40;
    const headerHeight = 90;
    const footerHeight = 70;
    const cardWidth = Math.max(size + padding * 2, 380);
    const cardHeight = size + padding * 2 + headerHeight + footerHeight;

    printCanvas.width = cardWidth;
    printCanvas.height = cardHeight;

    // Card background
    pCtx.fillStyle = '#FFFFFF';
    pCtx.fillRect(0, 0, cardWidth, cardHeight);

    // Header background (Navy)
    pCtx.fillStyle = '#0B192C';
    pCtx.fillRect(0, 0, cardWidth, headerHeight);

    // Header Title
    pCtx.fillStyle = '#FFFFFF';
    pCtx.font = 'bold 16px sans-serif';
    pCtx.textAlign = 'center';
    pCtx.fillText('DHAANISH CHENNAI AUTONOMOUS', cardWidth / 2, 35);

    pCtx.fillStyle = '#F59E0B'; // Amber accent
    pCtx.font = 'bold 12px sans-serif';
    pCtx.fillText(title.toUpperCase(), cardWidth / 2, 60);

    // Draw main QR code in center
    const qrX = (cardWidth - size) / 2;
    const qrY = headerHeight + padding;
    pCtx.drawImage(canvas, qrX, qrY);

    // Subtitle & Token below QR
    pCtx.fillStyle = '#172554';
    pCtx.font = 'bold 13px sans-serif';
    pCtx.fillText(subtitle, cardWidth / 2, qrY + size + 25);

    pCtx.fillStyle = '#6B7280';
    pCtx.font = '11px monospace';
    pCtx.fillText(`TOKEN: ${value}`, cardWidth / 2, qrY + size + 45);

    // Footer
    pCtx.fillStyle = '#F3F4F6';
    pCtx.fillRect(0, cardHeight - footerHeight, cardWidth, footerHeight);

    pCtx.fillStyle = '#374151';
    pCtx.font = '10px sans-serif';
    pCtx.fillText('Scan via Dhaanish Resident App • Valid for Hostel Entry & Outings', cardWidth / 2, cardHeight - 35);
    pCtx.fillText('Issued by Block Chief Warden Office', cardWidth / 2, cardHeight - 18);

    // Trigger PNG download
    const dataUrl = printCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = downloadFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center space-y-4 bg-white p-5 rounded-2xl border-2 border-navy-700 shadow-xl max-w-sm mx-auto">
      <div className="text-center space-y-1">
        <div className="inline-flex items-center space-x-1.5 bg-navy-50 text-navy-900 font-bold px-3 py-1 rounded-full text-xs border border-navy-200">
          <QrCode className="w-3.5 h-3.5 text-navy-700" />
          <span>OFFICIAL HOSTEL PASS QR</span>
        </div>
        <h3 className="font-bold text-navy-900 text-sm">{title}</h3>
        <p className="text-[11px] text-neutral-500">{subtitle}</p>
      </div>

      <div className="p-3 bg-white rounded-xl border border-neutral-300 shadow-inner flex justify-center">
        <canvas ref={canvasRef} className="rounded" />
      </div>

      <div className="bg-neutral-100 px-3 py-1.5 rounded-md font-mono text-[10px] text-neutral-600 font-semibold text-center w-full truncate">
        {value}
      </div>

      {showDownloadBtn && (
        <button
          onClick={handleDownload}
          className="w-full bg-navy-700 hover:bg-navy-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow transition active:scale-95"
        >
          <Download className="w-4 h-4 text-amber-300" />
          <span>Download QR Code Image (.PNG)</span>
        </button>
      )}
    </div>
  );
};
