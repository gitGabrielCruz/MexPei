/*
=====================================================================
SISTEMA:            Prueba Técnica MexPei (API REST / SPA)
ARCHIVO:            cl_Producto.cs
CARPETA/RUTA:       home/BackEnd/Models/
PROPÓSITO:          Entidad de Dominio para el Catálogo de Productos
QUÉ HACE:           Representa la tabla física de inventario en SQL Server
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
using System.ComponentModel.DataAnnotations.Schema;

namespace MexPei.Api.Models
{
    /// <summary>
    /// Modelo comercial que representa los productos físicos a administrar.
    /// </summary>
    public class cl_Producto
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Nombre { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Descripcion { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string SKU { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Precio { get; set; }

        [Required]
        public int Existencia { get; set; }

        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;

        [Required]
        public bool EstaCancelado { get; set; } = false;
    }
}
