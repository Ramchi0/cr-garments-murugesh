function toPhoneNumber(value) {
  const stringValue = String(value ?? '').trim();
  const digits = stringValue.replace(/\D/g, '');

  if (!digits) {
    return '';
  }

  return `+${digits}`;
}

function toWebsiteUrl(value) {
  const stringValue = String(value ?? '').trim();
  const normalized = stringValue.replace(/^https?:\/\//i, '').replace(/^www\./i, '');

  return `https://www.${normalized || 'example.com'}`;
}

function toVcfFilename(profile) {
  const parts = [profile.name, profile.company]
    .map((value) => String(value ?? '').trim())
    .filter(Boolean)
    .map((value) => value.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, ''))
    .filter(Boolean);

  const slug = parts.length ? parts.join('-') : 'contact';

  return `${slug}.vcf`;
}

export function generateVCard(profile) {
  const mobile = toPhoneNumber(profile.mobile);
  const whatsapp = toPhoneNumber(profile.whatsapp || profile.mobile);
  const website = toWebsiteUrl(profile.website);

  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${profile.name}`,
    `ORG:${profile.company}`,
    `TITLE:${profile.designation}`,
    `TEL;TYPE=CELL:${mobile}`,
    `TEL;TYPE=WORK:${mobile}`,
    `EMAIL:${profile.email}`,
    `URL:${website}`,
    `ADR;TYPE=WORK:;;;${profile.location};;;`,
    `NOTE:WhatsApp: ${whatsapp}`,
    'END:VCARD',
  ].join('\n');
}

export function downloadVCard(profile) {
  const vCard = generateVCard(profile);
  const blob = new Blob([vCard], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = toVcfFilename(profile);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}
