import React, { useState } from 'react';
import { LotteryResult } from '../../types/lottery';
import {
  Download,
  Maximize2,
  ExternalLink,
  ShieldCheck,
  ImageOff,
  FileImage,
  ZoomIn,
  ZoomOut,
  X
} from 'lucide-react';

interface OfficialResultImageViewerProps {
  result: LotteryResult;
}

export const OfficialResultImageViewer: React.FC<OfficialResultImageViewerProps> = ({ result }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [downloading, setDownloading] = useState(false);

  const imageUrl = result.officialResultImage || result.officialSource?.officialImageUrl;

  const handleDownload = async () => {
    if (!imageUrl) return;
    setDownloading(true);
    try {
      const sanitizedName = `${result.stateCode}_${result.lotteryName.replace(/[^a-zA-Z0-9]/g, '_')}_${result.drawDate}.jpg`;
      const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}&download=true&filename=${encodeURIComponent(sanitizedName)}`;

      const response = await fetch(proxyUrl);
      if (response.ok) {
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = sanitizedName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
      } else {
        window.open(imageUrl, '_blank');
      }
    } catch (err) {
      console.warn('Download error, opening direct URL:', err);
      window.open(imageUrl, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.3, 3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.3, 0.7));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <section className="bg-white border-2 border-blue-600 rounded-lg p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Header section with state, lottery name, and draw date */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <FileImage className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl sm:text-2xl font-black text-blue-900 tracking-tight">
              Official Result Gazette Image
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Official scanned government gazette published by {result.stateName} State Lottery for{' '}
            <span className="font-bold text-slate-900">{result.lotteryName}</span> (Draw #{result.drawNumber}) on{' '}
            <span className="font-bold text-slate-900 font-mono-code">{result.drawDate}</span>.
          </p>
        </div>

        {imageUrl && !imageError && (
          <div className="shrink-0">
            {/* Clearly Visible Solid BLUE Download Result Image Button */}
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm sm:text-base font-extrabold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm disabled:opacity-60 cursor-pointer uppercase tracking-wider"
              title="Download official result image to your device"
            >
              <Download className={`w-5 h-5 ${downloading ? 'animate-bounce' : ''}`} />
              <span>{downloading ? 'DOWNLOADING...' : 'DOWNLOAD RESULT IMAGE'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Image Display Area */}
      {imageUrl && !imageError ? (
        <div className="space-y-4">
          <div className="relative group bg-slate-50 border-2 border-slate-300 rounded-lg overflow-hidden min-h-[240px] max-h-[600px] flex items-center justify-center">
            {imageLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-10">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2" />
                <span className="text-sm font-bold text-blue-900">Loading official gazette image...</span>
              </div>
            )}

            <img
              src={imageUrl}
              alt={`Official Government Result Sheet - ${result.lotteryName} ${result.drawDate}`}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageLoading(false);
                setImageError(true);
              }}
              className="w-auto h-auto max-h-[580px] object-contain mx-auto transition-transform duration-200 cursor-pointer"
              onClick={() => setIsModalOpen(true)}
              referrerPolicy="no-referrer"
              loading="lazy"
            />

            {/* Overlay buttons */}
            {!imageLoading && (
              <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-blue-950/90 p-2 rounded-lg text-white text-xs shadow-md">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded font-bold transition-colors"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>Enlarge</span>
                </button>
                <a
                  href={imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded font-bold transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open URL</span>
                </a>
              </div>
            )}
          </div>

          {/* Action Row below image */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Official Government Source Verified</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-300 transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
                View Fullscreen
              </button>

              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-extrabold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
              >
                <Download className="w-4 h-4" />
                {downloading ? 'Saving...' : 'Download Result Image'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State: Official result image not available */
        <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-8 text-center space-y-3">
          <div className="w-14 h-14 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center mx-auto">
            <ImageOff className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Official result image not available
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto mt-1 leading-relaxed">
              The verified numerical winning numbers for <span className="font-bold text-blue-900">{result.lotteryName}</span> ({result.drawDate}) are shown in the result table above. The official scanned gazette image will appear here as soon as published by the state directorate.
            </p>
          </div>

          <div className="pt-2">
            <a
              href={result.officialSource.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-blue-700 bg-white hover:bg-blue-50 border border-blue-300 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Visit Official Gazette Directorate Portal
            </a>
          </div>
        </div>
      )}

      {/* Fullscreen Zoom Modal */}
      {isModalOpen && imageUrl && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col p-2 sm:p-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-white p-3 border-b border-white/20">
            <div className="flex items-center gap-2 truncate pr-4">
              <span className="font-bold text-base sm:text-lg truncate">
                {result.lotteryName} ({result.drawDate}) - Official Gazette Image
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleZoomOut}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                onClick={handleResetZoom}
                className="px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded-lg text-white font-mono-code font-bold"
                title="Reset Zoom"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                onClick={handleZoomIn}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-lg shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-white/10 hover:bg-red-600 rounded-lg text-white transition-colors"
                title="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto flex items-center justify-center p-2 sm:p-4">
            <img
              src={imageUrl}
              alt={`Full size official result ${result.lotteryName}`}
              style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.15s ease-out' }}
              className="max-w-full max-h-[85vh] object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="text-center text-xs text-slate-300 p-2 font-medium">
            Use zoom buttons to magnify. Click "Download" to save the official image to your device.
          </div>
        </div>
      )}
    </section>
  );
};
