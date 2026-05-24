import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProperties } from './useProperties';
import { propertyService, PropertyServiceError } from '../services/propertyService';
import type { PropertyData } from '../types/property';

// Mock the propertyService module
vi.mock('../services/propertyService', () => ({
  propertyService: {
    getAll: vi.fn(),
    create: vi.fn(),
  },
  PropertyServiceError: class extends Error {
    constructor(message: string, public code: string) {
      super(message);
      this.name = 'PropertyServiceError';
    }
  }
}));

describe('useProperties', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockProperties = [
    { id: '1', type: 'Maison', estimatedValue: 100000 },
    { id: '2', type: 'Appartement', estimatedValue: 200000 }
  ] as PropertyData[];

  it('initially has empty properties and is loading', async () => {
    let resolveGetAll: (value: PropertyData[]) => void;
    (propertyService.getAll as any).mockImplementation(() => new Promise((resolve) => {
      resolveGetAll = resolve;
    }));

    const { result } = renderHook(() => useProperties());
    
    expect(result.current.isLoading).toBe(true);
    expect(result.current.properties).toEqual([]);

    await act(async () => {
      resolveGetAll!(mockProperties);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.properties).toEqual(mockProperties);
    expect(result.current.error).toBeNull();
  });

  it('handles error when getAll fails with PropertyServiceError', async () => {
    const error = new PropertyServiceError('Disconnected', 'API_DISCONNECTED');
    (propertyService.getAll as any).mockRejectedValue(error);

    const { result } = renderHook(() => useProperties());

    await vi.waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toEqual(error);
    expect(result.current.properties).toEqual([]); // fallback to empty array
  });

  it('can create a property', async () => {
    (propertyService.getAll as any).mockResolvedValue(mockProperties);
    
    const { result } = renderHook(() => useProperties());
    
    await vi.waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const newProperty = { id: '3', type: 'Terrain' } as PropertyData;
    (propertyService.create as any).mockResolvedValue(newProperty);

    await act(async () => {
      await result.current.createProperty({ type: 'Terrain' });
    });

    expect(propertyService.create).toHaveBeenCalledWith({ type: 'Terrain' });
    expect(result.current.properties).toEqual([newProperty, ...mockProperties]);
  });
});
