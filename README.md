<h1 align="center">
  <br/>
  MediConnect — Portal Web Administrativo
  <br/>
</h1>

<p align="center">
  Plataforma de gestión clínica para la administración del personal médico y agendamiento de turnos.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Astro-6.x-FF5D01?style=flat-square&logo=astro&logoColor=white"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat-square&logo=supabase&logoColor=white"/>
  <img src="https://img.shields.io/badge/TypeScript-Typed-3178C6?style=flat-square&logo=typescript&logoColor=white"/>
</p>

---

## Descripción

**MediConnect Admin Portal** es la interfaz de administración del sistema MediConnect, diseñada para optimizar la operación interna de clínicas y centros médicos. Permite a los administradores gestionar en tiempo real el personal médico, la asignación de consultorios y la programación de turnos, garantizando una organización eficiente y libre de conflictos.

---

## Funcionalidades Principales

### 🗓️ Gestión de Agenda
- Asignación de turnos médicos por sala, fecha y horario.
- Validación automática de superposición de horarios en el mismo consultorio.
- Limpieza en tiempo real de turnos vencidos al realizar consultas.
- Visualización de disponibilidad de salas por día.

### 👨‍⚕️ Personal Médico
- Listado completo de médicos con especialidad, número de matrícula y estado.
- Vista en cuadrícula o lista, ordenada por médicos con turnos activos.
- Edición de turnos asignados directamente desde el panel.
- Gestión de licencias médicas: bloqueo de turnos y actualización de estado automática.

### 🔐 Autenticación
- Inicio de sesión con correo y contraseña mediante Supabase Auth.
- Soporte para autenticación con Google (OAuth).
- Protección de rutas por sesión activa.

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Framework | [Astro 6](https://astro.build) con islas React |
| UI Components | React 19 + Radix UI |
| Estilos | Tailwind CSS 4 |
| Backend / DB | [Supabase](https://supabase.com) (PostgreSQL + Auth) |
| Lenguaje | TypeScript |
| Íconos | Lucide React |

---

## Estructura del Proyecto

```
medi_astro/
├── src/
│   ├── components/
│   │   ├── agenda/       # Formularios y vistas de turnos
│   │   ├── auth/         # Componentes de inicio de sesión
│   │   ├── layout/       # Sidebar y navegación
│   │   ├── staff/        # Gestión de personal médico
│   │   └── ui/           # Componentes reutilizables (inputs, modales, etc.)
│   ├── layouts/          # Layouts de aplicación y autenticación
│   ├── pages/            # Rutas del portal (Astro)
│   ├── services/         # Capa de acceso a datos (Supabase)
│   └── types/            # Definiciones de tipos TypeScript
├── public/               # Assets estáticos
└── astro.config.mjs
```

---

## Instalación y Desarrollo

### Requisitos previos
- Node.js `>= 22.12.0`
- Cuenta y proyecto en [Supabase](https://supabase.com)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/SASD01/mc-admin-portal.git
cd mc-admin-portal/medi_astro

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con las credenciales de tu proyecto Supabase

# 4. Iniciar servidor de desarrollo
npm run dev
```

### Variables de entorno requeridas

```env
PUBLIC_SUPABASE_URL=https://<tu-proyecto>.supabase.co
PUBLIC_SUPABASE_ANON_KEY=<tu-clave-anonima>
```

---

## Licencia

Este proyecto es de uso privado y forma parte del ecosistema **MediConnect**.  
© 2025 MediConnect. Todos los derechos reservados.
