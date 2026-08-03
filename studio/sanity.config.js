import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';
import { structure, dokumentAktionen, NEUE_DOKUMENTE_AUSBLENDEN } from './structure';

/**
 * Redaktionsoberflaeche fuer womensurance.de.
 *
 * Projekt "DVM - womensurance" (10o1bkel), Dataset `production`, Content Lake
 * in Belgien. Deployment auf eine eigene Adresse (`sanity deploy`), bewusst
 * nicht eingebettet in womensurance.de: der Redaktionsbereich bleibt damit
 * sauber vom Besucherbereich getrennt, so wie es die Datenschutzerklaerung
 * beschreibt.
 */
export default defineConfig({
  name: 'default',
  title: 'Womensurance',

  projectId: '10o1bkel',
  dataset: 'production',

  plugins: [
    structureTool({ title: 'Inhalte', structure }),
    // Vision ist die Abfrage-Konsole fuer Entwickler. Fuer die Redaktion ist
    // sie nur Ballast, deshalb erscheint sie ausschliesslich lokal.
    ...(process.env.NODE_ENV === 'development' ? [visionTool({ defaultApiVersion: '2024-10-01' })] : []),
  ],

  schema: {
    types: schemaTypes,
    // Bausteine und Einzelstuecke tauchen nicht im "Neu erstellen"-Menue auf.
    templates: (vorlagen) =>
      vorlagen.filter((v) => !NEUE_DOKUMENTE_AUSBLENDEN.includes(v.schemaType)),
  },

  document: {
    actions: dokumentAktionen,
  },
});
