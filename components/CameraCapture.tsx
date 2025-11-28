
import React, { useRef, useEffect, useState } from 'react';
import { CameraIcon, PhotoIcon } from './Icons';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let currentStream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        currentStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        setStream(currentStream);
        if (videoRef.current) {
          videoRef.current.srcObject = currentStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Nelze přistoupit ke kameře. Zkontrolujte oprávnění.");
      }
    };

    startCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(imageData);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onCapture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-black relative rounded-2xl overflow-hidden shadow-xl">
      {error ? (
        <div className="text-white p-4 text-center">
          <p>{error}</p>
          <label className="mt-4 inline-block px-6 py-3 bg-indigo-600 rounded-full cursor-pointer hover:bg-indigo-700 transition flex items-center justify-center gap-2">
            <PhotoIcon className="w-5 h-5" />
            Nahrát fotku
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      ) : (
        <>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-6">
             <label className="p-3 bg-white/20 backdrop-blur-sm rounded-full cursor-pointer hover:bg-white/30 transition text-white">
                <span className="sr-only">Upload</span>
                 <PhotoIcon className="w-6 h-6" />
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
             </label>

            <button 
              onClick={handleCapture}
              className="w-16 h-16 bg-white rounded-full border-4 border-indigo-500 shadow-lg active:scale-95 transition-transform flex items-center justify-center"
            >
              <CameraIcon className="w-8 h-8 text-indigo-600" />
            </button>
            
            <div className="w-12"></div> {/* Spacer for balance */}
          </div>
        </>
      )}
    </div>
  );
};

export default CameraCapture;
