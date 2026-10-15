import type { Dia, Hora, Horarios, Turno } from './tipos'

const MIN_DIA = 24 * 60
const MIN_SEMANA = 7 * MIN_DIA

export const NOMBRES_DIA = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'] as const

/** Orden de la tabla de horarios: de lunes a domingo. */
export const ORDEN_SEMANA: Dia[] = [1, 2, 3, 4, 5, 6, 0]

export function aMinutos(hora: Hora): number {
  const [h, m] = hora.split(':').map(Number)
  return h * 60 + m
}

/** Día de la semana y minutos desde la medianoche en la zona horaria del local. */
export function momentoLocal(fecha: Date, zonaHoraria: string): { dia: Dia; minutos: number } {
  const partes = new Intl.DateTimeFormat('en-US', { timeZone: zonaHoraria, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(fecha)
  const valor = (tipo: string) => partes.find((p) => p.type === tipo)?.value ?? ''
  const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(valor('weekday')) as Dia
  return { dia, minutos: Number(valor('hour')) * 60 + Number(valor('minute')) }
}

interface Intervalo {
  inicio: number
  fin: number
  turno: Turno
  dia: Dia
}

/** Turnos como intervalos en minutos desde el domingo 00:00. Un turno que cierra a una hora menor o igual a la de apertura termina al día siguiente. */
function intervalos(horarios: Horarios): Intervalo[] {
  return (Object.keys(horarios).map(Number) as Dia[]).flatMap((dia) =>
    horarios[dia].map((turno) => {
      const abre = aMinutos(turno.abre)
      const cierra = aMinutos(turno.cierra)
      const inicio = dia * MIN_DIA + abre
      return { inicio, fin: inicio + (cierra > abre ? cierra - abre : cierra + MIN_DIA - abre), turno, dia }
    }),
  )
}

export type EstadoLocal =
  | { abierto: true; cierra: Hora }
  | { abierto: false; abre: { hora: Hora; dia: Dia; hoy: boolean; manana: boolean } | null }

export function estadoLocal(horarios: Horarios, fecha: Date, zonaHoraria: string): EstadoLocal {
  const { dia, minutos } = momentoLocal(fecha, zonaHoraria)
  const ahora = dia * MIN_DIA + minutos
  const lista = intervalos(horarios)

  // También se mira la semana anterior, por el turno del sábado que termina el domingo de madrugada.
  const actual = lista.find((i) => [ahora, ahora + MIN_SEMANA].some((t) => t >= i.inicio && t < i.fin))
  if (actual) return { abierto: true, cierra: actual.turno.cierra }

  let proximo: { intervalo: Intervalo; distancia: number } | null = null
  for (const i of lista) {
    const distancia = (i.inicio - ahora + MIN_SEMANA) % MIN_SEMANA
    if (!proximo || distancia < proximo.distancia) proximo = { intervalo: i, distancia }
  }
  if (!proximo) return { abierto: false, abre: null }
  const diaAbre = proximo.intervalo.dia
  const hoy = diaAbre === dia && proximo.distancia < MIN_DIA
  return {
    abierto: false,
    abre: { hora: proximo.intervalo.turno.abre, dia: diaAbre, hoy, manana: !hoy && diaAbre === (dia + 1) % 7 },
  }
}

/** "Abierto ahora · cierra 00:30" / "Cerrado · abre a las 20:00" / "Cerrado · abre mañana a las 12:00" */
export function textoEstado(estado: EstadoLocal): string {
  if (estado.abierto) return `Abierto ahora · cierra ${estado.cierra}`
  if (!estado.abre) return 'Cerrado'
  const { hora, dia, hoy, manana } = estado.abre
  if (hoy) return `Cerrado · abre a las ${hora}`
  if (manana) return `Cerrado · abre mañana a las ${hora}`
  return `Cerrado · abre el ${NOMBRES_DIA[dia]} a las ${hora}`
}

/** "20:00 a 00:00" / "12:00 a 15:00 y 20:00 a 01:30" / "Cerrado" */
export function textoTurnos(turnos: Turno[]): string {
  if (turnos.length === 0) return 'Cerrado'
  return turnos.map((t) => `${t.abre} a ${t.cierra}`).join(' y ')
}
