# 📖 Glosario y Diccionario de Términos - Sistema Olivares

Este documento define los términos clave utilizados en el sistema para asegurar que todo el personal (docentes, administrativos y tecnicos) hable el mismo idioma.

---

## 🔑 Términos de Usuario y Acceso

*   **Administrador (Admin):** Usuario con permisos totales. Puede ver estadísticas globales, crear/eliminar personal, modificar horarios y generar reportes en PDF.
*   **Docente (Teacher):** Usuario con acceso limitado. Solo puede marcar su propia asistencia, ver su horario personal y enviar justificativos. No puede ver datos de otros compañeros.
*   **Credenciales:** El conjunto de Correo Electrónico y Contraseña necesarios para entrar al sistema.
*   **Sesión:** El tiempo que un usuario permanece "dentro" del sistema después de identificarse.

---

## ⏱️ Términos de Asistencia

*   **Check-in (Entrada):** Acción de registrar la llegada a la institución.
*   **Check-out (Salida):** Acción de registrar el fin de la jornada laboral.
*   **Tiempo de Tolerancia:** Margen de minutos (ej. 15 min) después de la hora oficial de inicio en los cuales el sistema aún considera que el profesor llegó "A tiempo".
*   **Retraso / Tarde:** Estado que asigna el sistema cuando el marcaje de entrada ocurre después del tiempo de tolerancia.
*   **Inasistencia / Ausencia:** Estado automático cuando el sistema no detecta ningún marcaje de entrada durante el día u horario programado.
*   **Reposición de Clase:** Marcaje de asistencia realizado fuera del horario habitual con el fin de recuperar una clase perdida anteriormente.

---

## 📄 Términos de Gestión

*   **Justificación:** Solicitud formal enviada por un docente para explicar una falta. Puede incluir motivos médicos, técnicos o personales.
*   **Estado de Solicitud:** 
    *   *Pendiente:* La justificación ha sido enviada pero el admin no la ha revisado.
    *   *Aprobada:* El admin aceptó el motivo y la falta se cuenta como "Justificada" en el reporte.
    *   *Rechazada:* El admin no aceptó el motivo; la falta sigue contando como inasistencia.
*   **Cátedra:** Nombre de la materia, instrumento o instancia académica (ej. Cátedra de Canto Lírico, Teoría y Solfeo).
*   **Horario Maestro:** La planificación central donde se cruzan profesores, días, horas y aulas.

---

## 🖥️ Términos Técnicos (Para el personal IT)

*   **Supabase:** La plataforma en la nube ("Backend") que aloja la base de datos y gestiona la seguridad y los archivos.
*   **RLS (Row Level Security):** Tecnología de "Seguridad a Nivel de Fila" que impide que un usuario vea datos que no le pertenecen directamente.
*   **Edge Function:** Un pequeño programa que corre en los servidores de Supabase para realizar tareas complejas, como crear nuevos usuarios o enviar correos, de forma segura.
*   **Storage (Almacenamiento):** Espacio en la nube donde se guardan físicamente las fotos y documentos PDF cargados por los usuarios.
*   **Tabla:** Estructura donde se organiza la información (similar a una hoja de cálculo).

---

## 📊 Términos de Reporte

*   **Cumplimiento:** Porcentaje que indica qué tanto se ha respetado el horario programado.
*   **Resumen Ejecutivo:** Cuadro estadístico que suma todos los movimientos del mes (total de asistencias, faltas y retrasos) para facilitar la toma de decisiones.
*   **PDF:** Formato de documento digital no modificable que genera el sistema para ser impreso o enviado por correo.

---
*Glosario de Términos - Enero 2026*
