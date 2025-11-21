export const BaseUrl: string = "https://data.etabus.gov.hk/";

export function removeBracketed(text: string): string {
  return text.replace(/\([^)]*\)/g, '').trim();
}