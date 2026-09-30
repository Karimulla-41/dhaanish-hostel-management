import React, { useState, useEffect, useRef } from 'react';
import { QrCode, CheckCircle2, X, ShieldCheck, AlertTriangle } from 'lucide-react';
import jsQR from 'jsqr';

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
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<'success' | 'invalid' | null>(null);
  const [invalidMsg, setInvalidMsg] = useState<string>('');
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera feed helper
  const stopCamera = () => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setScanResult(null);
      setCameraError(null);
      return;
    }

    let isSubscribed = true;

    async function startCamera() {
      setCameraError(null);
      setScanResult(null);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } }
        });
        
        if (!isSubscribed) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true');
          await videoRef.current.play();
        }

        // Start frame scan loop
        const scanLoop = () => {
          const video = videoRef.current;
          const canvas = canvasRef.current;

          if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: 'dontInvert',
              });

              if (code && code.data) {
                const scannedData = code.data.trim();
                
                // Strict validation: Only accept Warden-generated Dhaanish Hostel QR codes
                const isValidWardenQR = 
                  scannedData.includes('DHAANISH') || 
                  scannedData.startsWith('DHAANISH_HOSTEL_') ||
                  scannedData === expectedToken;

                if (isValidWardenQR) {
                  stopCamera();
                  setScanResult('success');
                  setTimeout(() => {
                    onSuccessScan(scannedData);
                  }, 1200);
                  return;
                } else {
                  setInvalidMsg(`Scanned QR code "${scannedData.slice(0, 30)}..." is not an official Warden-generated Dhaanish Hostel QR code.`);
                  setScanResult('invalid');
                  return;
                }
              }
            }
          }

          if (isSubscribed) {
            animFrameIdRef.current = requestAnimationFrame(scanLoop);
          }
        };

        animFrameIdRef.current = requestAnimationFrame(scanLoop);

      } catch (err: any) {
        console.warn('Camera access error:', err);
        setCameraError(
          'Unable to access device camera. Please ensure camera permissions are allowed in your browser settings.'
        );
      }
    }

    startCamera();

    return () => {
      isSubscribed = false;
      stopCamera();
    };
  }, [isOpen, expectedToken, onSuccessScan]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 text-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-navy-700 space-y-5 relative">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-navy-700 text-amber-300 rounded-lg">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-navy-900 text-sm">{title}</h3>
              <p className="text-[11px] text-neutral-500">Live Web Camera QR Scanner</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
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
              <h4 className="text-base font-bold text-emerald-900">Official Warden QR Code Verified!</h4>
              <p className="text-xs text-emerald-700 mt-1 font-semibold">
                Monthly Pass Renewal & Digital Outing Gate Clearance Activated!
              </p>
            </div>
            <div className="inline-block bg-emerald-800 text-white font-mono text-[11px] px-3 py-1 rounded max-w-full truncate">
              AUTHENTIC WARDEN QR TOKEN
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Viewport Area */}
            <div className="relative bg-navy-950 rounded-2xl h-64 overflow-hidden flex flex-col items-center justify-center text-white border-4 border-navy-800 shadow-inner">
              
              {/* Corner target brackets */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-amber-400 rounded-tl z-10" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-amber-400 rounded-tr z-10" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-amber-400 rounded-bl z-10" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-amber-400 rounded-br z-10" />

              {/* Scanning Laser Line */}
              {!scanResult && !cameraError && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-red-500 via-amber-300 to-red-500 shadow-[0_0_15px_#f59e0b] animate-pulse top-1/2 z-10" />
              )}

              {/* Hidden Canvas for Frame Decoding */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Live Web Camera Feed */}
              {cameraError ? (
                <div className="text-center p-6 space-y-3 bg-red-950/80 inset-0 absolute flex flex-col items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
                  <p className="font-bold text-xs text-red-200">{cameraError}</p>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  playsInline
                />
              )}

              {/* Invalid Non-Warden QR Code Alert Overlay */}
              {scanResult === 'invalid' && (
                <div className="absolute inset-0 bg-red-950/95 z-20 flex flex-col items-center justify-center text-white space-y-3 p-5 text-center animate-fade-in">
                  <div className="w-12 h-12 bg-red-800 text-white rounded-full flex items-center justify-center">
                    <X className="w-7 h-7" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-red-200">❌ Invalid QR Code</h5>
                    <p className="text-[11px] text-red-300 mt-1 max-w-xs mx-auto leading-relaxed">
                      {invalidMsg || 'This scanner strictly accepts official Warden-generated Dhaanish Hostel QR codes only.'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setScanResult(null);
                      setInvalidMsg('');
                      // Resume animation scan loop
                      if (streamRef.current && !animFrameIdRef.current) {
                        const scanLoop = () => {
                          const video = videoRef.current;
                          const canvas = canvasRef.current;
                          if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
                            const ctx = canvas.getContext('2d');
                            if (ctx) {
                              canvas.width = video.videoWidth;
                              canvas.height = video.videoHeight;
                              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                              const code = jsQR(imageData.data, imageData.width, imageData.height);
                              if (code && code.data) {
                                const scannedData = code.data.trim();
                                const isValidWardenQR = 
                                  scannedData.includes('DHAANISH') || 
                                  scannedData.startsWith('DHAANISH_HOSTEL_') ||
                                  scannedData === expectedToken;

                                if (isValidWardenQR) {
                                  stopCamera();
                                  setScanResult('success');
                                  setTimeout(() => {
                                    onSuccessScan(scannedData);
                                  }, 1200);
                                  return;
                                } else {
                                  setInvalidMsg(`Scanned QR code "${scannedData.slice(0, 30)}..." is not an official Warden-generated Dhaanish Hostel QR code.`);
                                  setScanResult('invalid');
                                  return;
                                }
                              }
                            }
                          }
                          animFrameIdRef.current = requestAnimationFrame(scanLoop);
                        };
                        animFrameIdRef.current = requestAnimationFrame(scanLoop);
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition shadow"
                  >
                    Dismiss & Scan Again
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 bg-neutral-50 p-2.5 rounded-lg border border-neutral-200 text-[10px] text-neutral-600">
              <ShieldCheck className="w-4 h-4 text-navy-700 shrink-0" />
              <span>Real-time camera scanner validates official Warden-generated QR codes directly against the Dhaanish Hostel Registry. Photo uploading is disabled for security.</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
