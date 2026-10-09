import { UserRoundPlus } from 'lucide-react';

export function SaveContactButton() {
  return (
    <a
      className="save-contact"
      href="/contact.vcf"
      aria-label="Save contact as vCard"
    >
      <UserRoundPlus size={16} strokeWidth={2} />
      <span>Save Contact</span>
    </a>
  );
}
