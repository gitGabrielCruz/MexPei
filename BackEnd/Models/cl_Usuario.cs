/*
=====================================================================
SISTEMA:            Prueba Técnica MexPei (API REST / SPA)
ARCHIVO:            cl_Usuario.cs
CARPETA/RUTA:       home/BackEnd/Models/
PROPÓSITO:          Entidad de Dominio para Usuarios
QUÉ HACE:           Representa la tabla física de usuarios en SQL Server
DEPENDENCIAS:       System.ComponentModel.DataAnnotations
TRAZABILIDAD:
  - ¿Quién lo llama?: Entity Framework (DbContext) y Controladores
  - ¿A quién llama?:  N/A (Capa base)
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

using System.ComponentModel.DataAnnotations;

namespace MexPei.Api.Models
{
    /// <summary>
    /// Modelo de seguridad que representa a los operadores del sistema.
    /// </summary>
    public class cl_Usuario
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string NombreUsuario { get; set; } = string.Empty;

        [Required]
        public string HashContrasena { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string Rol { get; set; } = "Administrador";
    }
}
