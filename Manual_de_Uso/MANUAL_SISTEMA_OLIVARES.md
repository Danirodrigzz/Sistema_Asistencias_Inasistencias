# 📖 Guía de Administración - Sistema de Asistencia Conservatorio J.M. Olivares

Este documento está diseñado para el personal administrativo o directivo que estará a cargo del sistema. No requiere conocimientos de programación.

---

## 1. Acceso a la Base de Datos (Supabase)

El sistema utiliza **Supabase** como motor para guardar toda la información. Es como una hoja de Excel gigante pero inteligente y segura.

### Pasos para ingresar:
1. Ve a [https://supabase.com](https://supabase.com).
2. Toca en **"Sign In"** e ingresa con las credenciales del administrador (correo y contraseña).
3. Selecciona el proyecto llamado **"Sistema_Asistencia"**.
4. En la barra lateral izquierda, busca el icono de una tabla (denominado **"Table Editor"**).

---

## 2. Diccionario de Tablas (¿Qué se guarda en cada lugar?)

Aquí es donde vive la información del Conservatorio. Cada "tabla" es una categoría diferente:

### 👤 `faculty_members` (Directorio del Personal)
Es el listado de todos los profesores y administradores.
*   **id**: Código único del usuario.
*   **name**: Nombre completo del profesor.
*   **email**: Correo con el que inicia sesión.
*   **role**: Aquí dice si es `admin` (tiene control total) o `teacher` (solo ve su panel).
*   **chair**: Su cátedra principal (ej: Piano, Violín).
*   **phone**: Su número de contacto.

### 📝 `attendance` (Libro de Firmas)
Aquí se registran todos los marcajes de entrada y salida.
*   **check_in**: Fecha y hora exacta en la que el profesor tocó el botón de "Entrada".
*   **check_out**: Hora en la que marcó su salida.
*   **status**: El sistema decide automáticamente si fue `Presente`, `Tarde` o `Ausente`.

### 📄 `justifications` (Archivo de Justificativos)
Cuando un profesor falta y envía una justificación desde su móvil, llega aquí.
*   **absence_date**: El día que faltó.
*   **reason**: El motivo (ej: Reposo médico, falla eléctrica).
*   **status**: Usted como admin debe cambiar esto a `Aprobada` o `Rechazada` desde el dashboard.
*   **file_url**: Enlace al documento o foto que el profesor subió.

### 🎹 `academic_chairs` (Cátedras)
Listado de todas las materias o instrumentos que se enseñan.
*   **name**: Nombre de la cátedra.
*   **room**: El aula asignada por defecto.
*   **type**: Si es una clase `Individual`, `Grupal` o `Ensamble`.

### 🗓️ `master_schedule` (El Horario)
Es el rompecabezas de las clases. Aquí se conecta a cada profesor con su cátedra, día y hora.

### ⚙️ `system_settings` (Ajustes del Sistema)
Son las reglas del juego. Solo hay una fila aquí:
*   **institution_name**: El nombre que aparece en los reportes.
*   **tolerance_minutes**: Cuántos minutos de gracia tienen los profes antes de que el sistema marque "Tarde" (ej: 15 min).
*   **opening_time**: A qué hora abre el conservatorio.

---

## 3. Seguridad de los Datos (RLS)

El sistema tiene implementada una tecnología llamada **RLS (Row Level Security)**. 
*   **¿Qué significa?**: Que aunque un profesor logre entrar a la base de datos, el sistema "le tapa los ojos" para que solo pueda ver sus propios datos.
*   **Usted (Admin)**: Es el único que tiene la "Llave Maestra" para ver y editar los datos de todos.

---

## 4. Archivos Adjuntos (Storage)

Las fotos de los justificativos no se guardan como texto, sino en una "carpeta en la nube" llamada **Storage**. 
*   En el panel de Supabase, busque el icono de un cubo o caja (**"Storage"**).
*   Busque la carpeta `justifications`.
*   Ahí verá los archivos ordenados. Estos archivos son **privados**; nadie fuera del sistema puede verlos aunque tenga el enlace.

---

## 5. Recomendaciones de Uso

1.  **No borrar usuarios desde Supabase**: Utilice siempre el **Admin Dashboard** del sistema para borrar o crear personal. Esto asegura que se borren también sus horarios y asistencias de forma limpia.
2.  **Reportes PDF**: El sistema genera los reportes basados en la tabla `attendance`. Si un profesor olvidó marcar pero usted sabe que estuvo presente, puede editar su estado en la tabla `attendance` manualmente y el PDF saldrá corregido.
3.  **Cambio de Contraseñas**: Si un profesor olvida su clave, puede usar el botón de recuperación en la página de inicio.

---
*Manual generado automáticamente para la entrega del proyecto - Enero 2026*
