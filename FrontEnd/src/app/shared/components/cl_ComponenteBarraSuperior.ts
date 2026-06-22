/*
=====================================================================
SISTEMA:            Prueba Técnica MexPei (API REST / SPA)
ARCHIVO:            cl_ComponenteBarraSuperior.ts
CARPETA/RUTA:       home/FrontEnd/src/app/shared/components/
PROPÓSITO:          Barra Superior Global Inteligente
QUÉ HACE:           Muestra el reloj en tiempo real y el conteo de productos
---------------------------------------------------------------------
*/

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cl_ServicioProductos } from '../../core/services/cl_ServicioProductos';
import { cl_ServicioAutenticacion } from '../../core/services/cl_ServicioAutenticacion';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-top-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="top-navbar">
      <div class="nav-left">
        <span class="nav-logo">MexPei</span>
        <span class="nav-subtitle">SISTEMA CORPORATIVO</span>
        
        <!-- Etiqueta de Entorno -->
        <span class="env-badge">ENTORNO: DESARROLLO LOCAL</span>
      </div>

      <div class="nav-right">
        <!-- Widget de Conteo de Productos -->
        <div class="widget">
          <span class="material-symbols-outlined widget-icon">inventory_2</span>
          <span class="widget-text">Total: {{ totalProductos }} prod.</span>
        </div>

        <!-- Widget de Reloj -->
        <div class="widget">
          <span class="material-symbols-outlined widget-icon">schedule</span>
          <span class="widget-text">{{ horaActual | date:'mediumTime' }}</span>
        </div>

        <div class="divider"></div>

        <span class="user-role">Administrador</span>
        <div class="user-avatar">AD</div>

        <!-- Botón de Salir -->
        <button class="logout-btn" (click)="fn_CerrarSesion()" title="Cerrar Sesión">
          <span class="material-symbols-outlined">logout</span>
        </button>
      </div>
    </nav>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .top-navbar {
      width: 100%;
      height: 72px;
      background-color: #1E3A8A;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 50px;
      box-sizing: border-box;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .nav-left {
      display: flex;
      align-items: baseline;
      gap: 15px;
    }

    .nav-logo {
      font-size: 24px;
      font-weight: 800;
      color: #FFFFFF;
      font-family: 'Inter', sans-serif;
    }

    .nav-subtitle {
      font-size: 14px;
      color: #93C5FD;
      font-family: 'Inter', sans-serif;
      letter-spacing: 1px;
    }

    .env-badge {
      background-color: #047857; /* Verde esmeralda para local/dev */
      color: #D1FAE5;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 20px;
      letter-spacing: 1px;
      margin-left: 20px;
    }

    .nav-right {
      display: flex;
      align-items: center;
      gap: 20px;
      font-family: 'Inter', sans-serif;
    }

    .widget {
      display: flex;
      align-items: center;
      background-color: rgba(255, 255, 255, 0.1);
      padding: 6px 12px;
      border-radius: 8px;
      color: #E0E7FF;
      gap: 8px;
    }

    .widget-icon {
      font-size: 18px;
    }

    .widget-text {
      font-size: 14px;
      font-weight: 600;
    }

    .divider {
      width: 1px;
      height: 30px;
      background-color: #3B82F6;
      margin: 0 5px;
    }

    .user-role {
      font-size: 14px;
      font-weight: 500;
      color: #E0E7FF;
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: #3B82F6;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      font-weight: 700;
      font-size: 14px;
    }

    .logout-btn {
      background: none;
      border: none;
      color: #93C5FD;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px;
      margin-left: 5px;
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .logout-btn:hover {
      background-color: rgba(239, 68, 68, 0.1);
      color: #EF4444;
    }

    @media (max-width: 900px) {
      .env-badge, .widget, .divider {
        display: none;
      }
      .top-navbar {
        padding: 0 20px;
      }
    }
  `]
})
export class cl_ComponenteBarraSuperior implements OnInit, OnDestroy {
  horaActual: Date = new Date();
  totalProductos: number = 0;
  
  private intervaloReloj: any;
  private suscripcionProductos: Subscription | undefined;

  constructor(
    private servicioProductos: cl_ServicioProductos,
    private servicioAutenticacion: cl_ServicioAutenticacion,
    private enrutador: Router
  ) {}

  ngOnInit(): void {
    // 1. Iniciar reloj
    this.intervaloReloj = setInterval(() => {
      this.horaActual = new Date();
    }, 1000);

    // 2. Suscribirse al Patrón Observador para el contador
    this.suscripcionProductos = this.servicioProductos.vr_TotalProductos$.subscribe(total => {
      this.totalProductos = total;
    });
  }

  ngOnDestroy(): void {
    if (this.intervaloReloj) {
      clearInterval(this.intervaloReloj);
    }
    if (this.suscripcionProductos) {
      this.suscripcionProductos.unsubscribe();
    }
  }

  fn_CerrarSesion(): void {
    this.servicioAutenticacion.fn_CerrarSesion();
    this.enrutador.navigate(['/login']);
  }
}
