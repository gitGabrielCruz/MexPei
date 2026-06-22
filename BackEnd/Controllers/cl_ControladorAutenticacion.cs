/*
=====================================================================
SISTEMA:            Prueba Técnica MexPei (API REST / SPA)
ARCHIVO:            cl_ControladorAutenticacion.cs
CARPETA/RUTA:       home/BackEnd/Controllers/
PROPÓSITO:          Controlador de Seguridad y Autenticación
QUÉ HACE:           Valida credenciales y emite Tokens JWT
DEPENDENCIAS:       MexPei.Api.Data, MexPei.Api.DTOs, Microsoft.IdentityModel.Tokens
TRAZABILIDAD:
  - ¿Quién lo llama?: Red HTTP entrante (Angular cl_ServicioAutenticacion)
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
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MexPei.Api.Data;
using MexPei.Api.DTOs;
using Microsoft.EntityFrameworkCore;

namespace MexPei.Api.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class cl_ControladorAutenticacion : ControllerBase
    {
        private readonly cl_ContextoAplicacion _contexto;
        private readonly IConfiguration _configuracion;

        public cl_ControladorAutenticacion(cl_ContextoAplicacion contexto, IConfiguration configuracion)
        {
            _contexto = contexto;
            _configuracion = configuracion;
        }

        [HttpPost("login")]
        public async Task<IActionResult> fn_IniciarSesion([FromBody] cl_PeticionAcceso peticion)
        {
            // [STEP-1]: Verificar existencia del usuario en la base de datos
            var usuario = await _contexto.Usuarios
                .FirstOrDefaultAsync(u => u.NombreUsuario == peticion.NombreUsuario && u.HashContrasena == peticion.Contrasena);

            if (usuario == null)
            {
                // [CRITICAL-SEC]: Devolver 401 sin revelar si falló el usuario o la contraseña
                return Unauthorized(new { mensaje = "Credenciales inválidas." });
            }

            // [STEP-2]: Construcción del Gafete Criptográfico (JWT)
            var reclamacionesAuth = new List<Claim>
            {
                new Claim(ClaimTypes.Name, usuario.NombreUsuario),
                new Claim(ClaimTypes.Role, usuario.Rol),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var claveFirma = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuracion["Jwt:Key"]!));

            var token = new JwtSecurityToken(
                issuer: _configuracion["Jwt:Issuer"],
                audience: _configuracion["Jwt:Audience"],
                expires: DateTime.Now.AddHours(3),
                claims: reclamacionesAuth,
                signingCredentials: new SigningCredentials(claveFirma, SecurityAlgorithms.HmacSha256)
            );

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                expiracion = token.ValidTo
            });
        }
    }
}
