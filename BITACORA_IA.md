# Bitácora de Transparencia y Uso Ético de IA - TP11

## Ficha de Registro

* **Herramienta:** ChatGPT / Gemini
* **Objetivo:** Calcular la distancia euclidiana entre la posición del cursor y cada partícula para activar el efecto de ampliación (zoom) al pasar el mouse cerca.
* **Prompt Exacto:** *"¿Cómo calculo la distancia entre un punto X,Y en Canvas y la posición del mouse usando JavaScript para aumentar el tamaño de una figura si el cursor está a menos de 100 píxeles?"*
* **Fundamentación:** Especifiqué la tecnología (Canvas/JS), la condición de distancia (100px) y el objetivo visual esperado (cambio de tamaño), aplicando las Reglas de Oro de ingeniería de prompts.
* **Aprendizaje:** Recordé la aplicación del teorema de Pitágoras (`Math.sqrt(dx*dx + dy*dy)`) en sistemas de coordenadas 2D para calcular distancias entre puntos dentro de un Game Loop.
* **Verificación:** La propuesta inicial no consideraba los márgenes ni la posición real del elemento `<canvas>` en la pantalla al mover el cursor. Corregí el cálculo restando `getBoundingClientRect().left` y `top` a los eventos del ratón para asegurar la precisión del punto de contacto.