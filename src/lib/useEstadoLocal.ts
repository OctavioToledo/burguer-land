import { useEffect, useState } from 'react'
import { negocio } from '../data/business'
import { estadoLocal, type EstadoLocal } from './horarios'

const calcular = () => estadoLocal(negocio.horarios, new Date(), negocio.zonaHoraria)

/** "Abierto / Cerrado" según los horarios del negocio, actualizado cada minuto y al volver a la pestaña. */
export function useEstadoLocal(): EstadoLocal {
  const [estado, setEstado] = useState(calcular)

  useEffect(() => {
    const actualizar = () => setEstado(calcular())
    const intervalo = window.setInterval(actualizar, 60_000)
    document.addEventListener('visibilitychange', actualizar)
    return () => {
      window.clearInterval(intervalo)
      document.removeEventListener('visibilitychange', actualizar)
    }
  }, [])

  return estado
}
