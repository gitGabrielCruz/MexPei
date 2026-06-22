/*
=====================================================================
SISTEMA:            Prueba Técnica MexPei (API REST / SPA)
ARCHIVO:            cl_PeticionAcceso.cs
CARPETA/RUTA:       home/BackEnd/DTOs/
PROPÓSITO:          Filtro de seguridad para credenciales de acceso
QUÉ HACE:           Recibe y valida los datos crudos desde el FrontEnd Angular
DEPENDENCIAS:       System.ComponentModel.DataAnnotations
TRAZABILIDAD:
  - ¿Quién lo llama?: Red HTTP entrante (Consumido en cl_ControladorAutenticacion)
  - ¿A quién llama?:  N/A
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

namespace MexPei.Api.DTOs
{
    /// <summary>
    /// Objeto de Transferencia de Datos (DTO) para interceptar el intento de Login.
    /// </summary>
    public class cl_PeticionAcceso
    {
        // [CRITICAL-SEC]: Las etiquetas [Required] obligan a Kestrel a rechazar 
        // peticiones HTTP 400 (Bad Request) si el atacante envía campos nulos, 
        // ahorrando procesamiento en el servidor.
        
        [Required(ErrorMessage = "El nombre de usuario es obligatorio.")]
        public string NombreUsuario { get; set; } = string.Empty;

        [Required(ErrorMessage = "La contraseña es obligatoria.")]
        public string Contrasena { get; set; } = string.Empty;
    }
}
