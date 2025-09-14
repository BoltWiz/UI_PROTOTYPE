import { useState, useRef, useEffect } from 'react';
import { Camera, RotateCcw, Zap, ZapOff, Crop, Download, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

interface CameraCaptureProps {
  onCapture: (imageData: string, detectedInfo?: ItemDetection) => void;
  onClose: () => void;
}

interface ItemDetection {
  suggestedType: string;
  suggestedColors: string[];
  confidence: number;
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const [isActive, setIsActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [hasFlash, setHasFlash] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedInfo, setDetectedInfo] = useState<ItemDetection | null>(null);
  const [cropMode, setCropMode] = useState(false);
  const [brightness, setBrightness] = useState([100]);
  const [contrast, setContrast] = useState([100]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsActive(true);
        
        // Check if device has flash
        const track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();
        setHasFlash(!!(capabilities as any).torch);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsActive(false);
  };

  const toggleFlash = async () => {
    if (videoRef.current?.srcObject && hasFlash) {
      const stream = videoRef.current.srcObject as MediaStream;
      const track = stream.getVideoTracks()[0];
      
      try {
        await track.applyConstraints({
          advanced: [{ torch: !flashEnabled } as any]
        });
        setFlashEnabled(!flashEnabled);
      } catch (error) {
        console.error('Flash control error:', error);
      }
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Apply filters
    ctx.filter = `brightness(${brightness[0]}%) contrast(${contrast[0]}%)`;
    ctx.drawImage(video, 0, 0);
    
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(imageData);
    
    // Start processing for item detection
    setIsProcessing(true);
    await processItemDetection(imageData);
    setIsProcessing(false);
  };

  const processItemDetection = async (imageData: string) => {
    // Simulate AI item detection
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockDetections: ItemDetection[] = [
      { suggestedType: 'top', suggestedColors: ['white', 'blue'], confidence: 0.85 },
      { suggestedType: 'bottom', suggestedColors: ['navy', 'dark-blue'], confidence: 0.78 },
      { suggestedType: 'shoes', suggestedColors: ['black', 'brown'], confidence: 0.92 },
      { suggestedType: 'outer', suggestedColors: ['beige', 'grey'], confidence: 0.73 }
    ];
    
    const randomDetection = mockDetections[Math.floor(Math.random() * mockDetections.length)];
    setDetectedInfo(randomDetection);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setDetectedInfo(null);
    setCropMode(false);
    setBrightness([100]);
    setContrast([100]);
  };

  const downloadImage = () => {
    if (capturedImage) {
      const link = document.createElement('a');
      link.download = `wardrobe-item-${Date.now()}.jpg`;
      link.href = capturedImage;
      link.click();
    }
  };

  const confirmCapture = () => {
    if (capturedImage) {
      onCapture(capturedImage, detectedInfo || undefined);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Item Photo Capture</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {isActive && !capturedImage && (
          <div className="space-y-4">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{
                  filter: `brightness(${brightness[0]}%) contrast(${contrast[0]}%)`
                }}
              />
              
              {/* Camera overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-4 border-2 border-white/50 rounded-lg" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              </div>

              {/* Camera controls overlay */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {hasFlash && (
                  <Button
                    variant={flashEnabled ? "default" : "secondary"}
                    size="sm"
                    onClick={toggleFlash}
                    className="w-10 h-10 p-0"
                  >
                    {flashEnabled ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
                  </Button>
                )}
              </div>
            </div>

            {/* Camera adjustments */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Brightness</label>
                <Slider
                  value={brightness}
                  onValueChange={setBrightness}
                  max={200}
                  min={50}
                  step={10}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Contrast</label>
                <Slider
                  value={contrast}
                  onValueChange={setContrast}
                  max={200}
                  min={50}
                  step={10}
                />
              </div>
            </div>

            {/* Capture button */}
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={capturePhoto}
                className="w-16 h-16 rounded-full bg-white hover:bg-gray-100 text-black border-4 border-gray-300"
              >
                <Camera className="w-6 h-6" />
              </Button>
            </div>
          </div>
        )}

        {capturedImage && (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={capturedImage}
                alt="Captured item"
                className="w-full h-64 object-cover rounded-lg border"
              />
              
              {isProcessing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                  <div className="text-white text-center">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p>Analyzing item...</p>
                  </div>
                </div>
              )}
            </div>

            {detectedInfo && (
              <Card className="p-4 bg-primary/5">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  AI Detection Results
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Type:</span>
                    <Badge variant="secondary">{detectedInfo.suggestedType}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(detectedInfo.confidence * 100)}% confidence
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Colors:</span>
                    <div className="flex gap-1">
                      {detectedInfo.suggestedColors.map((color, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {color}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Photo actions */}
            <div className="flex gap-2">
              <Button variant="outline" onClick={retakePhoto} className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake
              </Button>
              <Button variant="outline" onClick={downloadImage}>
                <Download className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button onClick={confirmCapture} className="flex-1">
                <Camera className="w-4 h-4 mr-2" />
                Use Photo
              </Button>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </Card>
  );
}