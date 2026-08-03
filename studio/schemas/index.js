import { satzteil, bild, absatz } from './objects';
import lebensphase from './lebensphase';
import stimme from './stimme';
import methodenschritt from './methodenschritt';
import kennzahl from './kennzahl';
import juliaSektion from './juliaSektion';
import startseite from './startseite';
import themenseite from './themenseite';

export const schemaTypes = [
  // Bausteine
  satzteil,
  bild,
  absatz,
  // Einzelseiten
  startseite,
  juliaSektion,
  themenseite,
  // Listen
  lebensphase,
  stimme,
  methodenschritt,
  kennzahl,
];
