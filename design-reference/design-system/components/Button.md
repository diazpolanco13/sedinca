# Button

Botón de acción en tres variantes: `primary` (degradado de acción), `secondary` (contorno) y `ghost` (texto).

- **Props:** `variant` (`'primary'` por defecto, `'secondary'`, `'ghost'`), `children` (el texto), y cualquier atributo de `<button>` (`onClick`, `disabled`, `type`).
- **Primario:** fondo `gradient-action` (el degradado del escudo sin el tramo cian, para que el texto cumpla 4.5:1 en todo el ancho), texto `on-brand` en Space Grotesk 700, brillo interior `inset-highlight`; hover añade `glow-cyan`; activo escala a 0.98. Una sola acción primaria por vista.
- **Secundario:** fondo `surface`, borde 1.5px `line`, texto `ink`; hover: borde `brand`, fondo `surface-brand`.
- **Fantasma:** transparente, texto `ink-brand`; hover `ghost-hover`. Para acciones terciarias y cancelar.
- Altura 44px, radio `radius`, foco de teclado: contorno 2px `focus-ring`.
- Etiquetas con verbo en infinitivo ("Registrar novedad"), sin signos de exclamación.
