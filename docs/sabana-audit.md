# Auditoría Sabana v2 — Camellio MVP

> Fase 0. Solo lectura. Sin modificaciones al código.

---

## 1. Archivos clave del sistema

### Root & Config
| Archivo | Rol |
|---|---|
| `src/app/layout.tsx` | Root layout. Font: Plus Jakarta Sans → reemplazar por Mona Sans + Cardo + JetBrains Mono |
| `src/app/globals.css` | Estilos globales. Tipografía, animaciones, helpers |
| `tailwind.config.ts` | Tokens de diseño. Paleta completa → reemplazar |
| `src/lib/utils.ts` | cn() helper — conservar |
| `src/lib/nav.ts` | Config de nav links y bottom nav items |
| `src/lib/format.ts` | Helpers de formato |
| `src/context/Providers.tsx` | Wrapper AuthProvider → JobProvider → ChatProvider |

### Contexts (conservar lógica, no tocar)
| Archivo | Estado |
|---|---|
| `src/context/AuthContext.tsx` | user, isWorker, isEmployer, login, logout. localStorage: `camellio_auth` |
| `src/context/JobContext.tsx` | jobs, offers, reviews + mutations. localStorage: `camellio_jobs/offers/reviews` |
| `src/context/ChatContext.tsx` | chats, messages + mutations. localStorage: `camellio_chats/messages` |
| `src/context/index.ts` | Re-exports |

### Layout Components
| Archivo | Variantes actuales | Rol |
|---|---|---|
| `src/components/layout/Navbar.tsx` | 1 sola variante (sticky, blur) | Header desktop + hamburger mobile |
| `src/components/layout/BottomNav.tsx` | 3 configs (guest/worker/employer), 4 ítems | Nav mobile bottom |
| `src/components/layout/PageShell.tsx` | max-width wrapper (sm/md/lg/xl/full) | Container general |

### UI Components (`src/components/ui/`)
| Archivo | Variantes actuales |
|---|---|
| `Avatar.tsx` | sm/md/lg/xl; fallback bg-primary |
| `Badge.tsx` | default/success/warning/danger/neutral/dark + dot |
| `Button.tsx` | primary/secondary/outline/ghost/danger/accent; sm/md/lg/xl/icon/icon-sm |
| `Card.tsx` | default/elevated/flat; padding none/sm/md/lg; hoverable |
| `EmptyState.tsx` | card/inline; icon + title + description + action |
| `Modal.tsx` | Framer Motion portal; max-w-md |
| `Skeleton.tsx` | animate-pulse; 10+ variantes pre-construidas |
| `StarRating.tsx` | StarDisplay (read-only) + StarPicker (interactivo) |

### Feature Components
| Archivo | Descripción |
|---|---|
| `features/chat/ConversationList.tsx` | Lista de chats |
| `features/chat/ChatWindow.tsx` | Ventana de chat |
| `features/chat/MessageBubble.tsx` | Burbuja de mensaje |
| `features/jobs/JobCard.tsx` | Card de trabajo/solicitud |
| `features/jobs/ApplyModal.tsx` | Modal para postularse |
| `features/profile/WorkerProfileView.tsx` | Perfil trabajador |
| `features/profile/EmployerProfileView.tsx` | Perfil empleador |
| `features/reviews/ReviewCard.tsx` | Card de reseña |
| `features/reviews/ReviewModal.tsx` | Modal para reseñar |
| `features/reviews/ReviewSummary.tsx` | Resumen de rating |
| `landing/LandingPage.tsx` | Componente landing (redundante con app/landing/page.tsx) |

### Data Files (`src/data/`)
| Archivo | Contenido |
|---|---|
| `categories.ts` | 8 categorías con emoji en campo `icon` |
| `users.ts` | Mock users (workers + employers) |
| `jobs.ts` | Mock solicitudes de trabajo |
| `offers.ts` | Mock propuestas/ofertas |
| `reviews.ts` | Mock reseñas |
| `chats.ts` | Mock conversaciones |
| `messages.ts` | Mock mensajes |
| `landingContent.ts` | Copy landing para rol empleado/empleador |
| `index.ts` | Re-exports |

