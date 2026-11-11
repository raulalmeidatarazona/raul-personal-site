# Seguimiento de mejoras UX

Alcance aprobado: mejorar la experiencia existente sin rediseñar la identidad, inventar resultados ni publicar en producción. Implementación y verificación una a una. El preview ngrok sirve únicamente `dist/`.

Estado inicial: los artículos importados y otras modificaciones ya estaban sin commit; se preservan. No se hacen push, cambios de dominio ni migración de Substack en esta fase.

## Lista de ejecución

- [x] UX-01 — Navegación móvil completa y persistente.
  - Work, Notes, Videos, Talks, About y Contact disponibles en cualquier ancho.
  - Menú operable con teclado, Escape y foco recuperable; no ocultar artículos.
  - Cabecera accesible al desplazarse y anclas sin quedar tapadas.
- [x] UX-02 — Portada más breve, con acceso a las bibliotecas completas.
  - Un Short y una charla destacados, sin eliminar contenido existente.
  - Catálogo de charlas con las tres grabaciones, incluido inicio del Festival en 1:41:44.
  - Presentación breve cerca del inicio; biografía ampliada conservada.
- [x] UX-03 — Mensaje inicial concreto.
  - Mantener el titular; explicar integraciones frágiles, datos inconsistentes y modernización sin reescrituras innecesarias.
  - Sin experiencia, métricas ni resultados inventados.
- [x] UX-04 — Decisiones y límites de proyectos visibles.
  - Una decisión y una limitación visibles por proyecto sin abrir desplegables.
  - Etiquetas de ampliación específicas; conservar la distinción de pruebas técnicas.
- [x] UX-05 — Lectura técnica navegable.
  - Índice plegable, anclas de encabezados únicas, tiempo estimado y copia de código.
  - Respetar idioma, fechas, cuerpos originales, imágenes, código y navegación de la serie.
  - Copia con estado accesible, manejo de error y alternativa manual.
- [x] UX-06 — Contacto sin depender de un cliente de correo.
  - Correo visible y botón de copia con confirmación/error accesibles.
  - Explicar qué enviar, sin formularios ni calendarios nuevos.
- [x] UX-07 — Señales de interacción y ruido repetido.
  - Flechas de enlaces internos distintas de enlaces externos.
  - Aviso de carga externa una vez por sección/biblioteca, no por reproductor.
  - Retirar el aviso técnico decorativo de portada; conservar procedencia de artículos, canonical y noindex hasta aprobar migración.

- [x] UX-08 — TypeScript visible en el posicionamiento.
  - Añadido al resumen inicial, las etiquetas del proyecto CARMA y la biografía.
  - Prueba específica observada fallar antes del cambio; build y 12/12 pruebas pasan después.
  - Preview comprobado a 320 px sin desbordamiento. No se ha anunciado públicamente la contratación en CARMA ni modificado GitHub.

## Registro de verificación

Cada mejora se implementó después de observar su prueba fallar y se marcó al superar la comprobación correspondiente. Las pruebas de HTML construido se complementaron con revisión interactiva en Chrome.

- **UX-01:** menú nativo, seis destinos visibles con objetivos de al menos 44 px a 390 px; Escape cierra y recupera foco. Cabecera sticky. Ancla Notes comprobada: inicio a 120 px, por debajo de una cabecera de 85 px.
- **UX-02:** portada con un Short y una charla; `/videos/` conserva seis Shorts y `/talks/` las tres grabaciones. Festival conserva `start=6104`. Biografía breve junto al inicio y ampliada al final.
- **UX-03:** prueba de HTML confirma los problemas concretos en el mensaje inicial. Titular y fotografía conservados.
- **UX-04:** decisiones y límites presentes fuera de los desplegables en ambos proyectos; etiquetas de ampliación específicas.
- **UX-05:** índice, tiempo estimado, IDs únicos y controles de copia verificados en los seis artículos. Los hashes de los originales, imágenes, código y enlaces de serie siguen pasando. Copia real por Enter devuelve “Code copied.” y conserva el foco; fallo simulado muestra alternativa manual. Estimación de lectura: 220 palabras/minuto, no medición de cada lector.
- **UX-06:** copia real del correo devuelve “Email copied.” y conserva el foco. La suite cubre permiso denegado y API de portapapeles ausente, sin propagar errores.
- **UX-07:** flechas internas corregidas, aviso de reproductor una vez por sección y retirada de barra decorativa de preview. Procedencia, canonical y noindex de artículos conservados.
- **Regresión:** `npm run build`, `node --test tests/*.test.mjs` (11/11) y `git diff --check`, correctos.
- **Navegador:** 10 rutas (portada, dos bibliotecas audiovisuales, archivo y seis artículos) sin desbordamiento horizontal a 320 px; portada y contacto revisados a 390 px; navegación y composición de escritorio revisadas a 1800 px. Los reproductores crean iframe solo al pulsar y lo eliminan al cerrar, devolviendo foco al botón.
- **Preview público:** las mismas 10 rutas responden HTTP 200. `/.git/config`, `/.env` y `/UX-IMPROVEMENTS.md` responden 404: el túnel sirve solo `dist/`.
- **Límite:** no se ha hecho una auditoría completa de accesibilidad, Lighthouse, lectores de pantalla ni prueba en todos los navegadores. No se afirma reproducción continua de los vídeos externos.


## Cierre

- [x] Build y suite completa sin regresiones.
- [x] Revisión móvil y escritorio; menú, lectura y copia comprobados en navegador.
- [x] Preview público responde y no expone archivos del proyecto.

## Criterio visual

Superficie: **Decide / Learn**, con exploración secundaria de contenido. Se conservan crema/carbón/oliva, tipografías editoriales y fotografía real. No añadir tarjetas decorativas, métricas, efectos o dependencias para simular valor.
