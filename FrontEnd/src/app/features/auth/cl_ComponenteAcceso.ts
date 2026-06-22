/*
=====================================================================
SISTEMA:            Prueba Técnica MexPei (API REST / SPA)
ARCHIVO:            cl_ComponenteAcceso.ts
CARPETA/RUTA:       home/FrontEnd/src/app/features/auth/
PROPÓSITO:          Renderizado UI de Inicio de Sesión
QUÉ HACE:           Muestra el portal visual, captura inputs y autentica
DEPENDENCIAS:       @angular/forms, cl_ServicioAutenticacion, @angular/router
TRAZABILIDAD:
  - ¿Quién lo llama?: Router Maestro (Pantalla principal)
  - ¿A quién llama?:  cl_ServicioAutenticacion para loguear
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

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { cl_ServicioAutenticacion } from '../../core/services/cl_ServicioAutenticacion';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- [STEP-1]: Contenedor Global con Fondo Minimalista -->
    <div class="login-wrapper">

      <!-- Toast de Mensaje Futuro -->
      <div class="toast-mensaje" *ngIf="mostrarMensajeFuturo">
        <span class="material-symbols-outlined" style="margin-right: 8px; font-size: 18px;">info</span>
        Funcionalidad en desarrollo para creación futura.
      </div>

      <!-- [STEP-2]: Tarjeta Translúcida / Elevada -->
      <div class="login-card">
        
        <!-- Header -->
        <div class="login-header">
          <h1 class="logo-title">MexPei</h1>
          <p class="logo-subtitle">SISTEMA CORPORATIVO</p>
          
          <h2 class="welcome-title">Bienvenido</h2>
          <p class="welcome-subtitle">Inicia sesión en tu cuenta</p>
        </div>

        <!-- [STEP-3]: Motor Reactivo -->
        <form [formGroup]="formularioAcceso" (ngSubmit)="fn_Enviar()" class="login-form">
          
          <!-- Input Usuario -->
          <div class="form-group">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round">
              <path d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7"/>
              <rect x="3" y="5" width="18" height="14" rx="2"/>
            </svg>
            <input type="text" formControlName="nombreUsuario" placeholder="Usuario" class="minimal-input" autocomplete="username"/>
            <div class="input-line"></div>
          </div>

          <!-- Input Password -->
          <div class="form-group" style="margin-top: 40px;">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="5" y="11" width="14" height="10" rx="2"/>
              <path d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11"/>
              <circle cx="12" cy="16" r="1" fill="currentColor"/>
            </svg>
            <input type="password" formControlName="contrasena" placeholder="Contraseña" class="minimal-input" autocomplete="current-password"/>
            <div class="input-line"></div>
          </div>

          <!-- Olvidaste password -->
          <div class="forgot-wrapper">
            <a href="#" class="forgot-link" (click)="fn_MostrarMensajeFuturo($event)">¿Olvidaste tu contraseña?</a>
          </div>

          <!-- Feedback de Error -->
          <div class="error-feedback" *ngIf="mensajeError">
            {{ mensajeError }}
          </div>

          <!-- Botón de Envío -->
          <button type="submit" class="btn-primary" [disabled]="formularioAcceso.invalid || estaCargando">
            <span class="btn-text">{{ estaCargando ? 'Autenticando...' : 'Iniciar Sesión' }}</span>
            <svg *ngIf="!estaCargando" class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12H19M19 12L12 5M19 12L12 19"/>
            </svg>
          </button>
        </form>

        <div class="login-footer">
          <p>¿Nuevo en MexPei? <a href="#" class="link-primary" (click)="fn_MostrarMensajeFuturo($event)">Solicitar Acceso</a></p>
        </div>
      </div>

      <div class="global-footer">
        MexPei © 2026 | Términos de Servicio | Política de Privacidad
      </div>
    </div>
  `,
  styles: [`
    /* [DEV-LOGIC]: Renderizado visual alineado al UI-001_Login */
    :host {
      font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
    }

    .login-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background-color: #F8FAFC;
      color: #1F2937;
      position: relative;
    }

    .toast-mensaje {
      position: absolute;
      top: 30px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #3B82F6;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      display: flex;
      align-items: center;
      box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
      z-index: 1000;
      animation: fadeInOut 3s ease forwards;
    }

    @keyframes fadeInOut {
      0% { opacity: 0; transform: translate(-50%, -20px); }
      10% { opacity: 1; transform: translate(-50%, 0); }
      90% { opacity: 1; transform: translate(-50%, 0); }
      100% { opacity: 0; transform: translate(-50%, -20px); }
    }

    .login-card {
      width: 100%;
      max-width: 500px;
      background: #FFFFFF;
      border-radius: 16px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
      padding: 60px 50px;
      margin: 0 20px; /* Para que no toque los bordes en celular */
      box-sizing: border-box;
      position: relative;
    }

    .login-header {
      text-align: center;
      margin-bottom: 50px;
    }

    .logo-title {
      font-size: 36px;
      font-weight: 800;
      color: #1E3A8A;
      margin: 0;
      line-height: 1.2;
    }

    .logo-subtitle {
      font-size: 15px;
      color: #6B7280;
      letter-spacing: 1px;
      margin: 5px 0 40px;
    }

    .welcome-title {
      font-size: 28px;
      font-weight: 700;
      color: #1F2937;
      margin: 0 0 8px;
    }

    .welcome-subtitle {
      font-size: 16px;
      color: #6B7280;
      margin: 0;
    }

    .login-form {
      width: 100%;
    }

    .form-group {
      position: relative;
      width: 100%;
    }

    .input-icon {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      color: #1F2937;
    }

    .minimal-input {
      width: 100%;
      padding: 10px 10px 10px 35px;
      font-size: 16px;
      border: none;
      background: transparent;
      outline: none;
      color: #1F2937;
      box-sizing: border-box;
    }

    .minimal-input::placeholder {
      color: #6B7280;
    }

    .input-line {
      width: 100%;
      height: 2px;
      background-color: #E5E7EB;
      margin-top: 5px;
      transition: background-color 0.3s ease;
    }

    .minimal-input:focus ~ .input-line, .minimal-input:not(:placeholder-shown) ~ .input-line {
      background-color: #1E3A8A;
    }

    .forgot-wrapper {
      text-align: right;
      margin-top: 20px;
      margin-bottom: 30px;
    }

    .forgot-link {
      font-size: 14px;
      font-weight: 500;
      color: #1F2937;
      text-decoration: none;
    }

    .btn-primary {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 52px;
      background-color: #1E3A8A;
      border: none;
      border-radius: 8px;
      color: #FFFFFF;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s ease, transform 0.1s ease;
    }

    .btn-primary:hover:not([disabled]) {
      background-color: #172554;
      transform: translateY(-1px);
    }

    .btn-primary[disabled] {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .btn-icon {
      width: 20px;
      height: 20px;
      margin-left: 10px;
      color: #3B82F6;
    }

    .login-footer {
      text-align: center;
      margin-top: 30px;
      font-size: 14px;
      color: #6B7280;
    }

    .link-primary {
      color: #3B82F6;
      font-weight: 500;
      text-decoration: none;
    }

    .global-footer {
      position: absolute;
      bottom: 30px;
      font-size: 14px;
      color: #9CA3AF;
    }

    .error-feedback {
      color: #DC2626;
      font-size: 14px;
      text-align: center;
      margin-bottom: 15px;
    }

    /* MODO RESPONSIVO: Celulares */
    @media (max-width: 480px) {
      .login-card {
        padding: 40px 25px;
      }
      .logo-title {
        font-size: 32px;
      }
      .welcome-title {
        font-size: 24px;
      }
    }
  `]
})
export class cl_ComponenteAcceso {
  formularioAcceso: FormGroup;
  estaCargando = false;
  mensajeError = '';
  mostrarMensajeFuturo = false;

  constructor(
    private constructorFormulario: FormBuilder,
    private servicioAutenticacion: cl_ServicioAutenticacion,
    private enrutador: Router
  ) {
    // [STEP-4]: Mapeo de validaciones Reactivas
    this.formularioAcceso = this.constructorFormulario.group({
      nombreUsuario: ['', [Validators.required]],
      contrasena: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  // Lógica para links deshabilitados
  fn_MostrarMensajeFuturo(evento: Event): void {
    evento.preventDefault();
    this.mostrarMensajeFuturo = false;
    // Timeout mínimo para re-trigger de la animación CSS
    setTimeout(() => {
      this.mostrarMensajeFuturo = true;
      setTimeout(() => {
        this.mostrarMensajeFuturo = false;
      }, 3000);
    }, 10);
  }

  // [STEP-5]: Flujo de Autenticación hacia C#
  fn_Enviar(): void {
    if (this.formularioAcceso.invalid) return;

    this.estaCargando = true;
    this.mensajeError = '';

    // Mapear nombres en español al DTO de C#
    const peticion = {
      nombreUsuario: this.formularioAcceso.value.nombreUsuario, 
      contrasena: this.formularioAcceso.value.contrasena
    };

    this.servicioAutenticacion.fn_IniciarSesion(peticion).subscribe({
      next: (respuesta) => {
        this.estaCargando = false;
        // Si C# responde OK, expulsar hacia la grilla de productos
        this.enrutador.navigate(['/productos']);
      },
      error: (error) => {
        this.estaCargando = false;
        this.mensajeError = 'Credenciales inválidas o servidor inactivo.';
      }
    });
  }
}
