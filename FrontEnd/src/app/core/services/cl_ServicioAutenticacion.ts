/*
=====================================================================
SISTEMA:            Prueba Técnica MexPei (API REST / SPA)
ARCHIVO:            cl_ServicioAutenticacion.ts
CARPETA/RUTA:       home/FrontEnd/src/app/core/services/
PROPÓSITO:          Servicio de conexión y autenticación
QUÉ HACE:           Envía credenciales al BackEnd y almacena el JWT
DEPENDENCIAS:       @angular/common/http
TRAZABILIDAD:
  - ¿Quién lo llama?: cl_ComponenteAcceso (UI)
  - ¿A quién llama?:  https://localhost:7194/api/auth/login (Kestrel API)
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

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class cl_ServicioAutenticacion {
  // [CRITICAL-SEC]: Apuntar exactamente al túnel abierto en Kestrel.
  private readonly urlApi = 'http://localhost:5203/api/auth';

  constructor(private http: HttpClient) {}

  // [STEP-1]: Disparar intento de login hacia la API en C#
  public fn_IniciarSesion(peticion: any): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/login`, peticion).pipe(
      tap(respuesta => {
        // [STEP-2]: Atrapar y guardar el Gafete Digital devuelto por el servidor
        if (respuesta && respuesta.token) {
          localStorage.setItem('mexpei_jwt_token', respuesta.token);
        }
      })
    );
  }

  // [STEP-3]: Utilidad para purgar la sesión
  public fn_CerrarSesion(): void {
    localStorage.removeItem('mexpei_jwt_token');
  }

  // [STEP-4]: Verificar estado de la sesión
  public fn_EstaAutenticado(): boolean {
    return !!localStorage.getItem('mexpei_jwt_token');
  }
}
