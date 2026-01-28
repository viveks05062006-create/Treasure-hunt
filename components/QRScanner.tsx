
import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { Camera, Upload, AlertCircle } from 'lucide-react';

interface QRScannerProps {
  onScan: (data: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan }) => {
  const [manualInput, setManualInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const requestRef = useRef<number>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            requestRef.current = requestAnimationFrame(scanFrame);
          };
        }
        setError(null);
      } catch (err) {
        console.error("Camera access failed", err);
        setError("Camera access denied. Please use 'Upload Image' or manual entry.");
      }
    }

    startCamera();

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const scanFrame = () => {
    if (videoRef.current && canvasRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d', { willReadFrequently: true });

      if (context) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code) {
          onScan(code.data.toUpperCase());
          return; // Stop scanning once found
        }
      }
    }
    requestRef.current = requestAnimationFrame(scanFrame);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code) {
            onScan(code.data.toUpperCase());
          } else {
            alert("No QR code found in the image. Please try again.");
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-black overflow-hidden">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Hidden Canvas for Frame Processing */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Scanner Overlay UI */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        <div className="w-64 h-64 border-2 border-orange-500/50 rounded-3xl relative">
          <div className="absolute inset-0 animate-pulse bg-orange-500/5"></div>
          {/* Corner accents */}
          <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-orange-500"></div>
          <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-orange-500"></div>
          <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-orange-500"></div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-orange-500"></div>
          {/* Scanning Line */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-orange-400 shadow-[0_0_15px_rgba(251,146,60,1)] animate-[scan_2s_infinite]"></div>
        </div>
        <p className="mt-8 text-white font-battle uppercase text-xs tracking-widest text-shadow-lg bg-black/40 px-3 py-1 rounded-full">
          Seeking Target QR...
        </p>
      </div>

      {/* Manual & Upload Controls */}
      <div className="absolute bottom-4 left-0 w-full p-4 flex flex-col gap-3 z-20 pointer-events-auto">
         {error && (
           <div className="bg-red-500/20 border border-red-500/50 p-2 rounded-lg flex items-center gap-2 text-[10px] text-red-200 uppercase font-battle">
             <AlertCircle size={12} /> {error}
           </div>
         )}
         
         <div className="flex gap-2">
           <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 py-3 glass rounded-xl flex items-center justify-center gap-2 font-battle text-[10px] uppercase hover:bg-white/10"
           >
             <Upload size={14} /> Upload QR
           </button>
           <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileUpload}
           />
         </div>

         <div className="bg-black/80 p-3 rounded-xl border border-white/10 backdrop-blur-md">
           <p className="text-[10px] uppercase text-gray-500 mb-2 text-center font-battle">Manual Override (ID Input)</p>
           <div className="flex gap-2">
             <input 
              type="text" 
              placeholder="E.g. CLUE_1_QR"
              className="flex-1 bg-white/5 border border-white/20 rounded p-2 text-xs font-mono uppercase text-white outline-none focus:border-orange-500"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
             />
             <button 
              onClick={() => onScan(manualInput.toUpperCase())}
              className="bg-orange-600 px-4 rounded text-xs font-battle font-bold"
             >
               Scan
             </button>
           </div>
         </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
};

export default QRScanner;
