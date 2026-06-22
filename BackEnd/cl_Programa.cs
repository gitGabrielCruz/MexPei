/*
=====================================================================
SISTEMA:            Prueba Técnica MexPei (API REST)
ARCHIVO:            cl_Programa.cs
CARPETA/RUTA:       home/BackEnd/
PROPÓSITO:          Builder y configuración maestro Kestrel
QUÉ HACE:           Inicializa el servidor HTTP y mapea controladores
DEPENDENCIAS:       Microsoft.AspNetCore, EntityFrameworkCore
TRAZABILIDAD:
  - ¿Quién lo llama?: Runtime de .NET 8 (Motor de Ejecución Host)
  - ¿A quién llama?:  Controladores (Auth/Productos) e Inyector de DB
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
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using MexPei.Api.Data;

var constructor = WebApplication.CreateBuilder(args);

// =========================================================
// [DEV-LOGIC]: Inyección de Dependencias Base (Contenedor de Servicios)
// Propósito: Habilitar el soporte centralizado para Controladores RESTful 
// y preparar la generación de documentación interactiva (Swagger).
// =========================================================
// [STEP-0]: Inyectar el Contexto de Base de Datos (ORM) usando memoria ram (garantiza que corra en cualquier PC).
constructor.Services.AddDbContext<cl_ContextoAplicacion>(opciones =>
    opciones.UseInMemoryDatabase("MexPeiDb"));

constructor.Services.AddControllers();
constructor.Services.AddEndpointsApiExplorer();
constructor.Services.AddSwaggerGen();

// [STEP-0.2]: Configurar CORS para permitir el tráfico desde Angular
constructor.Services.AddCors(opciones =>
{
    opciones.AddPolicy("AllowAngular",
        politica => politica.SetIsOriginAllowed(origen => new Uri(origen).Host == "localhost")
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

// [STEP-0.5]: Inyección del Motor JWT
constructor.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opciones =>
    {
        opciones.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = constructor.Configuration["Jwt:Issuer"],
            ValidAudience = constructor.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(constructor.Configuration["Jwt:Key"]!))
        };
    });

var aplicacion = constructor.Build();

// =========================================================
// [DEV-LOGIC]: Motor de Siembra (Sembrador de Datos)
// Propósito: Interceptar el arranque para purgar la base de datos e inyectar
// 50 productos de prueba y el usuario administrador.
// =========================================================
using (var alcance = aplicacion.Services.CreateScope())
{
    var contexto = alcance.ServiceProvider.GetRequiredService<cl_ContextoAplicacion>();
    cl_SembradorDatos.fn_Inicializar(contexto);
}

// =========================================================
// [DEV-LOGIC]: Configuración del Pipeline HTTP Maestro
// Propósito: Definir el orden estricto en el que el servidor Kestrel 
// procesa las peticiones y respuestas.
// =========================================================

if (aplicacion.Environment.IsDevelopment())
{
    // [STEP-1]: Habilitar Swagger solo en desarrollo para no exponer la API en producción.
    aplicacion.UseSwagger();
    aplicacion.UseSwaggerUI();
}

// [CRITICAL-SEC]: Forzar redirección estricta a HTTPS en todo el tráfico entrante.
aplicacion.UseHttpsRedirection();

// [STEP-1.5]: Activar CORS
aplicacion.UseCors("AllowAngular");

// [STEP-2]: Activar el middleware de Autenticación JWT ANTES de la Autorización.
aplicacion.UseAuthentication();
aplicacion.UseAuthorization();

// [STEP-3]: Inyectar el mapeo de los controladores (EndPoints de la API).
aplicacion.MapControllers();

// [STEP-4]: Arrancar el motor del Servidor.
aplicacion.Run();
