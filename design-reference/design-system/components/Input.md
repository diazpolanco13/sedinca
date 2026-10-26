# Input

Campo de texto de una línea.

- **Props:** cualquier atributo de `<input>` (`value`, `onChange`, `placeholder`, `type`, `aria-invalid`). La etiqueta la pone el consumidor: un `<label>` con la clase `sd-field-label` (estilo `label-md` en mayúsculas, `ink-muted`).
- Altura 44px, fondo `surface`, borde 1px `line-strong` (≥3:1), radio `radius`, texto `body-md` en `ink`; placeholder `ink-subtle`.
- Foco: borde `brand` y halo de 3px `focus-halo`.
- Error: `aria-invalid="true"` pinta el borde `ink-danger`; añade el mensaje debajo en `body-sm` con color `ink-danger`.
