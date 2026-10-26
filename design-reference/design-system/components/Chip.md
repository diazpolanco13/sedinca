# Chip

Chip de estado táctico en píldora para indicar la condición de un servicio, puesto o equipo.

- **Props:** `tone` (`'operational'` por defecto o `'standby'`), `live` (añade el punto indicador de 6px), `children` (una o dos palabras; se muestran en mayúsculas).
- **Operativo:** fondo `chip-operational-bg`, texto `ink-brand`, borde `chip-operational-line`; con `live`, punto `accent` pulsante.
- **En espera / neutro:** fondo `chip-standby-bg`, texto `ink-muted`, borde `chip-standby-line`; punto `ink-subtle` estático.
- Altura 26px, radio `radius-full`, tipografía `label-md`.
- El tono nunca es decorativo: siempre acompaña a una palabra que nombra el estado. El pulso se detiene con `prefers-reduced-motion`.
