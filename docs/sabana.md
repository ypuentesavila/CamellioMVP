# Camellio Sabana — Design System Reference

> Referencia canónica. Prevalece sobre cualquier decisión ad-hoc.

---

## Tagline oficial

**"Trabajadores locales para lo que necesitas <span class="serif">resolver</span>."**

- "resolver" siempre en `.serif` (Cardo italic) color `marigold-400` o `azulejo-400` según fondo.
- Palabras editoriales permitidas en `.serif`: resolver · cerca · vuelta · correcto · oficio.
- Máximo 1–3 palabras `.serif` por pantalla.

---

## Paleta Sabana

### Bases

| Token | Valor | Uso |
|---|---|---|
| `paper` | `#F7F2E6` | Fondo de app |
| `paper-2` | `#ECE0C5` | Fondo secundario, texturas |
| `card` | `#FBF8EF` | Fondo de cards y superficies |
| `ink` | `#1E2A3A` | Texto principal, CTA primario |

### Stone (neutrales cálidos)

| Token | Valor | Uso |
|---|---|---|
| `stone-100` | `#E5DFCD` | Fondo hover suave |
| `stone-200` | `#D6CFBC` | Borders |
| `stone-300` | `#B5B0A0` | Iconos inactivos |
| `stone-400` | `#928E80` | Dots, decorativos |
| `stone-500` | `#6E6A5E` | Texto secundario |
| `stone-600` | `#4A5160` | Texto terciario, labels |

### Azulejo (azul institucional)

| Token | Valor | Uso |
|---|---|---|
| `azulejo-100` | `#D6E2F2` | Chips activos, hover bg |
| `azulejo-200` | `#B6CCE8` | Bordes azulejo |
| `azulejo-300` | `#6E95D2` | Links, estado intermedio |
| `azulejo-400` | `#3C6EBF` | Iconos, decorativos |
| `azulejo-500` | `#234478` | FAB, botón azulejo, fill principal |
| `azulejo-600` | `#1B3358` | Hover de azulejo-500 |

### Marigold (ámbar de firma)

| Token | Valor | Uso |
|---|---|---|
| `marigold-100` | `#FAE5B8` | Chips urgencia, bg AI hint |
| `marigold-200` | `#F6C56A` | Decorativo |
| `marigold-300` | `#F3B033` | Botón marigold, estrellas |
| `marigold-400` | `#B07816` | Hover marigold, texto .serif editorial |
| `marigold-500` | `#7E5210` | Insignia Maestro Camellio, firma |

### Forest (disponibilidad y confianza)

| Token | Valor | Uso |
|---|---|---|
| `forest-100` | `#D8E6D5` | Badge "disponible" bg |
| `forest-500` | `#3D7A4B` | Texto "disponible", indicadores |
| `forest-600` | `#2E5E3A` | Hover forest |

### Amber (advertencias)

| Token | Valor | Uso |
|---|---|---|
| `amber-100` | `#F2D7A3` | Bg advertencia |
| `amber-500` | `#B26B1A` | Texto advertencia |

---

## Reglas críticas de color

1. **`marigold` SIEMPRE con texto `ink`. JAMÁS blanco sobre marigold.**
2. **`azulejo-500` puede llevar texto blanco.**
3. **`ink` es el CTA primario por defecto.** `marigold` se reserva para firma / premium / urgencia.
4. **`forest` = disponibilidad y confianza. NUNCA CTA principal.**
5. **Cero gradientes de stock.** Color sólido o textura mosaico. Si hay gradient debe ser direccional e intencional.
6. **Sombras racionadas.** Solo FAB azulejo y modales llevan `shadow-fab` / `shadow-modal`. El resto: `border stone-200`.

---

## Tipografía

| Variable | Fuente | Pesos | Uso |
|---|---|---|---|
| `--font-sans` | Mona Sans | 400/500/600/700 | Texto general |
| `--font-serif` | Cardo italic | 400 | Palabras editoriales (clase `.serif`) |
| `--font-mono` | JetBrains Mono | 400/500 | Precios, códigos (clase `.mono .tnum`) |

### Escala tipográfica

