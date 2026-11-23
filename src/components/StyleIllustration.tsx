import {ClothingStyleId} from '../data/profileOptions';

interface StyleIllustrationProps {
  styleId: ClothingStyleId;
  selected?: boolean;
}

export function StyleIllustration({styleId, selected = false}: StyleIllustrationProps) {
  const bgFill = selected ? '#DBEAFE' : '#EBF6FF';

  switch (styleId) {
    case 'casual':
      return (
        <svg
          viewBox="0 0 80 80"
          className="w-16 h-16 sm:w-[72px] sm:h-[72px] shrink-0"
          aria-hidden="true"
        >
          <rect width="80" height="80" rx="18" fill={bgFill} />
          {/* Warm autumn cardigan & cozy knit sweater */}
          <path
            d="M25 22 L33 18 Q40 22 47 18 L55 22 L63 36 L56 40 L52 31 L52 57 Q40 59 28 57 L28 31 L24 40 L17 36 Z"
            fill="#38BDF8"
            stroke="#0369A1"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          {/* Inner cream tee */}
          <path
            d="M34 19 Q40 25 46 19 L44 33 L36 33 Z"
            fill="#FFFBEB"
            stroke="#0369A1"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Cardigan opening & buttons */}
          <line x1="40" y1="30" x2="40" y2="57" stroke="#0369A1" strokeWidth="2.2" />
          <circle cx="37" cy="37" r="1.6" fill="#0369A1" />
          <circle cx="37" cy="45" r="1.6" fill="#0369A1" />
          <circle cx="37" cy="53" r="1.6" fill="#0369A1" />
          {/* Small autumn leaf pocket accent */}
          <path
            d="M44 43 Q48 39 50 43 Q48 47 44 43 Z"
            fill="#F59E0B"
            stroke="#B45309"
            strokeWidth="1.4"
          />
        </svg>
      );

    case 'neat':
      return (
        <svg
          viewBox="0 0 80 80"
          className="w-16 h-16 sm:w-[72px] sm:h-[72px] shrink-0"
          aria-hidden="true"
        >
          <rect width="80" height="80" rx="18" fill={bgFill} />
          {/* Crisp collared shirt + neat knit vest / blazer */}
          <path
            d="M24 23 L33 18 L47 18 L56 23 L62 39 L55 42 L51 32 L51 58 L29 58 L29 32 L25 42 L18 39 Z"
            fill="#1E40AF"
            stroke="#0F2942"
            strokeWidth="2.3"
            strokeLinejoin="round"
          />
          {/* Crisp white shirt V-neck */}
          <path
            d="M33 18 L40 35 L47 18 Z"
            fill="#FFFFFF"
            stroke="#0F2942"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Shirt collar flaps */}
          <path
            d="M33 18 L37 25 L40 22 L43 25 L47 18"
            fill="#E0F2FE"
            stroke="#0F2942"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* Neat lapel / pocket detail */}
          <line x1="40" y1="35" x2="40" y2="58" stroke="#93C5FD" strokeWidth="1.8" />
          <rect x="44" y="38" width="5" height="2.5" rx="1" fill="#BAE6FD" />
        </svg>
      );

    case 'active':
      return (
        <svg
          viewBox="0 0 80 80"
          className="w-16 h-16 sm:w-[72px] sm:h-[72px] shrink-0"
          aria-hidden="true"
        >
          <rect width="80" height="80" rx="18" fill={bgFill} />
          {/* Lightweight outdoor windbreaker */}
          <path
            d="M24 23 L32 17 Q40 20 48 17 L56 23 L64 38 L56 41 L52 31 L52 57 L28 57 L28 31 L24 41 L16 38 Z"
            fill="#0EA5E9"
            stroke="#0369A1"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          {/* High stand collar */}
          <path
            d="M32 17 L34 13 Q40 15 46 13 L48 17 Q40 21 32 17 Z"
            fill="#BAE6FD"
            stroke="#0369A1"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Colorblock chest stripe */}
          <path d="M28 33 L52 33 L52 39 L28 39 Z" fill="#FFFFFF" opacity="0.92" />
          {/* Front zipper */}
          <line x1="40" y1="19" x2="40" y2="57" stroke="#0369A1" strokeWidth="2.3" />
          <rect x="38.2" y="24" width="3.6" height="5" rx="1" fill="#FBBF24" stroke="#0369A1" strokeWidth="1.2" />
        </svg>
      );

    case 'classic':
      return (
        <svg
          viewBox="0 0 80 80"
          className="w-16 h-16 sm:w-[72px] sm:h-[72px] shrink-0"
          aria-hidden="true"
        >
          <rect width="80" height="80" rx="18" fill={bgFill} />
          {/* Classic autumn trench coat */}
          <path
            d="M25 22 L33 17 L47 17 L55 22 L61 41 L54 43 L51 32 L53 60 L27 60 L29 32 L26 43 L19 41 Z"
            fill="#E7C89E"
            stroke="#78350F"
            strokeWidth="2.3"
            strokeLinejoin="round"
          />
          {/* Coat lapels */}
          <path
            d="M33 17 L40 34 L31 28 Z"
            fill="#F5E4C8"
            stroke="#78350F"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M47 17 L40 34 L49 28 Z"
            fill="#F5E4C8"
            stroke="#78350F"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* Inner sky-navy scarf peek */}
          <path d="M35 17 L40 28 L45 17 Z" fill="#0284C7" />
          {/* Waist belt */}
          <rect x="27" y="40" width="26" height="4.5" rx="1.5" fill="#B45309" />
          <rect x="37" y="39.5" width="6" height="5.5" rx="1" fill="#FEF3C7" stroke="#78350F" strokeWidth="1.4" />
        </svg>
      );
  }
}