### Types (`src/types/`)
`common.ts · user.ts · job.ts · offer.ts · review.ts · chat.ts · index.ts`
Estructura limpia. No requieren cambios salvo si se añaden campos nuevos.

---

## 2. Inventario de colores hardcodeados

### tailwind.config.ts — Paleta actual (completa a reemplazar)
```
primary:        #2563EB   → reemplazar con ink (#1E2A3A)
primary-dark:   #1E3A5F   → eliminar
primary-light:  #EFF6FF   → eliminar
primary-mid:    #DBEAFE   → eliminar
accent:         #F59E0B   → reemplazar con marigold-500 (#F3B033)
accent-light:   #FEF3C7   → eliminar
background:     #F9FAFB   → reemplazar con paper (#F7F2E6)
surface:        #FFFFFF   → reemplazar con card (#FBF8EF)
text-primary:   #111827   → reemplazar con ink (#1E2A3A)
text-secondary: #6B7280   → reemplazar con stone-500 (#6E6A5E)
border:         #E5E7EB   → reemplazar con stone-200 (#D6CFBC)
success:        #10B981   → reemplazar con forest-500 (#3D7A4B)
danger:         #EF4444   → conservar como amber-500 (#B26B1A) o rojo error
```

### Clases Tailwind hardcodeadas en páginas/componentes (no tokens)

| Archivo | Línea aprox | Clase problemática |
|---|---|---|
| `app/landing/page.tsx` | 39, 67 | `text-blue-600`, `bg-blue-600`, `hover:bg-blue-700` |
| `app/landing/page.tsx` | 95 | `from-blue-50 via-indigo-50 to-slate-50` (gradiente stock) |
| `app/landing/page.tsx` | 98, 105 | `bg-blue-100 text-blue-700`, `from-blue-600 to-indigo-500` |
| `app/landing/page.tsx` | 123, 211 | `border-blue-400`, `from-blue-600 to-indigo-600` |
| `app/page.tsx` | 78, 98 | `from-blue-500 to-indigo-500`, `from-indigo-600 to-blue-700` |
| `app/registro/page.tsx` | 176 | `from-primary-light via-primary-mid to-background` |
| `components/ui/Button.tsx` | 13 | `focus-visible:ring-primary` |
| `components/ui/Button.tsx` | 17 | `hover:bg-blue-700` (hardcoded, no token) |
| `components/ui/Avatar.tsx` | 30 | `bg-primary text-white` (sin hash determinístico) |
| `components/layout/Navbar.tsx` | 39 | `text-primary` (logo) |
| `components/layout/Navbar.tsx` | 53, 55 | `text-primary` / `text-text-secondary` |
| `components/layout/BottomNav.tsx` | 38 | `text-primary` active state |
| `components/ui/StarRating.tsx` | 37, 97 | `fill-accent text-accent` |