| Clase | Tamaño | Peso | Uso |
|---|---|---|---|
| `.text-display` | 4xl→6xl | Bold | Heroes editoriales |
| `.text-h1` | 3xl→4xl | Bold | Titulares de sección |
| `.text-h2` | 2xl | Bold | Subsección |
| `.text-h3` | xl | Bold | Cards importantes |
| `.text-h4` | lg | Semibold | Títulos de componente |
| `.eyebrow` | 11px | Semibold uppercase | Antes de H1 importantes |

---

## Componentes UI

### Button — variantes

| Variante | BG | Texto | Uso |
|---|---|---|---|
| `primary` | `ink` | `paper` | CTA principal |
| `azulejo` | `azulejo-500` | white | Acción institucional |
| `marigold` | `marigold-300` | `ink` | Firma / urgencia |
| `outline` | transparente | `ink` | Acción secundaria |
| `soft` | `stone-100` | `ink` | Acción suave |
| `ghost` | transparente | `stone-500` | Mínima jerarquía |

### Badge — variantes

`neutral` · `azulejo` · `marigold` · `forest` · `amber` · `ink` · `outline`

### Avatar — tamaños

`xs` (24px) · `sm` (32px) · `md` (40px) · `lg` (56px) · `xl` (72px)

Fallback: 6 pares determinísticos por hash del nombre. Sin `bg-primary` uniforme.

---

## Vocabulario

| Usar | No usar |
|---|---|
| trabajador · trabajadores | maestro / maestros (excepto insignia) |
| cliente | usuario / empleador (en UI pública) |
| solicitud | oferta / anuncio |
| propuesta | aplicación / postulación (como sustantivo) |
| postularme | aplicar |
| invitar a este trabajador | contactar |
| trabajador verificado | técnico verificado |
| Maestro Camellio | (solo como insignia nivel 3) |
| disponible hoy | disponible ahora |
| propuestas recibidas | aplicaciones recibidas |

**Tono:** profesional, local, cercano. Bogotá sin folclor. Vecino bueno en lo suyo, no app de marketplace.

**No usar:** emojis decorativos · diminutivos · lenguaje infantil · "maestro" genérico.

---

## Reglas anti-IA

1. **Asimetría intencional.** Heroes alineados a la izquierda, no centrados. `padding-top` mayor a `padding-bottom`.
2. **Jerarquía en card hero.** Primera card de lista ≠ resto (tag "Mejor match", etc.).
3. **Number-first design.** Stats 22–32px con label uppercase abajo. Nunca número + label en línea como pill.
4. **CTAs con objeto.** "Postularme · $80k" no "Postularme".
5. **Cero gradientes de stock.** Ver arriba.
6. **Sombras racionadas.** Ver arriba.
7. **Cardo italic racionado.** Máximo 1–3 palabras por pantalla.
8. **Empty states sin "Oops".** Mosaico en corner + título editorial + body 1 línea + CTA específico.
9. **Avatars determinísticos.** 6 pares cálidos del sistema (hashIdx).
10. **Eyebrow uppercase 11px** antes de cada H1 importante.
11. **Curvas con personalidad.** `cubic-bezier(.2,.7,.3,1)` default · spring para bounce · linear para progress.
12. **Mosaico Sabana en corner.** Hero, empty state, welcome, 404.

---

## Animaciones

| Variable CSS | Valor |
|---|---|
| `--ease-sabana` | `cubic-bezier(.2,.7,.3,1)` |
| `--ease-spring` | `cubic-bezier(.34,1.56,.64,1)` |

| Interacción | Comportamiento |
|---|---|
| Postularme | fill ink desde izquierda 240ms |
| Propuesta aceptada | `.pulse-marigold-once` 600ms único ciclo |
| FAB tap | bounce scale 1→1.08→1 en 180ms spring |
| Rating hover | stagger 40ms por estrella |
| Skeleton | `.shimmer` 1.6s ease-in-out |
| Online indicator | `.softpulse` 2s |

---

## Firma visual — Mosaico Sabana

Componente `<Mosaico size density palette />`.

- Densidades: `sparse` · `med` · `dense`
- Tiles: rectángulos offset alternando `ink` + `azulejo-500` + `marigold-300` redondeados
- Usar en: hero corners, empty states, verification cards, welcome screen, 404
- NUNCA en cards de listado

---

*docs/sabana.md — referencia canónica Sabana v2*
