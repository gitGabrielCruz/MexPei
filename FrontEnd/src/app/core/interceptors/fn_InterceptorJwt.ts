/*
=====================================================================
SISTEMA:            Prueba Técnica MexPei (API REST / SPA)
ARCHIVO:            fn_InterceptorJwt.ts
CARPETA/RUTA:       home/FrontEnd/src/app/core/interceptors/
PROPÓSITO:          Interceptor de Red Funcional para inyección de JWT
QUÉ HACE:           Escolta peticiones HTTP y adjunta el Authorization Token
DEPENDENCIAS:       @angular/common/http
TRAZABILIDAD:
  - ¿Quién lo llama?: Motor HttpClient (Pipeline Funcional Angular 17)
  - ¿A quién llama?:  Cualquier EndPoint protegido
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

import { HttpInterceptorFn } from '@angular/common/http';

export const fn_InterceptorJwt: HttpInterceptorFn = (peticion, siguiente) => {
  // [STEP-1]: Extraer el Token criptográfico (JWT) desde el almacenamiento local
  const token = localStorage.getItem('mexpei_jwt_token');

  // [CRITICAL-SEC]: Clonar e inyectar el Gafete Digital para penetrar la barrera [Authorize]
  if (token) {
    const peticionClonada = peticion.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return siguiente(peticionClonada);
  }

  // Si no hay token, la petición pasa limpia (útil para el endpoint de Login)
  return siguiente(peticion);
};
