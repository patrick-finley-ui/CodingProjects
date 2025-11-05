import uipathLogo from '../assets/uipath-logo-png_seeklogo-618304.png';
import dodLogo from '../assets/dod-logo.png';
import { resolveAssetUrl } from '../utils/assetHelpers';

export const Header = () => {
  // Determine whether to use local or URL images
  const useLocalImages = import.meta.env.VITE_USE_LOCAL_IMAGES === 'true';
  
  // Default URLs (fallback if env vars not set)
  const DEFAULT_DOD_URL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Seal_of_the_United_States_Department_of_Defense.svg/800px-Seal_of_the_United_States_Department_of_Defense.svg.png';
  const DEFAULT_UIPATH_URL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/UiPath_2021.svg/320px-UiPath_2021.svg.png';
  
  // Get logo sources based on configuration
  const dodLogoSrc = useLocalImages 
    ? resolveAssetUrl(dodLogo)
    : (import.meta.env.VITE_DOD_LOGO_URL || DEFAULT_DOD_URL);
    
  const uipathLogoSrc = useLocalImages 
    ? resolveAssetUrl(uipathLogo)
    : (import.meta.env.VITE_UIPATH_LOGO_URL || DEFAULT_UIPATH_URL);

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-2">
        <div className="flex items-center justify-between">
          {/* Left: DoD Logo */}
          <div className="flex items-center">
            <img
              src={dodLogoSrc}
              alt="Department of Defense"
              className="h-20 w-auto object-contain"
            />
          </div>

          {/* Center: App Title */}
          <div className="flex-1 flex justify-center">
            <h1 className="text-3xl font-bold text-gray-900">Invoice Processing Dashboard</h1>
          </div>

          {/* Right: UiPath Logo */}
          <div className="flex items-center">
            <img
              src={uipathLogoSrc}
              alt="UiPath"
              className="h-28 w-auto object-contain"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
