import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb"; 

const AutoBreadcrumb = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Split URL into segments: /profile → ["profile"]
  const segments = location.pathname.split("/").filter(Boolean);
  
  // 2. Get URL search params: ?tab=immunization
  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get('tab'); // e.g., 'immunization'

  // Convert URL segment → Pretty name with special handling for tabs
  const label = (str) => {
    // Custom mapping for the Profile tabs
    if (str === 'overview') return 'Profile Overview';
    if (str === 'immunization') return 'Immunization';
    
    // 💡 ADD Clinical tabs:
    if (str === 'vitals') return 'Vitals';
    if (str === 'lab') return 'Lab Results';
    if (str === 'encounters') return 'Clinical Encounters';
    
    // Standard capitalization for path segments (e.g., 'clinical' -> 'Clinical')
    return str
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
  };


  // 3. Define the full breadcrumb segments, including the active tab name
  const fullSegments = [...segments];

  // Only inject the tab name if it's set (it defaults to 'overview' in Profile.jsx, so it's usually set)
  if (tabParam) {
    // Add the tab parameter as the final segment
    fullSegments.push(tabParam);
  }

  return (
    <div className="flex items-center gap-2 mb-4">
      {/* BACK ARROW */}
      <button
        className="text-xl mr-2 hover:text-gray-700"
        onClick={() => navigate(-1)}
      >
        ←
      </button>

      <Breadcrumb>
        <BreadcrumbList>
          {fullSegments.map((seg, index) => { 
            const isLast = index === fullSegments.length - 1;
            
            const pathSegmentEndIndex = Math.min(index + 1, segments.length);
            let to = "/" + segments.slice(0, pathSegmentEndIndex).join("/");
            
            if (index === segments.length - 1 && tabParam && !isLast) {
                to = `${to}?tab=${tabParam}`;
            }


            return (
              <BreadcrumbItem key={index}>
                {!isLast ? (
                  <>
                    <BreadcrumbLink asChild>
                      <Link to={to}>{label(seg)}</Link>
                    </BreadcrumbLink>
                    <BreadcrumbSeparator />
                  </>
                ) : (
                  // The last item (the active tab) not clickable
                  <BreadcrumbPage>{label(seg)}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default AutoBreadcrumb;