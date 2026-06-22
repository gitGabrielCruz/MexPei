/*
=====================================================================
SISTEMA:            Prueba Técnica MexPei (API REST / SPA)
ARCHIVO:            cl_ContextoAplicacion.cs
CARPETA/RUTA:       home/BackEnd/Data/
PROPÓSITO:          Contexto y Mapeo Relacional de Base de Datos
QUÉ HACE:           Gestiona la sesión con SQL Server a través de EF Core
DEPENDENCIAS:       Microsoft.EntityFrameworkCore
TRAZABILIDAD:
  - ¿Quién lo llama?: El contenedor IoC en cl_Programa.cs
  - ¿A quién llama?:  Motor SQL Server (MexPeiDb)
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

using Microsoft.EntityFrameworkCore;
using MexPei.Api.Models;

namespace MexPei.Api.Data
{
    /// <summary>
    /// Contexto principal de Entity Framework Core para la base de datos MexPei.
    /// </summary>
    public class cl_ContextoAplicacion : DbContext
    {
        // [DEV-LOGIC]: Constructor que inyecta las opciones de conexión desde cl_Programa.cs
        public cl_ContextoAplicacion(DbContextOptions<cl_ContextoAplicacion> opciones)
            : base(opciones)
        {
        }

        // [STEP-1]: Mapeo Relacional de Tablas Físicas
        public DbSet<cl_Usuario> Usuarios { get; set; }
        public DbSet<cl_Producto> Productos { get; set; }
    }
}
