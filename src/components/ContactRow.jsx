export function ContactRow({ icon: Icon, label, value, href, external = false, ariaLabel }) {
  const rowClass = `contact-row contact-row--${label.toLowerCase()}`;

  const content = (
    <>
      <span className="row-icon" aria-hidden="true">
        <Icon size={18} strokeWidth={1.8} />
      </span>
      <span className="row-copy">
        <span className="row-label">{label}</span>
        <span className="row-value">{value}</span>
      </span>
    </>
  );

  if (!href) {
    return (
      <div className={rowClass} aria-label={ariaLabel || `${label}: ${value}`}>
        {content}
      </div>
    );
  }

  return (
    <a
      className={rowClass}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      aria-label={ariaLabel || `${label}: ${value}`}
    >
      {content}
    </a>
  );
}
