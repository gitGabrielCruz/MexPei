/*
=====================================================================
SISTEMA:            Prueba Técnica MexPei (API REST / SPA)
ARCHIVO:            fn_GuardiaAutenticacion.ts
CARPETA/RUTA:       home/FrontEnd/src/app/core/guards/
PROPÓSITO:          Guardia de Rutas Funcional (UI Shield)
QUÉ HACE:           Bloquea el acceso a rutas protegidas si no hay sesión
DEPENDENCIAS:       @angular/router, cl_ServicioAutenticacion
TRAZABILIDAD:
  - ¿Quién lo llama?: Router Maestro (Angular)
  - ¿A quién llama?:  Router.navigate (para expulsar intrusos)
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

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { cl_ServicioAutenticacion } from '../services/cl_ServicioAutenticacion';

export const fn_GuardiaAutenticacion: CanActivateFn = (ruta, estado) => {
  // Inyección de dependencias dentro de una función pura (Angular 17+)
  const servicioAutenticacion = inject(cl_ServicioAutenticacion);
  const enrutador = inject(Router);

  // [CRITICAL-SEC]: Si el motor reporta que no hay Token, ejecutar protocolo de expulsión.
  if (!servicioAutenticacion.fn_EstaAutenticado()) {
    enrutador.navigate(['/login']);
    return false; // Bloquear renderizado de la pantalla
  }

  // Permitir el paso si el Token existe
  return true;
};
