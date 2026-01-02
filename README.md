# 🎵 Sistema de Asistencia - Conservatorio de Música

Plataforma integral para la gestión de asistencia, control de personal docente y seguimiento académico en el Conservatorio de Música. Diseñado para modernizar los procesos administrativos y ofrecer una interfaz intuitiva tanto para administradores como para profesores.

![React](https://img.shields.io/badge/-React-61DAFB?style=flat&logo=react&logoColor=black)
![Supabase](https://img.shields.io/badge/-Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)
![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat&logo=vite&logoColor=white)

---

## ✨ Características Principales

### 👨‍🏫 Panel de Administración
- **Gestión de Profesores**: Registro completo con generación automática de credenciales.
- **Invitación Inteligente**: Envío de correos de bienvenida (Edge Functions) con creación atómica de usuarios y perfiles.
- **Control de Cátedras**: Administración de asignaturas, salones y cargas horarias.
- **Horarios Maestros**: Asignación visual de horarios por día y hora.
- **Reportes de Asistencia**: Vista en tiempo real del estado de los docentes (Presente, Tarde, Ausente).

### 🎼 Panel del Profesor
- **Marcaje de Asistencia**: Sistema simple de "Check-in/Check-out".
- **Lógica de Puntualidad**: Cálculo automático de retardos basado en el horario asignado vs. hora real de llegada.
- **Horario Personal**: Visualización de las clases del día.
- **Justificativos**: (En desarrollo) Envío de soportes digitales para inasistencias.

---

## 🚀 Tecnologías

- **Frontend**: React.js + Vite
- **Backend & Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Estilos**: CSS Vanilla con diseño responsivo y moderno (Glassmorphism).

---

## 🛠️ Instalación y Configuración

1.  **Clonar el repositorio**:
    ```bash
    git clone https://github.com/Danirodrigzz/Sistema_Asistencias_Inasistencias.git
    cd Sistema_Asistencias_Inasistencias
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno**:
    Crea un archivo `.env` en la raíz con tus credenciales de Supabase (no incluidas en el repositorio por seguridad).
    ```env
    VITE_SUPABASE_URL=tu_url_de_supabase
    VITE_SUPABASE_ANON_KEY=tu_clave_anonima
    ```

4.  **Iniciar el servidor de desarrollo**:
    ```bash
    npm run dev
    ```

---

## 🔐 Credenciales de Acceso (Demo)

Para probar el sistema con privilegios completos, utiliza la siguiente cuenta administrativa por defecto:

| Rol | Correo | Contraseña |
| :--- | :--- | :--- |
| **Administrador** | `admin@conservatorio.ve` | `123456` |

> ⚠️ **Nota:** Estas credenciales son para entornos de desarrollo y demostración. Se recomienda cambiarlas en producción.

---

## 📸 Capturas del Sistema

*(Espacio reservado para screenshots de la interfaz)*

---

Hecho con ❤️ para la música y la educación.
