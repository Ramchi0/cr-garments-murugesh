import { UserRoundPlus } from 'lucide-react';
import { useRef } from 'react';
import profile from '../data/profile.js';
import {
  detectContactPlatform,
  downloadVCard,
  isIOSInAppBrowser,
} from '../utils/vcard.js';

export function SaveContactButton() {
  const contactPlatform = detectContactPlatform();
  const isIOS = contactPlatform === 'ios';
  const isInAppBrowser = isIOS && isIOSInAppBrowser();
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
    <>
      <button
        type="button"
        className="save-contact"
        onClick={handleDownload}
        aria-label="Save contact as vCard"
        aria-describedby={isIOS ? 'ios-contact-guidance' : undefined}
      >
        <UserRoundPlus size={16} strokeWidth={2} />
        <span>Save Contact</span>
      </button>
      {isIOS && (
        <p id="ios-contact-guidance" className="save-contact-guidance" role="note">
          {isInAppBrowser
            ? 'For the most reliable import, open this page in Safari. Tap Create New Contact or Add to Existing Contact, then tap Done to save; Done on the preview only closes it.'
            : 'Tap Create New Contact or Add to Existing Contact, then tap Done to save; Done on the preview only closes it. If this page is inside another app, open it in Safari.'}
        </p>
      )}
    </>
  );
}
