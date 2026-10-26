# Card

Contenedor de vidrio ("Shield Container") para módulos, puestos y paneles de datos.

- **Props:** `elevation` (`'card'` por defecto, `1`, `2`, `3`), `accent` (línea superior de 2px en `gradient-accent-line`, eco del contorno del escudo), `children`.
- `'card'`: `glass-card`, `blur-1`, borde `line-card`. `1`: placa sutil (`glass-1`, `line-glass`, `elevation-1`). `2`: módulo activo/flotante (`glass-2`, `blur-2`, borde `line-cyan`, `elevation-2`). `3`: modal (`surface-raised`, `line-modal`, `elevation-3`).
- Radio `radius-lg`, padding `space-lg`. Los elementos internos usan radios menores para mantener la concentricidad.
- Colócala sobre `bg` con `gradient-atmosphere` (claro) o `gradient-atmosphere-dark` (oscuro); el vidrio pierde sentido sobre un color plano.
