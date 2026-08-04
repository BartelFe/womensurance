/**
 * Der aktuelle Rentenwert der gesetzlichen Rentenversicherung.
 *
 * Eine Rente ergibt sich aus: erworbene Entgeltpunkte × aktueller Rentenwert.
 * Der Wert wird **jedes Jahr zum 1. Juli** neu festgesetzt.
 *
 * ⚠️ Das hier ist die einzige Stelle, an der er steht. Alles andere rechnet
 * damit: der Teilzeit-Rechner auf der Unterseite und die Euro-Beträge der
 * Lebensereignisse im Kopfbereich. Beim jährlichen Nachziehen also nur diese
 * Zahl und das Datum darunter ändern.
 *
 * Stand 01.07.2026: 42,52 € (davor 40,79 €, Anhebung um 4,24 %).
 * Quelle: Deutsche Rentenversicherung, Rentenanpassung 2026.
 * Siehe auch `Kunden\Womensurance (DVM)\Zahlen und Quellen.md`.
 */
export const AKTUELLER_RENTENWERT = 42.52;

/**
 * Seit wann dieser Wert gilt, für die sichtbare Angabe unter dem Rechner.
 *
 * ⚠️ Steht bewusst direkt neben der Zahl. Vorher war das Datum an anderer
 * Stelle hartcodiert und blieb beim Wechsel auf 42,52 € auf „07/2025" stehen:
 * neuer Wert, altes Datum. Zusammen ändern oder gar nicht.
 */
export const RENTENWERT_STAND = '07/2026';

/** Für die sichtbare Angabe unter dem Rechner, z. B. „42,52 €". */
export const RENTENWERT_TEXT = AKTUELLER_RENTENWERT.toFixed(2).replace('.', ',');
