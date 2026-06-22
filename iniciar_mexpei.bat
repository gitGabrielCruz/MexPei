@echo off
:: Forzar el contexto de ejecución al directorio donde se encuentra este archivo .bat
cd /d "%~dp0"

color 0B
echo ===================================================
echo             INICIADOR AUTONOMO MEXPEI
echo ===================================================
echo Verificando dependencias del sistema...
echo.

:: 1. Verificar Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR CRITICO] Node.js no esta instalado o no esta en las variables de entorno PATH.
    echo [SOLUCION] Por favor, descarga e instala Node.js, se recomienda v20.13.1.
    echo.
    pause
    exit /b
)
echo [OK] Node.js detectado.

:: 2. Verificar NPM
where npm >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR CRITICO] NPM - Node Package Manager - no fue detectado.
    echo [SOLUCION] Generalmente se instala junto a Node.js. Reinstala Node.js.
    echo.
    pause
    exit /b
)
echo [OK] NPM detectado.

:: 3. Verificar Angular CLI
call ng version >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR CRITICO] Angular CLI no se encuentra instalado de forma global.
    echo [SOLUCION] Abre una terminal como administrador y ejecuta:
    echo            npm install -g @angular/cli@17
    echo.
    pause
    exit /b
)
echo [OK] Angular CLI detectado.

:: 4. Verificar .NET SDK
where dotnet >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR CRITICO] .NET SDK no esta instalado o no esta en el PATH.
    echo [SOLUCION] Instala el SDK de .NET 8 desde la pagina oficial de Microsoft.
    echo.
    pause
    exit /b
)
echo [OK] .NET 8 SDK detectado.

echo.
color 0A
echo ===================================================
echo [EXITO] Todas las dependencias estan listas.
echo ===================================================
echo.
echo [PASO 1/2] Iniciando Servidor Kestrel (BackEnd C#)...
start "MexPei API (.NET 8)" cmd /k "cd BackEnd && color 0D && echo [MEXPEI BACKEND] Iniciando Kestrel... && dotnet run"

:: Esperamos 4 segundos para darle tiempo a C# de levantar sus puertos
timeout /t 4 /nobreak >nul

echo [PASO 2/2] Iniciando Servidor de Desarrollo (FrontEnd Angular)...
start "MexPei SPA (Angular 17)" cmd /k "cd FrontEnd && color 0E && echo [MEXPEI FRONTEND] Compilando e iniciando servidor web... && ng serve -o"

echo.
echo Los motores estan encendidos en ventanas separadas.
echo El navegador se abrira automaticamente en unos segundos.
echo Puedes cerrar esta ventana negra de diagnostico.
pause
