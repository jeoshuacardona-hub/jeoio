# SliceOps AI - Proyecto Completo

Este directorio contiene todo el código necesario para desplegar tu sistema en producción.

## Estructura de Carpetas

* **`frontend/`**: Contiene la aplicación web (HTML, CSS, JS). Está construida con Tailwind CSS y Vanilla JS. Se comunica directamente con Supabase usando el cliente oficial de JavaScript (las claves están ofuscadas en `js/supabase-config.js`).
* **`backend/`**: Contiene la API en Python construida con FastAPI. Se encarga de procesar Webhooks de WhatsApp, cálculos de n8n, interacción con OpenAI y operaciones complejas de base de datos.

---

## 🎭 Modo Demo (QA Ready)

El sistema incluye una capa de **Mock Data** (Datos de Prueba). Si no has configurado tus claves de Supabase reales, el dashboard mostrará automáticamente datos ficticios realistas para que puedas probar la interfaz, navegar entre secciones y mostrar el proyecto.

*   Para activar tus datos reales: Edita `frontend/js/supabase-config.js` y reemplaza las variables `ENCRYPTED_SUPABASE_URL` y `ENCRYPTED_SUPABASE_KEY` con tus claves codificadas en Base64.
*   *Tip:* Puedes usar `btoa("tu_url")` en la consola del navegador para obtener el código Base64.

---

## 🚀 Instrucciones para Subir y Desplegar (Deploy)

Para poner tu aplicación en línea, puedes usar plataformas gratuitas o de muy bajo costo que se conectan directamente a tu repositorio (como GitHub, GitLab, etc.).

### 1. Frontend (Despliegue Recomendado: Vercel, Netlify o GitHub Pages)
Dado que el frontend está hecho en Vanilla JS y no requiere compilación (build), subirlo es extremadamente fácil.

**Usando Vercel (Recomendado):**
1. Crea una cuenta gratuita en [Vercel.com](https://vercel.com/).
2. Arrastra la carpeta **`frontend`** directamente a su panel web, o conéctalo a tu repositorio de GitHub seleccionando la carpeta `frontend` como el directorio raíz.
3. ¡Listo! Vercel te dará un link público (ej. `sliceops-ai.vercel.app`).
*Nota: Asegúrate de haber cambiado las credenciales en `js/supabase-config.js` por tus claves en formato Base64 como se indica en los comentarios del archivo.*

### 2. Backend (Despliegue Recomendado: Render, Railway o Fly.io)
El backend requiere un entorno Python.

**Usando Render.com:**
1. Crea una cuenta gratuita en [Render.com](https://render.com/).
2. Haz clic en "New Web Service" y conéctalo a tu repositorio (apuntando a la carpeta **`backend`**).
3. Configuración del servicio:
   * **Build Command**: `pip install -r requirements.txt`
   * **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. **Variables de Entorno**: En Render, ve a la sección "Environment" de tu servicio y agrega:
   * `SUPABASE_URL` = tu url de supabase
   * `SUPABASE_KEY` = tu service role key de supabase
   * `SUPABASE_DB_URL` = tu URL de postgres de supabase (ej. `postgresql://postgres:password@db.xxxx.supabase.co:5432/postgres`)
   * `META_ACCESS_TOKEN` = token de meta
   * `META_WEBHOOK_VERIFY_TOKEN` = el token que elijas para los webhooks
   * `OPENAI_API_KEY` = tu api key de OpenAI
5. Render te dará un link público (ej. `sliceops-backend.onrender.com`). Usa este link para configurar tus Webhooks en Meta y en n8n.

---

## 🤖 Integración con n8n

Para conectar tus flujos de n8n con el sistema:

### Cómo "extraer" datos de n8n al sistema:
1.  **Nodos de HTTP Request**: En n8n, usa un nodo "HTTP Request" para enviar datos al backend.
    *   **URL**: `https://tu-backend.onrender.com/api/n8n/sync` (o el endpoint que desees).
    *   **Method**: `POST`.
    *   **Body**: Envía el JSON con la información de la orden o el chat.

### Cómo recibir datos desde el sistema:
1.  **Webhook Node**: En n8n, crea un nodo de tipo "Webhook".
2.  Configura el método como `POST`.
3.  Copia la "Production URL" del webhook de n8n.
4.  Pega esa URL en el panel de **Automation** de la aplicación o configúrala en el backend para que el sistema le dispare eventos.

---

¡Tu sistema SliceOps AI está listo para dominar el mercado de pizzerías! 🍕🚀
