import { describe, expect, it } from 'vitest'
import { estadoLocal, textoEstado, textoTurnos } from './horarios'
import type { Horarios } from './tipos'

const ZONA = 'America/Argentina/Buenos_Aires'
// Argentina es UTC-3 todo el año: 2026-10-14 es miércoles.
const en = (fechaHora: string) => new Date(`${fechaHora}-03:00`)

const horarios: Horarios = {
  0: [{ abre: '20:00', cierra: '00:00' }],
  1: [],
  2: [{ abre: '20:00', cierra: '00:00' }],
  3: [{ abre: '20:00', cierra: '00:00' }],
  4: [{ abre: '20:00', cierra: '00:00' }],
  5: [
    { abre: '12:00', cierra: '15:00' },
    { abre: '20:00', cierra: '01:30' },
  ],
  6: [
    { abre: '12:00', cierra: '15:00' },
    { abre: '20:00', cierra: '01:30' },
  ],
}

const texto = (f: string) => textoEstado(estadoLocal(horarios, en(f), ZONA))

describe('estadoLocal', () => {
  it('abierto dentro del turno', () => {
    expect(texto('2026-10-14T21:15:00')).toBe('Abierto ahora · cierra 00:00')
  })

  it('cerrado antes de abrir el mismo día', () => {
    expect(texto('2026-10-14T18:00:00')).toBe('Cerrado · abre a las 20:00')
  })

  it('el cierre es exclusivo', () => {
    expect(texto('2026-10-15T00:00:00')).toBe('Cerrado · abre a las 20:00')
  })

  it('turno que pasa la medianoche sigue abierto de madrugada', () => {
    // Sábado 17 a la 01:00 sigue el turno del viernes.
    expect(texto('2026-10-17T01:00:00')).toBe('Abierto ahora · cierra 01:30')
  })

  it('turno del sábado que termina el domingo de madrugada (vuelta de semana)', () => {
    expect(texto('2026-10-18T01:10:00')).toBe('Abierto ahora · cierra 01:30')
  })

  it('entre turnos del mismo día', () => {
    expect(texto('2026-10-16T16:00:00')).toBe('Cerrado · abre a las 20:00')
  })

  it('abre mañana', () => {
    expect(texto('2026-10-16T23:00:00')).toBe('Abierto ahora · cierra 01:30')
    expect(texto('2026-10-14T00:30:00')).toBe('Cerrado · abre a las 20:00')
    // Domingo 18 a las 23:59 abierto; lunes 19 cerrado todo el día → abre el martes.
    expect(texto('2026-10-19T10:00:00')).toBe('Cerrado · abre mañana a las 20:00')
  })

  it('abre otro día de la semana', () => {
    const soloSabado: Horarios = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [{ abre: '12:00', cierra: '15:00' }] }
    expect(textoEstado(estadoLocal(soloSabado, en('2026-10-14T10:00:00'), ZONA))).toBe('Cerrado · abre el sábado a las 12:00')
  })

  it('usa la hora del local aunque el cliente esté en otra zona', () => {
    // 00:15 UTC del jueves = 21:15 del miércoles en Argentina.
    expect(textoEstado(estadoLocal(horarios, new Date('2026-10-15T00:15:00Z'), ZONA))).toBe('Abierto ahora · cierra 00:00')
  })

  it('sin horarios cargados', () => {
    const nunca: Horarios = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }
    expect(textoEstado(estadoLocal(nunca, en('2026-10-14T10:00:00'), ZONA))).toBe('Cerrado')
  })
})

describe('textoTurnos', () => {
  it('formatea uno, dos o ningún turno', () => {
    expect(textoTurnos(horarios[1])).toBe('Cerrado')
    expect(textoTurnos(horarios[2])).toBe('20:00 a 00:00')
    expect(textoTurnos(horarios[5])).toBe('12:00 a 15:00 y 20:00 a 01:30')
  })
})
