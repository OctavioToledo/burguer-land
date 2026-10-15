/** localStorage con try/catch: en modo privado o con el almacenamiento bloqueado, el sitio sigue andando en memoria. */
export function leer(clave: string): unknown {
  try {
    const crudo = localStorage.getItem(clave)
    return crudo ? JSON.parse(crudo) : null
  } catch {
    return null
  }
}

export function guardar(clave: string, valor: unknown): void {
  try {
    localStorage.setItem(clave, JSON.stringify(valor))
  } catch {
    // Sin almacenamiento disponible: no hay nada que hacer.
  }
}
