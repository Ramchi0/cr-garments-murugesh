import { CEOProfile } from '../components/CEOProfile.jsx';
import { ContactList } from '../components/ContactList.jsx';
import { ExecutiveHeader } from '../components/ExecutiveHeader.jsx';
import { Footer } from '../components/Footer.jsx';

export function CEOProfilePage() {
  return (
    <main className="page-shell">
      <div className="profile-card">
        <ExecutiveHeader />
        <CEOProfile />
        <ContactList />
        <Footer />
      </div>
    </main>
  );
}
