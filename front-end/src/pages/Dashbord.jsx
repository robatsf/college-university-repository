
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const DashboardWrapper = () => {
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const lastSyncedPath = useRef('');
  const isNavigatingIframe = useRef(false);

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
    // Prevent redundant updates
    if (iframePath === lastSyncedPath.current) {
      return;
    }
    
    // Check if this is a path that should be handled outside the dashboard
    const nonDashboardPaths = ['/login', '/register', '/forgotpassword', '/help','/'];
    
    if (nonDashboardPaths.some(path => iframePath.startsWith(path))) {
      // If it's a non-dashboard path, navigate directly to that route
      lastSyncedPath.current = iframePath;
      navigate(iframePath, { replace: true });
      return;
    }
    
    // Only update if the path is different from current location
    if (iframePath) {
      // If iframe path is root (/), we keep the dashboard base path
      if (iframePath === '/') {
        lastSyncedPath.current = '/dashboard';
        navigate('/dashboard', { replace: true });
      } else {
        // Otherwise we append the iframe path to the dashboard base path
        const newPath = `/dashboard${iframePath}`;
        lastSyncedPath.current = newPath;
        navigate(newPath, { replace: true });
      }
    }
  };

  // Function to navigate iframe based on browser URL
  const navigateIframe = (browserPath) => {
    if (isNavigatingIframe.current) return;
    isNavigatingIframe.current = true;
    
    try {
      if (!iframeRef.current || !iframeRef.current.contentWindow) return;
      
      // Extract the path after /dashboard
      let iframePath = '/';
      if (browserPath.startsWith('/dashboard/')) {
        iframePath = browserPath.substring('/dashboard'.length);
      } else if (browserPath === '/dashboard') {
        iframePath = '/';
      }
      
      // Only navigate if the iframe path is different
      const currentIframePath = iframeRef.current.contentWindow.location.pathname;
      if (currentIframePath !== iframePath) {
        // Use the iframe's history API to navigate
        iframeRef.current.contentWindow.history.pushState({}, '', iframePath);
        
        // Dispatch a popstate event to trigger any listeners in the iframe
        const popStateEvent = new Event('popstate');
        iframeRef.current.contentWindow.dispatchEvent(popStateEvent);
        
        // If the iframe has a router, try to trigger navigation
        try {
          if (iframeRef.current.contentWindow.router && 
              typeof iframeRef.current.contentWindow.router.navigate === 'function') {
            iframeRef.current.contentWindow.router.navigate(iframePath);
          }
        } catch (e) {
          console.log("Could not access iframe router", e);
        }
      }
    } catch (error) {
      console.log("Cannot navigate iframe due to security restrictions", error);
    } finally {
      setTimeout(() => {
        isNavigatingIframe.current = false;
      }, 100);
    }
  };

  // Listen for location changes from React Router
  useEffect(() => {
    // Skip if this is the initial render or if we just synced this path
    if (location.pathname === lastSyncedPath.current) {
      return;
    }
    
    // If the browser URL changed (e.g., user typed in address bar or used back/forward),
    // update the iframe location
    if (location.pathname.startsWith('/dashboard')) {
      navigateIframe(location.pathname);
    }
  }, [location.pathname]);

  // Set up message listener for communication from iframe
  useEffect(() => {
    const handleIframeMessage = (event) => {
      // Verify origin for security
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
            
            // Immediately send current path on script load
            window.parent.postMessage({
              type: 'navigation',
              path: location.pathname
            }, '*');
            
            // Handle form submissions that might change the URL
            document.addEventListener('submit', function(e) {
              const form = e.target;
              if (form.method === 'get' && !form.hasAttribute('target')) {
                // For GET forms that would navigate the page
                setTimeout(function() {
                  window.parent.postMessage({
                    type: 'navigation',
                    path: location.pathname
                  }, '*');
                }, 0);
              }
            });
            
            // Expose a function for the parent to call to force navigation
            window.navigateTo = function(path) {
              if (path !== location.pathname) {
                history.pushState({}, '', path);
                const popStateEvent = new Event('popstate');
                window.dispatchEvent(popStateEvent);
                
                // If using a router library, try to notify it
                if (window.router && typeof window.router.navigate === 'function') {
                  window.router.navigate(path);
                }
              }
            };
          `;
          iframeDoc.head.appendChild(script);
        }
      } catch (error) {
        console.log("Cannot inject script into iframe due to security restrictions", error);
      }
    };

    // Try to inject the script after iframe loads
    const timer = setTimeout(injectNavigationScript, 1000);

    // Check URL on mount and redirect if needed
    const checkInitialUrl = () => {
      // If we're on a dashboard route, update the iframe to match
      if (location.pathname.startsWith('/dashboard')) {
        navigateIframe(location.pathname);
      } 
      // If we're at the root of the dashboard, sync the URL
      else if (location.pathname === '/dashboard') {
        lastSyncedPath.current = '/dashboard';
      }
      // Otherwise try to get the iframe path and sync it
      else {
        try {
          if (iframeRef.current && iframeRef.current.contentWindow) {
            const iframePath = iframeRef.current.contentWindow.location.pathname;
            syncIframeUrl(iframePath);
          }
        } catch (error) {
          console.log("Cannot access initial iframe URL");
        }
      }
    };
    
    const initialUrlTimer = setTimeout(checkInitialUrl, 1500);

    // Handle browser back/forward buttons
    const handlePopState = () => {
      if (location.pathname.startsWith('/dashboard')) {
        navigateIframe(location.pathname);
      }
    };
    
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('message', handleIframeMessage);
      window.removeEventListener('popstate', handlePopState);
      clearTimeout(timer);
      clearTimeout(initialUrlTimer);
    };
  }, [navigate]);

  // Set a timeout to ensure loading state doesn't get stuck
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // Fallback timeout after 5 seconds
    
    return () => clearTimeout(timer);
  }, []);

  // Handle direct URL navigation
  useEffect(() => {
    // If the user navigates directly to a dashboard URL, update the iframe
    if (location.pathname.startsWith('/dashboard')) {
      // Wait for iframe to be ready
      const timer = setTimeout(() => {
        navigateIframe(location.pathname);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
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
