import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const DashboardWrapper = () => {
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle iframe load event
  const handleIframeLoad = () => {
    setIsLoading(false);
    
    try {
      // Try to access iframe content to sync URL
      const iframeWindow = iframeRef.current.contentWindow;
      syncIframeUrl(iframeWindow.location.pathname);
    } catch (error) {
      console.log("Cannot access iframe content due to security restrictions");
    }
  };

  // Function to sync iframe URL with browser URL
  const syncIframeUrl = (iframePath) => {
    // Check if this is a path that should be handled outside the dashboard
    const nonDashboardPaths = ['/login', '/register', '/forgotpassword', '/help'];
    
    if (nonDashboardPaths.some(path => iframePath.startsWith(path))) {
      // If it's a non-dashboard path, navigate directly to that route
      navigate(iframePath, { replace: true });
      return;
    }
    
    // Only update if the path is different from current location
    if (iframePath && !location.pathname.includes(iframePath)) {
      // If iframe path is root (/), we keep the dashboard base path
      if (iframePath === '/') {
        navigate('/dashboard', { replace: true });
      } else {
        // Otherwise we append the iframe path to the dashboard base path
        navigate(`/dashboard${iframePath}`, { replace: true });
      }
    }
  };

  // Set up message listener for communication from iframe
  useEffect(() => {
    const handleIframeMessage = (event) => {
      // Verify origin for security
      // Replace with your actual origin if needed
      if (event.origin !== window.location.origin) return;

      // Handle navigation messages from iframe
      if (event.data && event.data.type === 'navigation') {
        syncIframeUrl(event.data.path);
      }
    };

    window.addEventListener('message', handleIframeMessage);
    
    // Add script to iframe to enable communication
    const injectNavigationScript = () => {
      try {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          const iframeDoc = iframeRef.current.contentWindow.document;
          const script = iframeDoc.createElement('script');
          script.textContent = `
            // Override history pushState and replaceState
            const originalPushState = history.pushState;
            const originalReplaceState = history.replaceState;
            
            history.pushState = function() {
              originalPushState.apply(this, arguments);
              window.parent.postMessage({
                type: 'navigation',
                path: location.pathname
              }, '*');
            };
            
            history.replaceState = function() {
              originalReplaceState.apply(this, arguments);
              window.parent.postMessage({
                type: 'navigation',
                path: location.pathname
              }, '*');
            };
            
            // Also handle popstate events
            window.addEventListener('popstate', function() {
              window.parent.postMessage({
                type: 'navigation',
                path: location.pathname
              }, '*');
            });
            
            // Handle link clicks to capture navigation before it happens
            document.addEventListener('click', function(e) {
              // Find closest anchor tag
              const link = e.target.closest('a');
              if (link && link.href) {
                try {
                  // Get the path from the href
                  const url = new URL(link.href);
                  // Only handle same-origin links
                  if (url.origin === window.location.origin) {
                    window.parent.postMessage({
                      type: 'navigation',
                      path: url.pathname
                    }, '*');
                  }
                } catch (err) {
                  console.log('Error processing link click', err);
                }
              }
            });
          `;
          iframeDoc.head.appendChild(script);
        }
      } catch (error) {
        console.log("Cannot inject script into iframe due to security restrictions");
      }
    };

    // Try to inject the script after iframe loads
    const timer = setTimeout(injectNavigationScript, 1000);

    // Check URL on mount and redirect if needed
    const checkInitialUrl = () => {
      try {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          const iframePath = iframeRef.current.contentWindow.location.pathname;
          syncIframeUrl(iframePath);
        }
      } catch (error) {
        console.log("Cannot access initial iframe URL");
      }
    };
    
    const initialUrlTimer = setTimeout(checkInitialUrl, 1500);

    return () => {
      window.removeEventListener('message', handleIframeMessage);
      clearTimeout(timer);
      clearTimeout(initialUrlTimer);
    };
  }, [navigate, location.pathname]);

  // Set a timeout to ensure loading state doesn't get stuck
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // Fallback timeout after 5 seconds
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-screen w-full">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* Dashboard iframe */}
      <div className="h-full w-full">
        <iframe 
          ref={iframeRef}
          src="/dist/index.html" 
          className="w-full h-full border-0"
          onLoad={handleIframeLoad}
          title="Admin Dashboard"
        />
      </div>
    </div>
  );
};

export default DashboardWrapper;