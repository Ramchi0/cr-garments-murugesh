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
  const parts = [profile.contactName || profile.name, profile.company]
    .map((value) => String(value ?? '').trim())
    .filter(Boolean)
    .map((value) => value.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, ''))
    .filter(Boolean);

  const slug = parts.length ? parts.join('-') : 'contact';

  return `${slug}.vcf`;
}

function detectContactPlatform() {
  const userAgent = globalThis.navigator?.userAgent ?? '';
  const platform = globalThis.navigator?.platform ?? '';
  const maxTouchPoints = globalThis.navigator?.maxTouchPoints ?? 0;
  const isIOS =
    /iPad|iPhone|iPod/i.test(userAgent) ||
    (platform === 'MacIntel' && maxTouchPoints > 1);

  if (isIOS) {
    return 'ios';
  }
  if (/Android/i.test(userAgent)) {
    return 'android';
  }

  return 'other';
}

export function generateContactVCard(profile, platform = detectContactPlatform()) {
  const mobile = toPhoneNumber(profile.mobile);
  const whatsapp = toPhoneNumber(profile.whatsapp);
  const website = toWebsiteUrl(profile.website);
  const contactName = profile.contactName || profile.name;

  const fields = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${contactName};;;;`,
    `FN:${contactName}`,
    `ORG:${profile.company}`,
    `TITLE:${profile.designation}`,
    `TEL;TYPE=CELL,VOICE:${mobile}`,
  ];

  if (platform === 'ios') {
    fields.push(
      `item1.TEL:${whatsapp}`,
      'item1.X-ABLabel:WhatsApp',
    );
  } else {
    fields.push(`TEL;TYPE=WHATSAPP:${whatsapp}`);
  }

  fields.push(
    `EMAIL;TYPE=INTERNET:${profile.email}`,
    `URL;TYPE=WORK:${website}`,
    `ADR;TYPE=WORK:;;${profile.location};;;;`,
    'END:VCARD',
  );

  return fields.join('\r\n') + '\r\n';
}

export function generateVCard(profile) {
  return generateContactVCard(profile);
}

export function downloadVCard(profile) {
  const vCard = generateContactVCard(profile);
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
