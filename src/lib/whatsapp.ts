import { negocio } from '../data/business'

export function linkWhatsApp(texto: string, numero = negocio.whatsapp): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`
}
