import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import profile from './src/data/profile.js';
import { generateContactVCard } from './src/utils/vcard.js';

const vCardPath = '/contact.vcf';
const vCardHeaders = {
  'Content-Type': 'text/vcard; charset=utf-8',
  'Content-Disposition': 'inline; filename="murugesh.vcf"',
};
const vCard = generateContactVCard(profile, 'other');

function contactVCardPlugin() {
  const serveVCard = (req, res, next) => {
    const pathname = req.url?.split('?')[0];
    if (pathname !== vCardPath || !['GET', 'HEAD'].includes(req.method ?? '')) {
      next();
      return;
    }

    res.writeHead(200, vCardHeaders);
    res.end(req.method === 'HEAD' ? undefined : vCard);
  };

  return {
    name: 'contact-vcard',
    configureServer(server) {
      server.middlewares.use(serveVCard);
    },
    configurePreviewServer(server) {
      server.middlewares.use(serveVCard);
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: vCardPath.slice(1),
        source: vCard,
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), contactVCardPlugin()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
});
