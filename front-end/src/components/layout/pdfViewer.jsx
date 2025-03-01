import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  CardContent, 
  IconButton, 
  Typography, 
  Box,
  Paper,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  Lock,
  Fullscreen,
  FullscreenExit
} from '@mui/icons-material';

const CustomPdfViewer = ({ encryptedUrl, viewOnly = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  // Ref to keep track of the current render task
  const renderTaskRef = useRef(null);

  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const decryptPdfUrl = (encrypted) => {
    try {
      return window.atob(encrypted);
    } catch (error) {
      console.error('Decryption failed:', error);
      setError('Invalid URL format');
      return null;
    }
  };

  const renderPage = async (pageNum) => {
    try {
      if (!pdfDoc || !canvasRef.current || !window.pdfjsLib) return;

      const page = await pdfDoc.getPage(pageNum);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const viewport = page.getViewport({ scale: zoomLevel });
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
        enableWebGL: true,
        renderInteractiveForms: true
      };

      // Cancel any ongoing render task before starting a new one
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
      renderTaskRef.current = page.render(renderContext);
      await renderTaskRef.current.promise;

      if (viewOnly) {
        ctx.save();
        ctx.globalAlpha = 0.1;
        ctx.font = `${isMobile ? 24 : 48}px Arial`;
        ctx.translate(viewport.width / 2, viewport.height / 2);
        ctx.rotate(-45 * Math.PI / 180);
        ctx.fillText('HUDC IR VIEW ONLY', -100, 0);
        ctx.restore();
      }
    } catch (error) {
      // Ignore cancellation errors
      if (error && error.name === "RenderingCancelledException") {
        console.warn("Render cancelled, ignoring:", error);
        return;
      }
      console.error('Error rendering page:', error);
      setError('Failed to render page');
    }
  };

  const initializePdf = async () => {
    if (!window.pdfjsLib) {
      setTimeout(initializePdf, 100);
      return;
    }

    // Disable font-face rendering to work around the font error
    window.pdfjsLib.disableFontFace = true;

    try {
      const url = decryptPdfUrl(encryptedUrl);
      if (!url) throw new Error('Invalid URL');

      const loadingTask = window.pdfjsLib.getDocument(url);
      const pdf = await loadingTask.promise;
      
      setPdfDoc(pdf);
      setPageCount(pdf.numPages);
      setIsLoading(false);
      // Render first page after PDF loads
      setTimeout(() => {
        renderPage(1);
      }, 0);
    } catch (error) {
      console.error('PDF initialization failed:', error);
      setError(error.message || 'Failed to load PDF');
      setIsLoading(false);
    }
  };

  const handlePageChange = async (newPage) => {
    if (newPage >= 1 && newPage <= pageCount) {
      setCurrentPage(newPage);
      await renderPage(newPage);
    }
  };

  const handleZoomChange = async (newZoom) => {
    setZoomLevel(newZoom);
    await renderPage(currentPage);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    initializePdf();
  }, []);

  // Render the current page once the pdfDoc is available and canvas is mounted.
  useEffect(() => {
    if (pdfDoc && canvasRef.current) {
      renderPage(currentPage);
    }
  }, [pdfDoc]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
    </div>
    );
  }

  return (
    <Card 
      ref={containerRef}
      sx={{ 
        width: '100%', 
        margin: 'auto',
        height: isFullscreen ? '100vh' : 'auto'
      }}
    >
      <CardContent sx={{ 
        padding: isMobile ? 1 : 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          gap={2}
          height="100%"
        >
          <Box 
            display="flex" 
            alignItems="center" 
            gap={isMobile ? 1 : 2} 
            mb={2}
            flexWrap="wrap"
            justifyContent="center"
          >
            <IconButton
              onClick={() => handleZoomChange(Math.max(0.5, zoomLevel - 0.1))}
              disabled={zoomLevel <= 0.5}
              size={isMobile ? "small" : "medium"}
            >
              <ZoomOut />
            </IconButton>

            <IconButton
              onClick={() => handleZoomChange(zoomLevel + 0.1)}
              size={isMobile ? "small" : "medium"}
            >
              <ZoomIn />
            </IconButton>

            <IconButton
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              size={isMobile ? "small" : "medium"}
            >
              <ChevronLeft />
            </IconButton>

            <Typography variant={isMobile ? "caption" : "body2"}>
              Page {currentPage} of {pageCount}
            </Typography>

            <IconButton
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= pageCount}
              size={isMobile ? "small" : "medium"}
            >
              <ChevronRight />
            </IconButton>

            <IconButton
              onClick={toggleFullscreen}
              size={isMobile ? "small" : "medium"}
            >
              {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
            </IconButton>

            {viewOnly && (
              <Box display="flex" alignItems="center" gap={1}>
                <Lock sx={{ 
                  color: 'warning.main', 
                  fontSize: isMobile ? 16 : 20 
                }} />
                <Typography 
                  variant={isMobile ? "caption" : "body2"}
                  color="warning.main"
                >
                  View Only
                </Typography>
              </Box>
            )}
          </Box>

          <Paper 
            elevation={1} 
            sx={{ 
              borderRadius: 1, 
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
              width: '100%',
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: isMobile ? '400px' : '600px'
            }}
          >
            <canvas
              ref={canvasRef}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                touchAction: 'none',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none'
              }}
            />
          </Paper>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CustomPdfViewer;