**Gradientes stock a eliminar** (regla anti-IA #5):
- `from-blue-50 via-indigo-50 to-slate-50`
- `from-blue-500 to-indigo-500`
- `from-blue-600 to-indigo-500`
- `from-indigo-600 to-blue-700`
- `from-blue-600 to-indigo-600`
- `from-primary-light via-primary-mid to-background`

---

## 3. Strings con "maestro" / "Maestro"

**Resultado: 0 hits** en todo el código fuente.

La insignia "Maestro Camellio" no existe aún. Hay que crearla como `VerificationBadge` nivel 3 (ink + marigold). No hay nada que renombrar.

---

## 4. Clasificación de componentes: profundidad de refactor

### Solo estilo (swap de tokens + ajuste menor)
| Componente | Cambios necesarios |
|---|---|
| `Badge.tsx` | Nuevas variantes: neutral/azulejo/marigold/forest/amber/ink/outline. Colores token. |
| `Card.tsx` | bg `card` (#FBF8EF), border `stone-200`, radius 16–18px. |
| `Modal.tsx` | bg `card`, backdrop ink/50. Conservar Framer Motion. |
| `StarRating.tsx` | `fill-accent` → `fill-marigold-500`. |
| `Skeleton.tsx` | Colores stone-100→stone-200. Timing 1.6s ease-in-out. |

### Refactor moderado (lógica conservada, estructura modificada)
| Componente | Cambios necesarios |
|---|---|
| `Button.tsx` | Nuevas variantes: `azulejo` (text white), `marigold` (text ink), `soft`, `ghost`. Eliminar `accent` con text-white. Focus ring → ink. |
| `Avatar.tsx` | Fallback determinístico por hash-name (6 pares cálidos del sistema). Nuevo tamaño 24px. Ring opcionales. |
| `EmptyState.tsx` | Añadir `<Mosaico>` en corner. No aceptar emoji en prop icon. Estructura editorial (eyebrow + título + body 1 línea + CTA específico). |
| `PageShell.tsx` | Padding ajustado. Probablemente conservar. |
| `features/jobs/JobCard.tsx` | Refactor completo visual. Tarifa + disponibilidad + distancia. |
| `features/chat/MessageBubble.tsx` | Bordes asimétricos. Ink (yo) / card (ellos). |

### Refactor profundo (reconstruir)
| Componente | Por qué |
|---|---|
| `Navbar.tsx` → `Header.tsx + MobileHeader.tsx` | 3 variantes (transparente/scrolled/dashboard). Altura 68/56px. Nav diferente. Blur on scroll. |
| `BottomNav.tsx` | 5 ítems exactos fijos. FAB central 54×54px elevado. role="tablist" + aria-current. |
| `landing/LandingPage.tsx` | Rediseño editorial completo. Hero izquierda, grid asimétrico, mosaico. |
| `features/profile/WorkerProfileView.tsx` | Hero ink con avatar ring paper. 3 stats grandes. CTA dual. |
| `features/chat/ChatWindow.tsx` | Banner solicitud fijo. Composer bottom. ProposalCard inline. |

### Nuevo (no existe, crear)
| Componente nuevo | Fase |
|---|---|
| `src/components/brand/BrandMark.tsx` | 2 |
| `src/components/brand/Wordmark.tsx` | 2 |
| `src/components/brand/Logo.tsx` | 2 |
| `src/components/brand/Mosaico.tsx` | 2 |
| `src/components/layout/Footer.tsx` | 2 |
| `src/components/layout/MobileFooter.tsx` | 2 |
| `src/components/layout/AuthLayout.tsx` | 4 |
| `src/components/ui/Input.tsx` | 3 |
| `src/components/ui/Stars.tsx` | 3 |
| `src/components/ui/Chip.tsx` | 3 |
| `src/components/ui/VerificationBadge.tsx` | 3 |
| `src/components/ui/SkeletonCard.tsx` | 3 |
| `src/components/ui/CategoryIcon.tsx` | 3 |
| `src/components/features/auth/LoginForm.tsx` | 4 |
| `src/components/features/auth/AccountTypeSelector.tsx` | 4 |
| `src/components/features/auth/ClientOnboarding.tsx` | 4 |
| `src/components/features/auth/WorkerOnboarding.tsx` | 4 |
| `src/components/features/auth/ScreenWelcome.tsx` | 4 |
| `src/data/copy.ts` | 3 |
| `docs/sabana.md` | 1 |

---

## 5. Rutas existentes y rutas a crear

### Rutas existentes
| Ruta | Archivo | Estado Sabana |
|---|---|---|
| `/` | `app/page.tsx` | Rediseño completo (Fase 5) |
| `/landing` | `app/landing/page.tsx` | Rediseño completo (Fase 5) |
| `/landing/empleado` | `app/landing/empleado/page.tsx` | Probable eliminación — fusionar con `/landing` |
| `/landing/empleador` | `app/landing/empleador/page.tsx` | Probable eliminación — fusionar con `/landing` |
| `/login` | `app/login/page.tsx` | Refactor con LoginForm (Fase 4) |
| `/registro` | `app/registro/page.tsx` | Convertir en AccountTypeSelector (Fase 4) |
| `/explorar` | `app/explorar/page.tsx` | Refactor con chips + mapa-sliver (Fase 6) |
| `/publicar` | `app/publicar/page.tsx` | Wizard 3 pasos (Fase 7) |
| `/perfil/[id]` | `app/perfil/[id]/page.tsx` | Refactor profundo hero ink (Fase 6) |
| `/trabajos/[id]` | `app/trabajos/[id]/page.tsx` | Refactor visual (Fase 7) |
| `/employer` | `app/employer/page.tsx` | Obsoleta — reemplazar por `/registro` |
| `/worker` | `app/worker/page.tsx` | Obsoleta — reemplazar por `/registro` |
| `/mensajes` | `app/mensajes/page.tsx` | Refactor visual (Fase 9) |
| `/mensajes/[chatId]` | `app/mensajes/[chatId]/page.tsx` | Refactor profundo (Fase 9) |
| `/dashboard/worker` | `app/dashboard/worker/page.tsx` | Rediseño completo (Fase 8) |
| `/dashboard/worker/applications` | `app/dashboard/worker/applications/page.tsx` | Refactor visual (Fase 8) |
| `/dashboard/employer` | `app/dashboard/employer/page.tsx` | Rediseño completo (Fase 8) |
| `/dashboard/employer/applicants` | `app/dashboard/employer/applicants/page.tsx` | Refactor visual (Fase 8) |

### Rutas a crear
| Ruta | Archivo nuevo | Fase |
|---|---|---|
| `/registro/cliente` | `app/registro/cliente/page.tsx` | 4 |
| `/registro/trabajador` | `app/registro/trabajador/page.tsx` | 4 |
| `/bienvenido` | `app/bienvenido/page.tsx` | 4 |

---

## 6. Dependencias actuales

```
next: 15.1.0
react: 18.3.1
clsx: 2.1.1
tailwind-merge: 2.5.4
class-variance-authority: 0.7.1
lucide-react: 0.468.0
framer-motion: 11.15.0  ← conservar (Modal lo usa)
```

**A añadir según spec:**
- `geist` (npm) — Fase 1 (solo si Mona Sans no cubre el caso; spec menciona Geist 700 para Wordmark)

**Sin cambios:** clsx, tailwind-merge, CVA, lucide, framer-motion ya están y se conservan.

---

## 7. Alertas críticas para las fases

1. **Gradientes stock** — 6 instancias en landing y home. Eliminar en Fase 5.
2. **Avatar sin hash** — `bg-primary` para todos los fallbacks. Corregir en Fase 3 (Avatar refactor).
3. **EmptyState con emoji** — La prop acepta `LucideIcon`, no emoji, pero el diseño sigue siendo genérico. Refactor en Fase 3.
4. **BottomNav** — Estructura actual no soporta FAB elevado. Reconstruir en Fase 2.
5. **Font variable** — `--font-plus-jakarta` en layout.tsx. Reemplazar en Fase 1.
6. **nav.ts** — Items actuales no coinciden con los 5 items exactos spec (Inicio · Solicitudes · + · Mensajes · Yo). Actualizar en Fase 2.
7. **`categories.ts` emojis** — 8 emojis en campo `icon`. Eliminar en Fase 3 con CategoryIcon.tsx.
8. **`landing/LandingPage.tsx`** — Componente redundante con `app/landing/page.tsx`. Consolidar en Fase 5.
9. **Rutas `/employer` y `/worker`** — Parecen obsoletas o redundantes con `/registro`. Confirmar antes de Fase 4.
10. **`framer-motion`** — Usado en Modal.tsx. Conservar pero no expandir su uso.

---

_Generado en Fase 0. Sin modificaciones al código._
