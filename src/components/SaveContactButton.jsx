import { Download } from 'lucide-react';
import { useState } from 'react';
import profile from '../data/profile.js';

const mobileNumber = profile.mobile.replace(/\D/g, '');
const whatsappNumber = profile.whatsapp.replace(/\D/g, '');
const websiteUrl = `https://www.${profile.website.replace(/^www\./i, '')}`;

const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.name}
ORG:${profile.company}
TITLE:${profile.designation}
TEL;TYPE=CELL:${mobileNumber}
TEL;TYPE=WHATSAPP:${whatsappNumber}
EMAIL:${profile.email}
URL:${websiteUrl}
ADR;TYPE=WORK:;;;${profile.location};;;
END:VCARD`;

export function SaveContactButton() {
  const [isSaved, setIsSaved] = useState(false);

  const handleDownload = () => {
    const blob = new Blob([vCard], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Murugesh-C-R-Garments.vcf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

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
      <Download size={16} strokeWidth={2} />
      <span>{isSaved ? 'Saved' : 'Save Contact'}</span>
    </button>
  );
}
