interface Window {
  dataLayer?: any[];
  trackEvent?: (category: string, action: string, label?: string) => void;
}

declare interface CustomEventData {
  event: string;
  eventCategory?: string;
  eventAction?: string;
  eventLabel?: string;
  pixType?: string;
  location?: string;
  feedbackType?: string;
  customDimensions?: {
    appVersion: string;
    userType: string;
  };
}
