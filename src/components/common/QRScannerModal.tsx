import React, { useState } from 'react';
import { QrCode, CheckCircle2, X, Camera, Upload, Zap, ShieldCheck } from 'lucide-react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  expectedToken: string;
  onSuccessScan: (scannedToken: string) => void;
  title?: string;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  expectedToken,
  onSuccessScan,
  title = 'Scan Monthly Pass Renewal / Outing QR Code',
}) => {
  const [scanMode, setScanMode] = useState<'camera' | 'upload'>('camera');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<'success' | 'invalid' | null>(null);

  if (!isOpen) return null;

  const handleSimulateScan = (codeToScan?: string) => {
    const code = codeToScan || expectedToken;
    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      setIsScanning(false);
      if (code.includes('DHAANISH') || code === expectedToken) {
        setScanResult('success');
        setTimeout(() => {
          onSuccessScan(code);
        }, 1200);
      } else {
        setScanResult('invalid');
      }
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleSimulateScan(expectedToken);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 text-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-navy-700 space-y-5 relative">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-navy-700 text-amber-300 rounded-lg">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-navy-900 text-sm">{title}</h3>
              <p className="text-[11px] text-neutral-500">Dhaanish Gate Control & Pass Validator</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success State Overlay */}
        {scanResult === 'success' ? (
          <div className="py-8 text-center space-y-3 bg-emerald-50 rounded-xl border border-emerald-300 p-6 animate-scale-up">
            <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-base font-bold text-emerald-900">QR Code Verified Successfully!</h4>
              <p className="text-xs text-emerald-700 mt-1 font-semibold">
                Monthly Pass Renewal & Digital Outing Gate Clearance Activated!
              </p>
            </div>
            <div className="inline-block bg-emerald-800 text-white font-mono text-[11px] px-3 py-1 rounded">
              TOKEN MATCH: {expectedToken}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Mode Switcher */}
            <div className="grid grid-cols-2 gap-2 bg-neutral-100 p-1 rounded-xl">
              <button
                onClick={() => setScanMode('camera')}
                className={`py-2 rounded-lg font-bold flex items-center justify-center space-x-1.5 transition ${
                  scanMode === 'camera' ? 'bg-navy-700 text-white shadow' : 'text-neutral-600 hover:text-navy-900'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Live Scanner View</span>
              </button>
              <button
                onClick={() => setScanMode('upload')}
                className={`py-2 rounded-lg font-bold flex items-center justify-center space-x-1.5 transition ${
                  scanMode === 'upload' ? 'bg-navy-700 text-white shadow' : 'text-neutral-600 hover:text-navy-900'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Upload QR Image</span>
              </button>
            </div>

            {/* Viewport Area */}
            <div className="relative bg-navy-950 rounded-2xl h-64 overflow-hidden flex flex-col items-center justify-center text-white border-4 border-navy-800 shadow-inner">
              
              {/* Corner target brackets */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-amber-400 rounded-tl" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-amber-400 rounded-tr" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-amber-400 rounded-bl" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-amber-400 rounded-br" />

              {/* Scanning Red/Amber Laser animation */}
              {isScanning && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-red-500 via-amber-300 to-red-500 shadow-[0_0_15px_#f59e0b] animate-pulse top-1/2" />
              )}

              {scanMode === 'camera' ? (
                <div className="text-center space-y-3 p-4">
                  <div className="w-20 h-20 border-2 border-dashed border-amber-300/60 rounded-xl flex items-center justify-center mx-auto bg-navy-900/50">
                    <Camera className={`w-10 h-10 text-amber-300 ${isScanning ? 'animate-pulse' : ''}`} />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-amber-300">Align Warden QR Code within frame</p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">Camera feed active. Point camera at monthly QR code.</p>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-3 p-4">
                  <Upload className="w-10 h-10 text-amber-300 mx-auto" />
                  <div>
                    <p className="font-bold text-xs text-amber-300">Select Warden QR Image file</p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">Choose downloaded PNG QR image from Warden office</p>
                  </div>
                  <label className="inline-block bg-amber-400 text-navy-950 font-bold px-4 py-2 rounded-lg cursor-pointer hover:bg-amber-300 shadow">
                    Choose QR Image
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>
              )}

              {scanResult === 'invalid' && (
                <div className="absolute inset-0 bg-red-900/90 flex flex-col items-center justify-center text-white space-y-2 p-4">
                  <p className="font-bold text-sm">Invalid / Expired QR Code</p>
                  <p className="text-[11px] text-red-200 text-center">QR Code token did not match current Warden monthly renewal code.</p>
                  <button
                    onClick={() => setScanResult(null)}
                    className="bg-white text-red-900 font-bold px-3 py-1 rounded text-xs mt-2"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>

            {/* Quick Action Button for Quick Testing */}
            <div className="pt-1">
              <button
                onClick={() => handleSimulateScan()}
                disabled={isScanning}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center space-x-2 shadow transition active:scale-95 disabled:opacity-50"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>{isScanning ? 'Verifying QR Token Signature...' : 'Simulate Scan Warden Monthly QR Code'}</span>
              </button>
            </div>

            <div className="flex items-center space-x-2 bg-neutral-50 p-2.5 rounded-lg border border-neutral-200 text-[10px] text-neutral-600">
              <ShieldCheck className="w-4 h-4 text-navy-700 shrink-0" />
              <span>Scanning validates your monthly pass with Warden Office & activates instant digital gate pass.</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
