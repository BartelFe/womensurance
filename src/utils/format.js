// Deutsche Zahlenschreibweise: Komma statt Punkt (39,4 % — nicht 39.4 %).
export const de1 = (n) => Number(n).toFixed(1).replace('.', ',');
