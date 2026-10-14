import { randomInt } from 'crypto';

/** 6 xonali artikul. used berilsa, undagilardan farqli bo'ladi va used ga qo'shiladi */
export function generateArtikul(used?: Set<string>): string {
  let code: string;
  do code = `#UZKO${randomInt(10000, 100000)}`;
  while (used?.has(code));
  used?.add(code);
  return code;
}
