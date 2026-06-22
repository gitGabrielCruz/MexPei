/*
=====================================================================
SISTEMA:            Prueba Técnica MexPei (API REST / SPA)
ARCHIVO:            cl_ComponenteListaProductos.ts
CARPETA/RUTA:       home/FrontEnd/src/app/features/products/
PROPÓSITO:          Renderizado UI del Catálogo de Productos
QUÉ HACE:           Descarga datos del backend y los pinta en un Grid
DEPENDENCIAS:       @angular/common, cl_ServicioProductos
TRAZABILIDAD:
  - ¿Quién lo llama?: Router Maestro (Ruta /productos) protegida por fn_GuardiaAutenticacion
  - ¿A quién llama?:  cl_ServicioProductos.fn_ObtenerProductos()
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

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { cl_ServicioProductos } from '../../core/services/cl_ServicioProductos';
import { cl_ComponenteModalConfirmacion, ConfiguracionModal } from './cl_ComponenteModalConfirmacion';
import { cl_ComponenteFormularioProducto } from './cl_ComponenteFormularioProducto';
import { cl_ComponenteBarraSuperior } from '../../shared/components/cl_ComponenteBarraSuperior';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, cl_ComponenteModalConfirmacion, cl_ComponenteFormularioProducto, cl_ComponenteBarraSuperior],
  template: `
    <!-- Fondo Base -->
    <div class="dashboard-wrapper">
      
      <!-- Top Navbar Global -->
      <app-top-navbar></app-top-navbar>

      <!-- Contenedor Principal -->
      <div class="main-content">
        
        <!-- Header del Contenido -->
        <div class="content-header">
          <div class="header-titles">
            <h1 class="page-title">Catálogo de Productos</h1>
            <p class="page-subtitle">Gestiona el inventario, precios y existencia de la plataforma.</p>
          </div>
          <button class="btn-primary" (click)="fn_AbrirNuevoFormulario()">
            <span class="btn-plus">+</span>
            Limpiar / Nuevo Producto
          </button>
        </div>

        <!-- [Módulo Master-Detail] Formulario Anidado (Siempre Visible) -->
        <app-product-form 
          [datosProducto]="datosProductoSeleccionado" 
          (eventoAlGuardar)="fn_AlGuardarFormulario()" 
          (eventoAlCancelar)="fn_AlCancelarFormulario()">
        </app-product-form>

        <!-- Filtro de Búsqueda -->
        <div class="filter-section">
          <div class="search-box">
            <span class="material-symbols-outlined search-icon">search</span>
            <input type="text" [(ngModel)]="terminoBusqueda" placeholder="Buscar producto por nombre..." class="search-input">
          </div>
          <div class="toggle-deleted">
            <label>
              <input type="checkbox" [(ngModel)]="mostrarCancelados"> Mostrar productos cancelados
            </label>
          </div>
        </div>

        <!-- Data Grid (Tarjeta Blanca) -->
        <div class="data-grid-container">
          <table class="data-table">
            <thead>
              <tr>
                <th width="8%" (click)="fn_OrdenarPor('id')" class="sortable">ID <span *ngIf="columnaOrden === 'id'" class="sort-icon">{{ ordenAscendente ? '↑' : '↓' }}</span></th>
                <th width="42%" (click)="fn_OrdenarPor('nombre')" class="sortable">NOMBRE DEL PRODUCTO <span *ngIf="columnaOrden === 'nombre'" class="sort-icon">{{ ordenAscendente ? '↑' : '↓' }}</span></th>
                <th width="15%" (click)="fn_OrdenarPor('precio')" class="sortable">PRECIO <span *ngIf="columnaOrden === 'precio'" class="sort-icon">{{ ordenAscendente ? '↑' : '↓' }}</span></th>
                <th width="15%" (click)="fn_OrdenarPor('existencia')" class="sortable">EXISTENCIA <span *ngIf="columnaOrden === 'existencia'" class="sort-icon">{{ ordenAscendente ? '↑' : '↓' }}</span></th>
                <th width="10%" (click)="fn_OrdenarPor('estaCancelado')" class="sortable">ESTATUS <span *ngIf="columnaOrden === 'estaCancelado'" class="sort-icon">{{ ordenAscendente ? '↑' : '↓' }}</span></th>
                <th width="10%">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              <!-- [STEP-1]: Iteración reactiva con selector de fila -->
              <tr *ngFor="let producto of productosFiltrados" 
                  [class.selected-row]="datosProductoSeleccionado && producto.id === datosProductoSeleccionado.id"
                  (click)="fn_SeleccionarFila(producto)">
                <td class="td-id">{{ producto.id | number:'3.0-0' }}</td>
                <td class="td-name">{{ producto.nombre }}</td>
                <td class="td-price">$ {{ producto.precio | number:'1.2-2' }}</td>
                <td>
                  <!-- [CRITICAL-SEC]: Lógica visual para píldoras de Existencia -->
                  <div class="stock-badge" [ngClass]="{'stock-in': producto.existencia > 0, 'stock-out': producto.existencia === 0}">
                    {{ producto.existencia }}
                  </div>
                </td>
                <td>
                  <span class="status-badge" [ngClass]="{'status-active': !producto.estaCancelado, 'status-canceled': producto.estaCancelado}">
                    {{ producto.estaCancelado ? 'CANCELADO' : 'ACTIVO' }}
                  </span>
                </td>
                <td class="td-actions">
                  <a href="#" class="action-btn action-edit" title="Editar" (click)="fn_SeleccionarFila(producto); $event.stopPropagation(); $event.preventDefault()">
                    <span class="material-symbols-outlined">edit</span>
                  </a>
                  <a href="#" class="action-btn" 
                     [ngClass]="producto.estaCancelado ? 'action-activate' : 'action-delete'"
                     [title]="producto.estaCancelado ? 'Reactivar' : 'Cancelar'" 
                     (click)="fn_AlternarEstatus(producto); $event.stopPropagation(); $event.preventDefault()">
                    <span class="material-symbols-outlined">cancel</span>
                  </a>
                </td>
              </tr>

              <!-- Placeholder mientras carga -->
              <tr *ngIf="productos.length === 0">
                <td colspan="5" class="td-loading">Descargando inventario seguro...</td>
              </tr>
            </tbody>
          </table>
        </div>
        
      </div>
      
      <!-- [STEP-3]: Modal de Confirmación Anclado -->
      <app-modal-confirmacion 
        [estaAbierto]="modalAbierto" 
        [config]="configModal" 
        (eventoAlConfirmar)="fn_ConfirmarModal()" 
        (eventoAlCancelar)="fn_CancelarModal()">
      </app-modal-confirmacion>
      
    </div>
  `,
  styles: [`
    /* [DEV-LOGIC]: Renderizado alineado exactamente al SVG UI-002_Listado_Productos */
    :host {
      font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
    }

    .dashboard-wrapper {
      height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: #F8FAFC;
      overflow: hidden;
    }

    /* Contenido */
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 20px 100px;
      max-width: 1446px;
      width: 100%;
      margin: 0 auto;
      box-sizing: border-box;
      overflow: hidden;
    }

    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 15px;
      flex-shrink: 0;
    }

    .page-title {
      font-size: 28px;
      font-weight: 700;
      color: #1F2937;
      margin: 0 0 5px;
    }

    .page-subtitle {
      font-size: 15px;
      color: #6B7280;
      margin: 0;
    }

    .btn-primary {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      padding: 0 20px;
      background-color: #1E3A8A;
      border: none;
      border-radius: 6px;
      color: #FFFFFF;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .btn-primary:hover {
      background-color: #172554;
    }

    .btn-plus {
      font-size: 20px;
      margin-right: 8px;
      font-weight: normal;
    }

    /* Filtro de Búsqueda */
    .filter-section {
      margin-bottom: 15px;
      flex-shrink: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .search-box {
      display: flex;
      align-items: center;
      background: #FFFFFF;
      border: 1px solid #D1D5DB;
      border-radius: 6px;
      padding: 0 15px;
      height: 40px;
      width: 100%;
      max-width: 400px;
      transition: border-color 0.2s;
    }

    .toggle-deleted {
      font-size: 14px;
      color: #4B5563;
      display: flex;
      align-items: center;
    }
    
    .toggle-deleted input {
      margin-right: 8px;
      cursor: pointer;
    }

    .search-box:focus-within {
      border-color: #3B82F6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .search-icon {
      color: #9CA3AF;
      font-size: 20px;
      margin-right: 10px;
    }

    .search-input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 14px;
      color: #1F2937;
      background: transparent;
    }

    .search-input::placeholder {
      color: #9CA3AF;
    }

    /* Tabla / Data Grid */
    .data-grid-container {
      flex: none;
      /* Cálculo para encajar la cabecera (~45px) y 8 filas (~49px c/u) */
      height: 445px; 
      max-height: 445px;
      background: #FFFFFF;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
      overflow-y: auto;
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      min-width: 800px;
      border-collapse: collapse;
    }

    .data-table th {
      text-align: left;
      padding: 12px 20px;
      font-size: 12px;
      font-weight: 600;
      color: #6B7280;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #E5E7EB;
      position: sticky;
      top: 0;
      background: #FFFFFF;
      z-index: 10;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }

    .sortable {
      cursor: pointer;
      user-select: none;
      transition: background-color 0.2s ease, color 0.2s ease;
    }

    .sortable:hover {
      background-color: #F9FAFB;
      color: #1F2937;
    }

    .sort-icon {
      margin-left: 4px;
      font-weight: 700;
      color: #2563EB;
    }

    .data-table td {
      padding: 14px 20px;
      border-bottom: 1px solid #E5E7EB;
      transition: background-color 0.2s ease;
    }

    .data-table tr:hover td {
      background-color: #F8FAFC;
      cursor: pointer;
    }

    .data-table tr.selected-row td {
      background-color: #EFF6FF;
    }

    .data-table tr.selected-row td:first-child {
      border-left: 4px solid #3B82F6;
    }

    .td-id {
      font-size: 15px;
      color: #1F2937;
    }

    .td-name {
      font-size: 15px;
      font-weight: 500;
      color: #1F2937;
    }

    .td-price {
      font-size: 15px;
      color: #4B5563;
    }

    .stock-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 40px;
      height: 24px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 600;
      padding: 0 8px;
    }

    .stock-in {
      background-color: #DCFCE7;
      color: #166534;
    }

    .stock-out {
      background-color: #FEF2F2;
      color: #991B1B;
    }

    .status-badge {
      font-size: 12px;
      font-weight: 700;
      padding: 4px 8px;
      border-radius: 4px;
      letter-spacing: 0.5px;
    }

    .status-active {
      background-color: #EFF6FF;
      color: #2563EB;
    }

    .status-canceled {
      background-color: #FEF2F2;
      color: #DC2626;
    }

    .td-actions {
      display: flex;
      gap: 15px;
    }

    .action-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 6px;
      text-decoration: none;
      transition: background-color 0.2s ease;
    }

    .action-btn span {
      font-size: 20px;
    }

    .action-edit {
      color: #3B82F6;
    }

    .action-edit:hover {
      background-color: #EFF6FF;
    }

    .action-delete {
      color: #E11D48;
    }

    .action-delete:hover {
      background-color: #FFF1F2;
    }

    .action-activate {
      color: #059669;
    }

    .action-activate:hover {
      background-color: #ECFDF5;
    }

    .td-loading {
      text-align: center;
      color: #6B7280;
      font-style: italic;
    }

    /* MODO RESPONSIVO: Celulares y Tablets pequeñas */
    @media (max-width: 768px) {
      .main-content {
        padding: 20px 20px;
      }
      .content-header {
        flex-direction: column;
        gap: 15px;
      }
      .btn-primary {
        width: 100%;
      }
      .data-table th, .data-table td {
        padding: 15px 20px;
      }
      .page-title {
        font-size: 24px;
      }
    }
  `]
})
export class cl_ComponenteListaProductos implements OnInit {
  productos: any[] = [];
  terminoBusqueda: string = '';
  mostrarCancelados: boolean = true;
  
  // Variables del Master-Detail
  mostrarFormulario = true;
  datosProductoSeleccionado: any = null;
  
  // Variables del Modal
  modalAbierto = false;
  productoEnProceso: any = null;
  configModal: ConfiguracionModal = { tipo: 'guardar', nombreProducto: '' };

  // Variables de Ordenamiento (Sorting)
  columnaOrden: string = 'id';
  ordenAscendente: boolean = true;

  constructor(private servicioProductos: cl_ServicioProductos) {}

  ngOnInit(): void {
    this.fn_CargarProductos();
  }

  // Filtrado y Ordenamiento Reactivo en Memoria
  get productosFiltrados(): any[] {
    let filtrados = this.productos.filter(producto => {
      const coincideNombre = producto.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase());
      const mostrar = this.mostrarCancelados ? true : !producto.estaCancelado;
      return coincideNombre && mostrar;
    });

    if (this.columnaOrden) {
      filtrados.sort((a, b) => {
        let valA = a[this.columnaOrden];
        let valB = b[this.columnaOrden];

        // Normalizar strings para que el sort no diferencie mayúsculas
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return this.ordenAscendente ? -1 : 1;
        if (valA > valB) return this.ordenAscendente ? 1 : -1;
        return 0;
      });
    }

    return filtrados;
  }

  // Lógica de click en cabeceras
  fn_OrdenarPor(columna: string): void {
    if (this.columnaOrden === columna) {
      this.ordenAscendente = !this.ordenAscendente; // Invertir orden
    } else {
      this.columnaOrden = columna; // Nueva columna
      this.ordenAscendente = true; // Por defecto ascendente
    }
  }

  // [STEP-2]: Carga de productos
  fn_CargarProductos(): void {
    this.servicioProductos.fn_ObtenerProductos().subscribe({
      next: (datos) => {
        this.productos = datos;
        
        // [HOTFIX]: Sincronizar reactividad del Master-Detail
        // Al descargar nueva data, la referencia en memoria del producto seleccionado queda obsoleta.
        // Buscamos el nuevo objeto para reinyectarlo al formulario y forzar el refresco de UI.
        if (this.datosProductoSeleccionado) {
          const productoActualizado = this.productos.find(p => p.id === this.datosProductoSeleccionado.id);
          if (productoActualizado) {
            this.datosProductoSeleccionado = productoActualizado; // Dispara ngOnChanges en el Hijo
          } else {
            this.datosProductoSeleccionado = null; // Se eliminó por completo
          }
        }
      },
      error: (error) => {
        console.error('Error inyectando el catálogo', error);
      }
    });
  }

  // Lógica de Master-Detail
  fn_AbrirNuevoFormulario(): void {
    this.datosProductoSeleccionado = null;
    this.mostrarFormulario = true;
  }

  fn_SeleccionarFila(producto: any): void {
    this.datosProductoSeleccionado = producto;
    this.mostrarFormulario = true;
  }

  fn_AlGuardarFormulario(): void {
    this.fn_CargarProductos(); // Refrescar catálogo tras guardar
  }

  fn_AlCancelarFormulario(): void {
    this.datosProductoSeleccionado = null;
  }

  // Lógica de Soft Delete / Restauración usando Modal Dinámico
  fn_AlternarEstatus(producto: any): void {
    // [HOTFIX]: Seleccionar visualmente la fila antes de abrir el modal
    // Ya que el botón de cancelar tiene $event.stopPropagation(), la fila no se seleccionaba nativamente.
    this.fn_SeleccionarFila(producto);

    this.productoEnProceso = producto;
    this.configModal = {
      tipo: producto.estaCancelado ? 'reactivar' : 'eliminar',
      nombreProducto: producto.nombre
    };
    this.modalAbierto = true;
  }

  fn_CancelarModal(): void {
    this.modalAbierto = false;
    this.productoEnProceso = null;
  }

  fn_ConfirmarModal(): void {
    if (!this.productoEnProceso) return;

    if (this.productoEnProceso.estaCancelado) {
      // Reactivar
      this.servicioProductos.fn_ActivarProducto(this.productoEnProceso.id).subscribe({
        next: () => {
          this.modalAbierto = false;
          this.fn_CargarProductos();
        },
        error: (error) => console.error('Error al reactivar:', error)
      });
    } else {
      // Cancelar (Soft Delete)
      this.servicioProductos.fn_EliminarProducto(this.productoEnProceso.id).subscribe({
        next: () => {
          this.modalAbierto = false;
          this.fn_CargarProductos();
        },
        error: (error) => console.error('Error al cancelar:', error)
      });
    }
  }
}
