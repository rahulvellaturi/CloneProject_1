import React from 'react';

/**
 * Classic Facebook login header wordmark — white lowercase on the blue bar.
 * Inline SVG (no external file) so it always renders as "facebook".
 * Typography matches the legacy login page (Klavika-style bold sans).
 */
const FacebookWordmark = ({ className = '' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 180 40"
    width="180"
    height="40"
    role="img"
    aria-label="Facebook"
  >
    <text
      x="0"
      y="32"
      fill="currentColor"
      fontFamily='"Helvetica Neue", Helvetica, Arial, sans-serif'
      fontSize="32"
      fontWeight="700"
      letterSpacing="-0.5"
    >
      facebook
    </text>
  </svg>
);

export default FacebookWordmark;
