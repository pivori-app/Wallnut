import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

export function formatRole(role: string): string {
  if (!role) return 'Utilisateur';
  return role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}
