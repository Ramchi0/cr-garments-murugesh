import portrait from '../assets/CR.jpeg';
import profile from '../data/profile.js';

export function CEOProfile() {
  return (
    <section className="executive-profile" aria-labelledby="executive-name">
      <div className="portrait-panel" aria-label="Executive portrait panel">
        <img
          src={portrait}
          alt="Murugesh, CEO of C.R. Garments"
          className="portrait-image"
        />
        <div className="portrait-overlay" aria-hidden="true" />
        <span className="portrait-badge">CEO</span>
      </div>

      <div className="profile-copy">
        <p className="eyebrow">CHIEF EXECUTIVE OFFICER</p>
        <h1 id="executive-name">{profile.name}</h1>
        <p className="designation">{profile.designation}</p>
        <p className="company-name">{profile.company}</p>
      </div>
    </section>
  );
}
