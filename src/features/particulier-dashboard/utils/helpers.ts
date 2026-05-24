import type { AddressData } from '../types/property';

export const eurFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

export function formatCurrency(value: number): string {
  return eurFormatter.format(value);
}

export function resolveAddress(address: string | AddressData | undefined): string {
  if (!address) return 'Adresse à préciser';
  if (typeof address === 'string') return address;
  return address.fullAddress ?? 'Adresse à préciser';
}

export function resolveCity(address: string | AddressData | undefined): string {
  if (!address || typeof address === 'string') return 'Ville inconnue';
  return address.city ?? 'Ville inconnue';
}
