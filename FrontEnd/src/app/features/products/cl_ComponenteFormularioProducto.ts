/*
=====================================================================
SISTEMA:            Prueba Técnica MexPei (API REST / SPA)
ARCHIVO:            cl_ComponenteFormularioProducto.ts
CARPETA/RUTA:       home/FrontEnd/src/app/features/products/
PROPÓSITO:          Componente Dual para Alta y Edición de Productos
QUÉ HACE:           Renderiza formulario, valida datos y muta el estado
DEPENDENCIAS:       @angular/forms, cl_ServicioProductos
TRAZABILIDAD:
  - ¿Quién lo llama?: Router Maestro (/products/new o /products/edit/:id)
  - ¿A quién llama?:  cl_ServicioProductos (POST o PUT)
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

import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { cl_ServicioProductos } from '../../core/services/cl_ServicioProductos';
import { cl_ComponenteModalConfirmacion, ConfiguracionModal } from './cl_ComponenteModalConfirmacion';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, cl_ComponenteModalConfirmacion],
  template: `
    <!-- Contenedor Principal Anidado -->
    <div class="nested-form-wrapper">
      <div class="form-card">
        <div class="form-header">
          <div class="header-content">
            <h2>{{ estaEnModoEdicion ? 'Editar Producto' : 'Nuevo Producto' }}</h2>
            <p>{{ estaEnModoEdicion ? 'Modifica los datos del artículo existente.' : 'Ingresa los detalles para registrar un artículo.' }}</p>
          </div>
        </div>

          <form [formGroup]="formularioProducto" class="form-body">
            
            <!-- Fila 1: ID y Nombre -->
            <div class="form-row align-end">
              <!-- ID del Producto -->
              <div class="form-group width-20" *ngIf="estaEnModoEdicion">
                <label class="form-label">ID</label>
                <input type="text" formControlName="id" class="form-input bg-disabled text-center" readonly>
              </div>

              <!-- Nombre -->
              <div class="form-group" [ngClass]="estaEnModoEdicion ? 'width-80' : 'width-100'">
                <label class="form-label">Nombre del producto</label>
                <input type="text" formControlName="nombre" class="form-input" placeholder="Ej. Teclado Mecánico Keychron K2" [ngClass]="{'input-error': formularioProducto.get('nombre')?.invalid && formularioProducto.get('nombre')?.touched}">
                <div class="error-msg" *ngIf="formularioProducto.get('nombre')?.invalid && formularioProducto.get('nombre')?.touched">Obligatorio.</div>
              </div>
            </div>

            <!-- Fila 2: Precio, Existencia y Estatus -->
            <div class="form-row align-end">
              <!-- Precio -->
              <div class="form-group" [ngClass]="estaEnModoEdicion ? 'width-30' : 'width-50'">
                <label class="form-label">Precio (MXN)</label>
                <div class="input-with-icon">
                  <span class="currency-symbol">$</span>
                  <input type="number" formControlName="precio" class="form-input has-prefix" placeholder="0.00" step="0.01" min="0.01" [ngClass]="{'input-error': formularioProducto.get('precio')?.invalid && formularioProducto.get('precio')?.touched}">
                </div>
                <div class="error-msg" *ngIf="formularioProducto.get('precio')?.invalid && formularioProducto.get('precio')?.touched">Requerido.</div>
              </div>

              <!-- Stock -->
              <div class="form-group" [ngClass]="estaEnModoEdicion ? 'width-30' : 'width-50'">
                <label class="form-label">Existencia</label>
                <input type="number" formControlName="existencia" class="form-input" placeholder="0" [ngClass]="{'input-error': formularioProducto.get('existencia')?.invalid && formularioProducto.get('existencia')?.touched}">
                <div class="error-msg" *ngIf="formularioProducto.get('existencia')?.invalid && formularioProducto.get('existencia')?.touched">Requerido.</div>
              </div>

              <!-- Estatus del Producto (Visual) -->
              <div class="form-group width-40 status-display" *ngIf="estaEnModoEdicion">
                <span class="status-label">Estatus Actual:</span>
                <span class="status-badge" [ngClass]="{'status-active': !productoEstaCancelado, 'status-canceled': productoEstaCancelado}">
                  {{ productoEstaCancelado ? 'CANCELADO' : 'ACTIVO' }}
                </span>
              </div>
            </div>

            <!-- Botones de Acción -->
            <div class="form-actions">
              <!-- Botón Limpiar/Cancelar edición -->
              <button type="button" class="btn-secondary" (click)="fn_Cancelar()">Limpiar</button>

              <button type="button" class="btn-primary" (click)="fn_Enviar()" [disabled]="formularioProducto.invalid || estaGuardando">
                {{ estaGuardando ? 'Guardando...' : (estaEnModoEdicion ? 'Actualizar Datos' : 'Guardar Nuevo') }}
              </button>
            </div>

          </form>
        </div>
        
        <!-- Modal para Guardar -->
        <app-modal-confirmacion 
          [estaAbierto]="modalGuardarAbierto" 
          [config]="configModalGuardar" 
          (eventoAlConfirmar)="fn_ConfirmarGuardado()" 
          (eventoAlCancelar)="fn_CancelarGuardado()">
        </app-modal-confirmacion>
      </div>
  `,
  styles: [`
    /* [DEV-LOGIC]: Renderizado como Componente Anidado (Micro-Frontend) */
    :host {
      font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
      display: block;
      margin-bottom: 20px;
    }

    .nested-form-wrapper {
      width: 100%;
    }

    /* Formulario */
    .form-card {
      background: #FFFFFF;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
      overflow: hidden;
      width: 100%;
      border: 1px solid #E5E7EB;
    }

    .form-header {
      padding: 15px 25px;
      border-bottom: 1px solid #E5E7EB;
      background-color: #F9FAFB;
    }
    
    .header-content h2 {
      margin: 0 0 5px 0;
      font-size: 18px;
      color: #1F2937;
    }
    
    .header-content p {
      margin: 0;
      font-size: 13px;
      color: #6B7280;
    }

    .form-body {
      padding: 20px 30px;
    }

    .form-group {
      margin-bottom: 15px;
    }

    .form-row {
      display: flex;
      gap: 20px;
    }

    .align-end {
      align-items: flex-end;
    }

    .width-100 { width: 100%; }
    .width-80 { width: 80%; }
    .width-50 { width: 50%; }
    .width-40 { width: 40%; }
    .width-30 { width: 30%; }
    .width-20 { width: 20%; }

    .bg-disabled {
      background-color: #F3F4F6;
      color: #6B7280;
    }

    .text-center {
      text-align: center;
    }

    .form-label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 6px;
    }

    .form-input {
      width: 100%;
      height: 40px;
      border-radius: 6px;
      border: 1px solid #D1D5DB;
      padding: 0 12px;
      font-size: 14px;
      color: #1F2937;
      box-sizing: border-box;
      outline: none;
      transition: border-color 0.2s;
    }

    .form-input::placeholder {
      color: #9CA3AF;
    }

    .form-input:focus {
      border-color: #3B82F6;
    }

    .input-with-icon {
      position: relative;
      display: flex;
      align-items: center;
    }

    .currency-symbol {
      position: absolute;
      left: 15px;
      font-size: 15px;
      color: #4B5563;
      font-weight: 500;
      pointer-events: none;
    }

    .has-prefix {
      padding-left: 30px;
    }

    .input-error {
      border-color: #EF4444;
    }

    .error-msg {
      font-size: 12px;
      color: #EF4444;
      margin-top: 6px;
    }

    .status-display {
      background-color: #F8FAFC;
      padding: 0 15px;
      height: 40px;
      border-radius: 6px;
      border: 1px dashed #CBD5E1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      box-sizing: border-box;
    }

    .status-label {
      font-size: 13px;
      font-weight: 600;
      color: #4B5563;
    }

    .status-badge {
      font-size: 13px;
      font-weight: 700;
      padding: 6px 12px;
      border-radius: 4px;
      letter-spacing: 0.5px;
    }

    .status-active {
      background-color: #EFF6FF;
      color: #2563EB;
      border: 1px solid #BFDBFE;
    }

    .status-canceled {
      background-color: #FEF2F2;
      color: #DC2626;
      border: 1px solid #FECACA;
    }

    /* Actions */
    .form-actions {
      border-top: 1px solid #E5E7EB;
      margin-top: 20px;
      padding-top: 24px;
      display: flex;
      justify-content: flex-end;
      gap: 15px;
    }

    .btn-secondary {
      height: 42px;
      padding: 0 20px;
      background-color: #FFFFFF;
      border: 1px solid #D1D5DB;
      border-radius: 6px;
      color: #374151;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .btn-secondary:hover {
      background-color: #F9FAFB;
    }

    .btn-primary {
      height: 42px;
      padding: 0 24px;
      background-color: #1E3A8A;
      border: none;
      border-radius: 6px;
      color: #FFFFFF;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .btn-primary:hover:not([disabled]) {
      background-color: #172554;
    }

    .btn-primary[disabled] {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .btn-danger {
      height: 42px;
      padding: 0 20px;
      background-color: #FEF2F2;
      border: 1px solid #FCA5A5;
      border-radius: 6px;
      color: #DC2626;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
    }

    .btn-danger:hover:not([disabled]) {
      background-color: #FEE2E2;
      border-color: #EF4444;
    }

    .btn-activate {
      height: 42px;
      padding: 0 20px;
      background-color: #ECFDF5;
      border: 1px solid #6EE7B7;
      border-radius: 6px;
      color: #059669;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
    }

    .btn-activate:hover:not([disabled]) {
      background-color: #D1FAE5;
      border-color: #10B981;
    }

    /* MODO RESPONSIVO: Celulares */
    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
        gap: 0;
      }
      .form-header, .form-body {
        padding: 20px;
      }
      .form-actions {
        flex-direction: column;
      }
      .btn-secondary, .btn-primary {
        width: 100%;
      }
    }
  `]
})
export class cl_ComponenteFormularioProducto implements OnChanges {
  @Input() datosProducto: any = null;
  @Output() eventoAlGuardar = new EventEmitter<void>();
  @Output() eventoAlCancelar = new EventEmitter<void>();

  formularioProducto: FormGroup;
  estaEnModoEdicion = false;
  estaGuardando = false;
  productoEstaCancelado = false;
  idProducto: number | null = null;
  
  // Variables del Modal
  modalGuardarAbierto = false;
  configModalGuardar: ConfiguracionModal = { tipo: 'guardar', nombreProducto: '' };

  constructor(
    private constructorFormulario: FormBuilder,
    private servicioProductos: cl_ServicioProductos
  ) {
    // [STEP-1]: Mapeo riguroso de reglas reactivas
    this.formularioProducto = this.constructorFormulario.group({
      id: [{value: '', disabled: true}],
      nombre: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0.01)]],
      existencia: ['', [Validators.required, Validators.min(0)]]
    });
  }

  // Detecta cuando el padre (Lista) cambia el objeto inyectado
  ngOnChanges(cambios: SimpleChanges): void {
    if (cambios['datosProducto']) {
      const producto = cambios['datosProducto'].currentValue;
      if (producto) {
        this.estaEnModoEdicion = true;
        this.idProducto = producto.id;
        this.productoEstaCancelado = producto.estaCancelado; // Se actualizó de isDeleted a estaCancelado
        
        // Carga instantánea desde memoria (truncando precio a 2 decimales)
        this.formularioProducto.patchValue({
          id: producto.id,
          nombre: producto.nombre,
          precio: Number(producto.precio).toFixed(2),
          existencia: producto.existencia
        });
      } else {
        this.estaEnModoEdicion = false;
        this.idProducto = null;
        this.productoEstaCancelado = false;
        this.formularioProducto.reset();
      }
    }
  }

  // [STEP-3]: Preparar envío abriendo el modal de confirmación
  fn_Enviar(): void {
    if (this.formularioProducto.invalid) {
      this.formularioProducto.markAllAsTouched();
      return;
    }

    // Configurar Modal
    this.configModalGuardar = {
      tipo: 'guardar',
      nombreProducto: this.formularioProducto.value.nombre || 'Producto Nuevo'
    };
    this.modalGuardarAbierto = true;
  }

  fn_CancelarGuardado(): void {
    this.modalGuardarAbierto = false;
  }

  fn_ConfirmarGuardado(): void {
    this.modalGuardarAbierto = false;
    this.estaGuardando = true;
    
    // Mapeamos al formato que espera C#
    const payload = {
      nombre: this.formularioProducto.value.nombre,
      precio: this.formularioProducto.value.precio,
      existencia: this.formularioProducto.value.existencia,
      sku: "SKU-AUTO", // Mantenemos el hack para el required
      estaCancelado: this.productoEstaCancelado
    };

    if (this.estaEnModoEdicion && this.idProducto) {
      // Flujo de Actualización (PUT)
      this.servicioProductos.fn_ActualizarProducto(this.idProducto, payload).subscribe({
        next: () => {
          this.estaGuardando = false;
          this.eventoAlGuardar.emit();
        },
        error: (error) => {
          console.error('Error actualizando:', error);
          this.estaGuardando = false;
        }
      });
    } else {
      // Flujo de Creación (POST)
      this.servicioProductos.fn_CrearProducto(payload).subscribe({
        next: () => {
          this.estaGuardando = false;
          this.eventoAlGuardar.emit();
        },
        error: (error) => {
          console.error('Error creando:', error);
          this.estaGuardando = false;
        }
      });
    }
  }

  fn_Cancelar(): void {
    this.eventoAlCancelar.emit();
  }
}
