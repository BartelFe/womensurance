import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: '10o1bkel',
    dataset: 'production',
  },
  // Adresse der veroeffentlichten Redaktionsoberflaeche.
  studioHost: 'womensurance',
});
