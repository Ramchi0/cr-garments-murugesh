import { UserRoundPlus } from 'lucide-react';
import { useState } from 'react';
import profile from '../data/profile.js';
import { downloadVCard } from '../utils/vcard.js';

export function SaveContactButton() {
  const [isSaved, setIsSaved] = useState(false);

  const handleDownload = () => {
    downloadVCard(profile);
    setIsSaved(true);
    window.setTimeout(() => setIsSaved(false), 1100);
  };

  return (
    <button
      type="button"
      className={`save-contact${isSaved ? ' is-saved' : ''}`}
      onClick={handleDownload}
      aria-label="Save contact as vCard"
    >
      <UserRoundPlus size={16} strokeWidth={2} />
      <span>{isSaved ? 'Saved' : 'Save Contact'}</span>
    </button>
  );
}
