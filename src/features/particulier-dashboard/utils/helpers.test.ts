import { describe, it, expect } from 'vitest';
import { formatCurrency, resolveAddress, resolveCity } from './helpers';
import type { AddressData } from '../types/property';

describe('helpers', () => {
  describe('formatCurrency', () => {
    it('formats a number to EUR', () => {
      const result = formatCurrency(1000);
      expect(result).toMatch(/1.*000.*€/);
    });
  });

  describe('resolveAddress', () => {
    it('returns default string when address is undefined', () => {
      expect(resolveAddress(undefined)).toBe('Adresse à préciser');
    });

    it('returns the string when address is a string', () => {
      expect(resolveAddress('123 rue de la Paix')).toBe('123 rue de la Paix');
    });

    it('returns fullAddress when address is an AddressData object', () => {
      const address: AddressData = { fullAddress: '123 rue test', city: 'Paris' };
      expect(resolveAddress(address)).toBe('123 rue test');
    });
  });

  describe('resolveCity', () => {
    it('returns default string when address is undefined', () => {
      expect(resolveCity(undefined)).toBe('Ville inconnue');
    });

    it('returns default string when address is a string', () => {
      expect(resolveCity('123 rue de la Paix')).toBe('Ville inconnue');
    });

    it('returns city when address is an AddressData object', () => {
      const address: AddressData = { fullAddress: '123 rue test', city: 'Paris' };
      expect(resolveCity(address)).toBe('Paris');
    });
  });
});
