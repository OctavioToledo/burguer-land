import { textoEstado } from '../lib/horarios'
import { useEstadoLocal } from '../lib/useEstadoLocal'

export function EstadoLocal({ className = '' }: { className?: string }) {
  const estado = useEstadoLocal()
  return (
    <p className={`estado ${estado.abierto ? 'estado--abierto' : ''} ${className}`}>
      <span className="estado__punto" aria-hidden />
      {textoEstado(estado)}
    </p>
  )
}
