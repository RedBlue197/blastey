// General function to detect platform
const detectPlatform = (): string => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
  
      if (width > 1024) {
        return 'desktop';
      } else if (width <= 1024 && width > 480) {
        return 'responsive';
      } else {
        return 'mobile_app';
      }
    }
    return 'unknown';
  };
  
  // General function to track events with platform
  const trackEvent = (eventName: string, params: Record<string, any>) => {
    const platform = detectPlatform();
    
    // Add platform automatically to event params
    const eventData = {
      event: eventName,
      platform: platform, // Platform detection
      ...params, // Additional event parameters
    };
  
    // Send event to GTM
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push(eventData);
    }
  };
  
  export default trackEvent;
  