import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ConfiguracionModal {
  tipo: 'guardar' | 'eliminar' | 'reactivar';
  nombreProducto: string;
}

@Component({
  selector: 'app-modal-confirmacion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Overlay oscuro (Glass effect) -->
    <div class="modal-overlay" *ngIf="estaAbierto">
      
      <!-- Tarjeta Modal -->
      <div class="modal-card">
        
        <!-- Icono Dinámico -->
        <div class="icon-wrapper">
          <!-- Icono Guardar (Azul) -->
          <svg *ngIf="config.tipo === 'guardar'" viewBox="0 0 64 64" width="64" height="64">
            <circle cx="32" cy="32" r="32" fill="#DBEAFE"/>
            <path d="M20 32 l8 8 l16 -16" fill="none" stroke="#2563EB" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          
          <!-- Icono Eliminar (Rojo) -->
          <svg *ngIf="config.tipo === 'eliminar'" viewBox="0 0 64 64" width="64" height="64">
            <circle cx="32" cy="32" r="32" fill="#FEE2E2"/>
            <path d="M32 15 v20 M32 45 v4" stroke="#DC2626" stroke-width="4" stroke-linecap="round"/>
          </svg>

          <!-- Icono Reactivar (Verde) -->
          <svg *ngIf="config.tipo === 'reactivar'" viewBox="0 0 64 64" width="64" height="64">
            <circle cx="32" cy="32" r="32" fill="#DCFCE7"/>
            <path d="M20 32 l8 8 l16 -16" fill="none" stroke="#16A34A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        
        <!-- Textos Dinámicos -->
        <h2 class="modal-title">{{ titulo }}</h2>
        
        <p class="modal-subtitle">{{ mensajePrincipal }}</p>
        <p class="modal-product-name">"{{ config.nombreProducto }}"</p>
        <p class="modal-subtitle">{{ mensajeSecundario }}</p>

        <!-- Botones -->
        <div class="modal-divider"></div>
        <div class="modal-actions">
          <button class="btn-cancel" (click)="fn_Cancelar()">Cancelar</button>
          
          <!-- Botón de Acción Dinámico -->
          <button 
            [ngClass]="{
              'btn-primary': config.tipo === 'guardar',
              'btn-danger': config.tipo === 'eliminar',
              'btn-success': config.tipo === 'reactivar'
            }" 
            (click)="fn_Confirmar()">
            {{ textoBoton }}
          </button>
        </div>
        
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(17, 24, 39, 0.65);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }

    .modal-card {
      width: 500px;
      background-color: #FFFFFF;
      border-radius: 16px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      padding: 30px 40px;
      box-sizing: border-box;
      text-align: center;
      font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
    }

    .icon-wrapper {
      margin-bottom: 20px;
      display: flex;
      justify-content: center;
    }

    .modal-title {
      font-size: 22px;
      font-weight: 700;
      color: #1F2937;
      margin: 0 0 15px;
    }

    .modal-subtitle {
      font-size: 15px;
      color: #6B7280;
      margin: 0;
    }

    .modal-product-name {
      font-size: 15px;
      font-weight: 600;
      color: #1F2937;
      margin: 5px 0;
    }

    .modal-divider {
      height: 1px;
      background-color: #E5E7EB;
      margin: 25px 0 20px;
    }

    .modal-actions {
      display: flex;
      justify-content: center;
      gap: 20px;
    }

    .btn-cancel {
      width: 180px;
      height: 44px;
      background-color: #FFFFFF;
      border: 1px solid #D1D5DB;
      border-radius: 6px;
      color: #374151;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .btn-cancel:hover {
      background-color: #F9FAFB;
    }

    .btn-danger {
      width: 180px;
      height: 44px;
      background-color: #E11D48;
      border: none;
      border-radius: 6px;
      color: #FFFFFF;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .btn-danger:hover {
      background-color: #BE123C;
    }
    
    .btn-primary {
      width: 180px;
      height: 44px;
      background-color: #2563EB;
      border: none;
      border-radius: 6px;
      color: #FFFFFF;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .btn-primary:hover {
      background-color: #1D4ED8;
    }
    
    .btn-success {
      width: 180px;
      height: 44px;
      background-color: #16A34A;
      border: none;
      border-radius: 6px;
      color: #FFFFFF;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .btn-success:hover {
      background-color: #15803D;
    }
  `]
})
export class cl_ComponenteModalConfirmacion implements OnChanges {
  @Input() estaAbierto = false;
  @Input() config: ConfiguracionModal = { tipo: 'guardar', nombreProducto: '' };
  
  @Output() eventoAlConfirmar = new EventEmitter<void>();
  @Output() eventoAlCancelar = new EventEmitter<void>();

  titulo = '';
  mensajePrincipal = '';
  mensajeSecundario = '';
  textoBoton = '';

  ngOnChanges(): void {
    this.fn_RenderizarTextos();
  }

  fn_RenderizarTextos() {
    switch(this.config.tipo) {
      case 'guardar':
        this.titulo = 'Confirmar Guardado';
        this.mensajePrincipal = '¿Estás seguro de que deseas guardar los datos ingresados para el producto';
        this.mensajeSecundario = 'Verifica que los decimales e inventario sean correctos antes de confirmar.';
        this.textoBoton = 'Guardar Datos';
        break;
      case 'eliminar':
        this.titulo = 'Cancelar Producto';
        this.mensajePrincipal = '¿Estás seguro que deseas cancelar/eliminar el producto';
        this.mensajeSecundario = 'del inventario? El producto pasará a un estado inactivo (Soft Delete).';
        this.textoBoton = 'Sí, Cancelar';
        break;
      case 'reactivar':
        this.titulo = 'Reactivar Producto';
        this.mensajePrincipal = '¿Estás seguro que deseas devolver a estado ACTIVO el producto';
        this.mensajeSecundario = 'en el inventario? El producto volverá a ser visible en operaciones de venta.';
        this.textoBoton = 'Sí, Reactivar';
        break;
    }
  }

  fn_Confirmar(): void {
    this.eventoAlConfirmar.emit();
  }

  fn_Cancelar(): void {
    this.eventoAlCancelar.emit();
  }
}
