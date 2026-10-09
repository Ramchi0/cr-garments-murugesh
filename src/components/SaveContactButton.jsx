import { UserRoundPlus } from 'lucide-react';
import { useRef } from 'react';
import profile from '../data/profile.js';
import { detectContactPlatform, downloadVCard } from '../utils/vcard.js';

export function SaveContactButton() {
  const contactPlatform = detectContactPlatform();
  const clickLocked = useRef(false);

  const handleDownload = () => {
    if (clickLocked.current) {
      return;
    }

    clickLocked.current = true;
    try {
      downloadVCard(profile, contactPlatform);
    } finally {
      window.setTimeout(() => {
        clickLocked.current = false;
      }, 1200);
    }
  };

  return (
    <button
      type="button"
      className="save-contact"
      onClick={handleDownload}
      aria-label="Save contact as vCard"
    >
      <UserRoundPlus size={16} strokeWidth={2} />
      <span>Save Contact</span>
    </button>
  );
}
