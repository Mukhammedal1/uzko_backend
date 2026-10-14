import { randomInt } from 'crypto';

/** "UZKO" + 5 ta tasodifiy raqam = jami 9 belgi */
export function generateBarcode(): string {
  let digits = '';
  for (let i = 0; i < 5; i++) digits += randomInt(10);
  return 'UZKO' + '-' + digits;
}