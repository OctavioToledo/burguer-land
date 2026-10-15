const numero = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 })

/** 14500 → "$14.500" */
export function precio(valor: number): string {
  return `$${numero.format(valor)}`
}

/** 1200 → "+$1.200"; 0 → "" */
export function adicional(valor: number): string {
  return valor > 0 ? `+${precio(valor)}` : ''
}

/** plural(1, 'item') → "1 item"; plural(3, 'item') → "3 items" */
export function plural(n: number, singular: string, pluralTexto = `${singular}s`): string {
  return `${n} ${n === 1 ? singular : pluralTexto}`
}
