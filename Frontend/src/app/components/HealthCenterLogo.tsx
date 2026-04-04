/**
 * HealthCenterLogo
 *
 * Self-contained SVG logo for the Gov. Paciano Bangoy Barangay Health Center.
 * Replace this component with a real <img> tag once you have the actual logo file:
 *
 *   import logo from "../assets/logo.png";
 *   <img src={logo} alt="Health Center Logo" className={className} />
 */

interface HealthCenterLogoProps {
  className?: string;
  size?: number;
}

export function HealthCenterLogo({ className = "", size = 140 }: HealthCenterLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer circle */}
      <circle cx="70" cy="70" r="68" fill="#004b96" stroke="#ffffff" strokeWidth="3" />

      {/* Inner circle ring */}
      <circle cx="70" cy="70" r="56" fill="none" stroke="#90caf9" strokeWidth="1.5" />

      {/* Medical cross */}
      <rect x="56" y="32" width="28" height="76" rx="5" fill="#ffffff" />
      <rect x="32" y="56" width="76" height="28" rx="5" fill="#ffffff" />

      {/* Center dot */}
      <circle cx="70" cy="70" r="10" fill="#004b96" />

      {/* Caduceus-style leaf accents */}
      <ellipse cx="70" cy="50" rx="6" ry="3" fill="#90caf9" opacity="0.7" />
      <ellipse cx="70" cy="90" rx="6" ry="3" fill="#90caf9" opacity="0.7" />
      <ellipse cx="50" cy="70" rx="3" ry="6" fill="#90caf9" opacity="0.7" />
      <ellipse cx="90" cy="70" rx="3" ry="6" fill="#90caf9" opacity="0.7" />

      {/* Text arc – top */}
      <path
        id="arcTop"
        d="M 22 70 A 48 48 0 0 1 118 70"
        fill="none"
      />
      <text fontSize="8" fill="#90caf9" fontFamily="Arial, sans-serif" letterSpacing="1">
        <textPath href="#arcTop" startOffset="12%">
          GOV. PACIANO BANGOY
        </textPath>
      </text>

      {/* Text arc – bottom */}
      <path
        id="arcBottom"
        d="M 22 70 A 48 48 0 0 0 118 70"
        fill="none"
      />
      <text fontSize="7.5" fill="#90caf9" fontFamily="Arial, sans-serif" letterSpacing="0.8">
        <textPath href="#arcBottom" startOffset="16%">
          BARANGAY HEALTH CENTER
        </textPath>
      </text>
    </svg>
  );
}
