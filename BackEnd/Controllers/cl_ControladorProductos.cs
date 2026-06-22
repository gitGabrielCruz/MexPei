/*
=====================================================================
SISTEMA:            Prueba Técnica MexPei (API REST / SPA)
ARCHIVO:            cl_ControladorProductos.cs
CARPETA/RUTA:       home/BackEnd/Controllers/
PROPÓSITO:          Controlador de Inventario / Catálogo
QUÉ HACE:           Exhibe la colección de productos sembrados en SQL Server
DEPENDENCIAS:       MexPei.Api.Data, Microsoft.AspNetCore.Authorization
TRAZABILIDAD:
  - ¿Quién lo llama?: Red HTTP entrante (Angular)
  - ¿A quién llama?:  cl_ContextoAplicacion (Base de Datos)
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

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using MexPei.Api.Data;
using MexPei.Api.Models;

namespace MexPei.Api.Controllers
{
    // [CRITICAL-SEC]: Política Restrictiva Global. 
    // Si no hay un Token JWT válido adjunto en los encabezados, Kestrel rebotará 
    // la llamada con un error genérico (401) impidiendo que la BD sea leída.
    [Authorize] 
    [Route("api/products")]
    [ApiController]
    public class cl_ControladorProductos : ControllerBase
    {
        private readonly cl_ContextoAplicacion _contexto;

        public cl_ControladorProductos(cl_ContextoAplicacion contexto)
        {
            _contexto = contexto;
        }

        [HttpGet]
        public async Task<IActionResult> fn_ObtenerProductos()
        {
            // Extraer todos los productos. El filtrado de EstaCancelado se hará en Angular.
            var productos = await _contexto.Productos
                .OrderByDescending(p => p.FechaCreacion)
                .ToListAsync();

            return Ok(productos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> fn_ObtenerProductoPorId(int id)
        {
            var producto = await _contexto.Productos.FindAsync(id);
            if (producto == null) return NotFound();
            return Ok(producto);
        }

        [HttpPost]
        public async Task<IActionResult> fn_CrearProducto([FromBody] cl_Producto producto)
        {
            producto.FechaCreacion = DateTime.UtcNow;
            _contexto.Productos.Add(producto);
            await _contexto.SaveChangesAsync();
            return CreatedAtAction(nameof(fn_ObtenerProductoPorId), new { id = producto.Id }, producto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> fn_ActualizarProducto(int id, [FromBody] cl_Producto productoActualizado)
        {
            var producto = await _contexto.Productos.FindAsync(id);
            if (producto == null) return NotFound();

            producto.Nombre = productoActualizado.Nombre;
            producto.Precio = productoActualizado.Precio;
            producto.Existencia = productoActualizado.Existencia;
            
            await _contexto.SaveChangesAsync();
            return Ok(producto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> fn_EliminarProducto(int id)
        {
            var producto = await _contexto.Productos.FindAsync(id);
            if (producto == null) return NotFound();

            // Soft Delete (Cancelación Lógica)
            producto.EstaCancelado = true;
            await _contexto.SaveChangesAsync();
            return NoContent();
        }

        [HttpPatch("{id}/activate")]
        public async Task<IActionResult> fn_ActivarProducto(int id)
        {
            var producto = await _contexto.Productos.FindAsync(id);
            if (producto == null) return NotFound();

            producto.EstaCancelado = false;
            await _contexto.SaveChangesAsync();
            return Ok(producto);
        }
    }
}
