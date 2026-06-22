/*
=====================================================================
SISTEMA:            Prueba Técnica MexPei (API REST / SPA)
ARCHIVO:            cl_SembradorDatos.cs
CARPETA/RUTA:       home/BackEnd/Data/
PROPÓSITO:          Motor de Siembra de Datos (Tierra Arrasada)
QUÉ HACE:           Destruye la base de datos, la recrea e inyecta 50 productos
DEPENDENCIAS:       MexPei.Api.Models
TRAZABILIDAD:
  - ¿Quién lo llama?: El archivo maestro cl_Programa.cs (antes del Run)
  - ¿A quién llama?:  cl_ContextoAplicacion
CONTROL DE VERSIÓN: v1.1 [2026-06-21] Ing. Gabriel -> Traducción a Español
---------------------------------------------------------------------
Autor Intelectual y Desarrollo:
Ing. Gabriel Amílcar Cruz Canto

Tipo de Uso:
Prueba Técnica / Evaluación Profesional (Proyecto MexPei)

Marco Metodológico y Estándares Aplicados:
- Arquitectura Limpia (Clean Architecture) y Principios SOLID
- ISO/IEC/IEEE 12207 (Procesos del Ciclo de Vida del Software)
- Lineamientos de Seguridad OWASP Top 10

© Ing. Gabriel Amílcar Cruz Canto. Todos los derechos reservados.
=====================================================================
*/

using MexPei.Api.Models;

namespace MexPei.Api.Data
{
    /// <summary>
    /// Utilidad arquitectónica para la prueba técnica.
    /// Purga e inyecta registros automáticamente.
    /// </summary>
    public static class cl_SembradorDatos
    {
        public static void fn_Inicializar(cl_ContextoAplicacion contexto)
        {
            // [CRITICAL-SEC]: Política de "Tierra Arrasada" para entorno de pruebas.
            // Elimina la BD si existe, garantizando que el evaluador siempre vea datos frescos y sin basura residual.
            contexto.Database.EnsureDeleted();
            contexto.Database.EnsureCreated();

            // [STEP-1]: Sembrar Usuario Administrador (Password: admin123)
            // Nota: En producción esto debe usar BCrypt, se usa un string plano temporalmente para esta fase hasta instalar criptografía.
            var usuarioAdmin = new cl_Usuario
            {
                NombreUsuario = "admin",
                HashContrasena = "admin123", 
                Rol = "Administrador"
            };
            contexto.Usuarios.Add(usuarioAdmin);

            // [STEP-2]: Generación de 50 Productos Comerciales
            var aleatorio = new Random();
            var categorias = new[] { "Electrónica", "Hogar", "Ferretería", "Oficina", "Deportes" };

            for (int i = 1; i <= 50; i++)
            {
                var cat = categorias[aleatorio.Next(categorias.Length)];
                var producto = new cl_Producto
                {
                    Nombre = $"Producto de {cat} Modelo X-{i}",
                    Descripcion = $"Descripción detallada para el producto de prueba {i} de la categoría {cat}. Excelente calidad y garantía extendida.",
                    SKU = $"SKU-{cat.Substring(0,3).ToUpper()}-00{i}",
                    Precio = (decimal)(aleatorio.NextDouble() * 5000) + 10,
                    Existencia = aleatorio.Next(5, 100),
                    FechaCreacion = DateTime.UtcNow
                };
                contexto.Productos.Add(producto);
            }

            // [STEP-3]: Impactar físicamente en SQL Server
            contexto.SaveChanges();
        }
    }
}
