# Ecosistema Operativo MexPei (Directorio Raíz)

**Propósito:**
Contenedor principal (Home) del proyecto "Prueba Técnica MexPei". Este directorio encapsula de manera monolítica las dos arquitecturas físicas del software: la API RESTful de lógica de negocio (Backend) y la Interfaz de Usuario Single Page Application (Frontend), proveyendo además un punto de acceso único para la orquestación y arranque dual del ecosistema completo.

**[Auditoría Semántica por Origen]:**
<!-- Auditoría Semántica Rigurosa - IDS v5.1 -->
📄 **Archivo:** `iniciar_mexpei.bat` *(Extracción: 34 términos)*
  - **{Identidad y Nicho}**
    - **Tags:** Orquestador (Sinónimos: *Lanzador, Inicializador*), Automatización (Sinónimos: *Scripting, Macro*), Despliegue (Sinónimos: *Arranque, Delivery*), Shell (Sinónimos: *Consola, Terminal*), Entorno_Ejecución (Sinónimos: *Runtime, Servidor_Local*).
  - **{Entidades y Objetos}**
    - **Keywords:** Dotnet_Run (Sinónimos: *Compilador_CS, Kestrel*), NPM_Start (Sinónimos: *Node_Package, Ng_Serve*), CLI_Angular (Sinónimos: *CLI_Frontend, Compilador_TS*), Localhost_4200 (Sinónimos: *Puerto_Web, UI_Port*), Localhost_5000 (Sinónimos: *Puerto_API, REST_Port*), Proxy_Config (Sinónimos: *Túnel_CORS, Reverse_Proxy*), Batch_Script (Sinónimos: *Archivo_Bat, CMD*).

**Contenido Principal:**
- `BackEnd/`: Carpeta estructural que alberga el núcleo C# (.NET 8). Contiene la Web API, Entity Framework Core (ORM), lógica de validación JWT y el esquema Code-First de base de datos SQL Server LocalDB.
- `FrontEnd/`: Carpeta estructural que contiene la Single Page Application construida en Angular. Administra la navegación mediante enrutamiento cliente, intercepción JWT y las interfaces reactivas (Login y Catálogo).
- `iniciar_mexpei.bat`: Ejecutable de Microsoft Windows que levanta simultáneamente los servidores Kestrel (.NET) y Angular CLI (Node), permitiendo correr la plataforma con un solo doble clic.
- `Prueba Técnica MexPei.docx`: Copia original y local de la especificación técnica entregada por el reclutador/cliente.

**Dependencias / Contexto:**
El arranque del ecosistema encapsulado en esta carpeta depende inexcusablemente de tener instalados globalmente en el sistema operativo anfitrión:
- `.NET 8.0 SDK` (Para compilar y servir la carpeta BackEnd).
- `Node.js (LTS)` y `NPM` (Para instalar dependencias y levantar el servidor de desarrollo en la carpeta FrontEnd).
- `Angular CLI` (Recomendable a nivel global para la manipulación de la interfaz).

**Credenciales de Acceso (Administrador):**
El motor de siembra de datos (`cl_SembradorDatos.cs`) inyecta automáticamente este usuario maestro y 50 productos de prueba en la base de datos durante el primer arranque:
- **Usuario:** `admin`
- **Contraseña:** `admin123`

**Mantenimiento:**
Última actualización: 2026-06-22 por DevIAn
