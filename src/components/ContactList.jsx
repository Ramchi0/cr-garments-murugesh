import { Globe2, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import profile from '../data/profile.js';
import { ContactRow } from './ContactRow.jsx';

const contactRows = [
  {
    icon: Phone,
    label: 'MOBILE',
    value: profile.mobile,
    href: 'tel:+919843047673',
    ariaLabel: 'Call Murugesh on mobile',
  },
  {
    icon: MessageCircle,
    label: 'WHATSAPP',
    value: profile.whatsapp,
    href: 'https://wa.me/918754022673',
    external: true,
    ariaLabel: 'Open Murugesh WhatsApp chat',
  },
  {
    icon: Mail,
    label: 'EMAIL',
    value: profile.email,
    href: `mailto:${profile.email}`,
    ariaLabel: 'Send email to Murugesh',
  },
  {
    icon: Globe2,
    label: 'WEBSITE',
    value: profile.website,
    href: 'https://www.crgarments.com',
    external: true,
    ariaLabel: 'Visit C.R. Garments website',
  },
  {
    icon: MapPin,
    label: 'LOCATION',
    value: profile.location,
    ariaLabel: 'Murugesh is based in India',
  },
];

export function ContactList() {
  return (
    <section className="contact-panel" aria-label="Contact list">
      {contactRows.map((item) => (
        <ContactRow key={item.label} {...item} />
      ))}
    </section>
  );
}
