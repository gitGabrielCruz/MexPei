/*
=====================================================================
SISTEMA:            Prueba Técnica MexPei (API REST / SPA)
ARCHIVO:            cl_ServicioProductos.ts
CARPETA/RUTA:       home/FrontEnd/src/app/core/services/
PROPÓSITO:          Servicio de consumo de inventario
QUÉ HACE:           Descarga los 50 productos generados en SQL Server
DEPENDENCIAS:       @angular/common/http
TRAZABILIDAD:
  - ¿Quién lo llama?: cl_ComponenteListaProductos (UI)
  - ¿A quién llama?:  https://localhost:7194/api/products (Kestrel API)
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
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class cl_ServicioProductos {
  // [CRITICAL-SEC]: Ruta blindada. El interceptor inyectará el Token invisiblemente.
  private readonly apiUrl = 'http://localhost:5203/api/products';

  // [NUEVO]: Patrón Observador para el contador global de productos
  public vr_TotalProductos$ = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {}

  // [STEP-1]: Solicitar la extracción asíncrona de los productos e interceptar el total
  public fn_ObtenerProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      tap(productos => {
        // Emitir silenciosamente el conteo a toda la aplicación
        this.vr_TotalProductos$.next(productos.length);
      })
    );
  }

  // [SPRINT-15]: Métodos inyectados para operaciones de Mutación
  public fn_ObtenerProductoPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  public fn_CrearProducto(producto: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, producto);
  }

  public fn_ActualizarProducto(id: number, producto: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, producto);
  }

  // [SPRINT-16]: Método inyectado para Eliminar Lógicamente
  public fn_EliminarProducto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // [NUEVO]: Método para Reactivar un producto
  public fn_ActivarProducto(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/activate`, {});
  }
}
