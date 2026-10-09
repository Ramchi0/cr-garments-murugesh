const textEncoder = new TextEncoder();

function getValues(value) {
  return (Array.isArray(value) ? value : [value])
    .map((item) => String(item ?? '').trim())
    .filter(Boolean);
}

function escapeVCardText(value) {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\r|\n/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,');
}

function foldLine(line) {
  let folded = '';
  let currentLine = '';
  let currentLength = 0;
  let maxLength = 75;

  for (const character of line) {
    const characterLength = textEncoder.encode(character).length;
    if (currentLength + characterLength > maxLength && currentLine) {
      folded += `${currentLine}\r\n `;
      currentLine = '';
      currentLength = 1;
      maxLength = 75;
    }
    currentLine += character;
    currentLength += characterLength;
  }

  return folded + currentLine;
}

function toPhoneNumber(value) {
  const stringValue = String(value ?? '').trim();
  const digits = stringValue.replace(/\D/g, '');
  return digits ? `+${digits}` : '';
}

function toWebsiteUrl(value) {
  const stringValue = String(value ?? '').trim();
  if (!stringValue) {
    return '';
  }

  if (/^https?:\/\//i.test(stringValue)) {
    return stringValue;
  }

  return `https://www.${stringValue.replace(/^www\./i, '')}`;
}

function toVcfFilename(profile) {
  const parts = [profile.contactName || profile.name, profile.company]
    .map((value) => String(value ?? '').trim())
    .filter(Boolean)
    .map((value) => value.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, ''))
    .filter(Boolean);

  return `${parts.length ? parts.join('-') : 'contact'}.vcf`;
}

export function detectContactPlatform() {
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

export function isIOSInAppBrowser() {
  const userAgent = globalThis.navigator?.userAgent ?? '';
  return /FBAN|FBAV|FB_IAB|Instagram|LinkedInApp|Twitter|MicroMessenger|Line\/|TikTok|Snapchat|WhatsApp|Outlook-iOS|Gmail|Pinterest|Reddit|Discord/i.test(userAgent);
}

export function generateContactVCard(profile, platform = detectContactPlatform()) {
  const fullName = getValues(profile.contactName || profile.name)[0] ?? '';
  const nameParts = fullName.split(/\s+/).filter(Boolean);
  const givenName = nameParts.length > 1 ? nameParts.shift() : (nameParts[0] ?? '');
  const familyName = nameParts.join(' ');
  const fields = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${escapeVCardText(familyName)};${escapeVCardText(givenName)};;;`,
    `FN:${escapeVCardText(fullName)}`,
  ];

  const organization = getValues(profile.company)[0];
  const title = getValues(profile.designation)[0];
  if (organization) {
    fields.push(`ORG:${escapeVCardText(organization)}`);
  }
  if (title) {
    fields.push(`TITLE:${escapeVCardText(title)}`);
  }

  for (const mobile of getValues(profile.mobile)) {
    const phoneNumber = toPhoneNumber(mobile);
    if (phoneNumber) {
      fields.push(`TEL;TYPE=CELL,VOICE:${phoneNumber}`);
    }
  }

  for (const whatsapp of getValues(profile.whatsapp)) {
    const phoneNumber = toPhoneNumber(whatsapp);
    if (phoneNumber) {
      if (platform === 'ios') {
        const labelIndex = fields.filter((field) => field.startsWith('item')).length / 2 + 1;
        fields.push(
          `item${labelIndex}.TEL;TYPE=CELL,VOICE:${phoneNumber}`,
          `item${labelIndex}.X-ABLabel:WhatsApp`,
        );
      } else if (platform === 'android') {
        fields.push(`TEL;TYPE=WHATSAPP:${phoneNumber}`);
      } else {
        fields.push(`TEL;TYPE=CELL,VOICE:${phoneNumber}`);
      }
    }
  }

  for (const email of getValues(profile.email)) {
    fields.push(`EMAIL;TYPE=INTERNET:${escapeVCardText(email)}`);
  }

  const website = toWebsiteUrl(getValues(profile.website)[0]);
  if (website) {
    fields.push(`URL;TYPE=WORK:${escapeVCardText(website)}`);
  }

  const location = getValues(profile.location)[0];
  if (location) {
    fields.push(`ADR;TYPE=WORK:;;;;;;${escapeVCardText(location)}`);
  }

  fields.push('END:VCARD');
  return fields.map(foldLine).join('\r\n') + '\r\n';
}

export function generateVCard(profile) {
  return generateContactVCard(profile);
}

export function downloadVCard(profile, platform = detectContactPlatform()) {
  const vCard = generateContactVCard(profile, platform);
  const blob = new Blob([vCard], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  if (platform !== 'ios') {
    link.download = toVcfFilename(profile);
  }
  link.hidden = true;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
