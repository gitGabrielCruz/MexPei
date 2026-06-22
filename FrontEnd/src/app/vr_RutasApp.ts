/*
=====================================================================
SISTEMA:            Prueba Técnica MexPei
ARCHIVO:            vr_RutasApp.ts
CARPETA/RUTA:       home/FrontEnd/src/app/
PROPÓSITO:          Enrutador Maestro de Angular
QUÉ HACE:           Define los paths y protege con Guards
---------------------------------------------------------------------
*/
import { Routes } from '@angular/router';
import { cl_ComponenteAcceso } from './features/auth/cl_ComponenteAcceso';
import { cl_ComponenteListaProductos } from './features/products/cl_ComponenteListaProductos';
import { cl_ComponenteFormularioProducto } from './features/products/cl_ComponenteFormularioProducto';
import { fn_GuardiaAutenticacion } from './core/guards/fn_GuardiaAutenticacion';

export const rutas: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: cl_ComponenteAcceso },
  { path: 'productos', component: cl_ComponenteListaProductos, canActivate: [fn_GuardiaAutenticacion] },
  { path: '**', redirectTo: 'productos' }
];
