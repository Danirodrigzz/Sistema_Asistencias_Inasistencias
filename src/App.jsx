import React, { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  Users,
  Music,
  FileBox,
  Settings,
  Music2,
  Bell,
  TrendingUp,
  UserPlus,
  Calendar,
  ClipboardCheck,
  GraduationCap,
  Clock,
  QrCode,
  LogIn,
  LogOut,
  AlertCircle,
  CheckCircle2,
  FileUp,
  History,
  User,
  ChevronRight,
  Search,
  ArrowLeft,
  X,
  Plus,
  MoreVertical,
  Mail,
  Phone,
  Filter,
  Download,
  Trash2,
  Edit2,
  Save,
  Globe,
  BellRing,
  ShieldCheck,
  Smartphone,
  ChevronDown,
  Menu,
  Eye,
  EyeOff
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { supabase } from './lib/supabaseClient'

// --- Mock Data ---
const statsData = [
  { name: 'Lun', asistencia: 92 },
  { name: 'Mar', asistencia: 88 },
  { name: 'Mié', asistencia: 95 },
  { name: 'Jue', asistencia: 90 },
  { name: 'Vie', asistencia: 98 },
  { name: 'Sáb', asistencia: 85 },
];

const distributionData = [
  { name: 'Presente', value: 85, color: '#1B4332' },
  { name: 'Ausente', value: 8, color: '#991B1B' },
  { name: 'Tarde', value: 7, color: '#D47A4D' },
];

const attendanceHistory = [
  { id: 1, date: '2025-12-29', chair: 'Piano III', entry: '07:55 AM', exit: '09:30 AM', status: 'Presente' },
  { id: 2, date: '2025-12-27', chair: 'Teoría', entry: '10:05 AM', exit: '12:00 PM', status: 'Repuesta' },
  { id: 3, date: '2025-12-26', chair: 'Piano III', entry: '08:15 AM', exit: '09:30 AM', status: 'Tarde' },
  { id: 4, date: '2025-12-22', chair: 'Piano III', entry: '-', exit: '-', status: 'Ausente' },
];

const upcomingClasses = [
  { id: 1, day: 'Hoy', time: '04:00 PM', chair: 'Práctica Coral I', type: 'Grupal', students: 12 },
  { id: 2, day: 'Mañana', time: '08:00 AM', chair: 'Técnica de Piano II', type: 'Individual', students: 1 },
  { id: 3, day: 'Jueves', time: '10:00 AM', chair: 'Armonía Básica', type: 'Grupal', students: 8 },
];

const justifications = [
  { id: 1, professor: 'Elena Méndez', date: '2025-12-22', reason: 'Cita Médica - Oftalmología', status: 'Pendiente', file: 'comprobante_01.pdf' },
  { id: 2, professor: 'Luis Zambrano', date: '2025-12-15', reason: 'Falla Eléctrica en Sector', status: 'Pendiente', file: 'foto_evidencia.jpg' },
  { id: 3, professor: 'Carlos Rangel', date: '2025-12-29', reason: 'Congestión Vehicular', status: 'Aprobado', file: 'foto_trafico.jpg' },
];

const initialFacultyMembers = [
  { id: 1, name: 'Carlos Rangel', email: 'crangel@musica.ve', chair: 'Piano', phone: '+58 412 1234567', entry: '07:05 AM', exit: '12:00 PM', status: 'A tiempo', justified: '-' },
  { id: 2, name: 'Elena Méndez', email: 'emendez@musica.ve', chair: 'Violín', phone: '+58 424 7654321', entry: '07:25 AM', exit: '01:00 PM', status: 'Retraso', justified: 'Sí' },
  { id: 3, name: 'Luis Zambrano', email: 'lzambrano@musica.ve', chair: 'Teoría', phone: '+58 416 1112233', entry: '-', exit: '-', status: 'Ausente', justified: 'No' },
  { id: 4, name: 'Martha Colmenares', email: 'mcolmenares@musica.ve', chair: 'Canto', phone: '+58 414 9998877', entry: '08:00 AM', exit: '11:00 AM', status: 'A tiempo', justified: '-' },
];

const initialAcademicChairs = [
  { id: 1, name: 'Cátedra de Piano', room: '101', type: 'Individual', faculty: 12, students: 45 },
  { id: 2, name: 'Cátedra de Violín', room: '102', type: 'Individual', faculty: 8, students: 32 },
  { id: 3, name: 'Teoría y Solfeo', room: '201', type: 'Grupal', faculty: 4, students: 120 },
  { id: 4, name: 'Orquesta de Niños', room: 'Auditorio', type: 'Grupal', faculty: 2, students: 60 },
];

// Helper: Foolproof 12h clock formatter
const formatTime12h = (date) => {
  if (!date) return "00:00:00 --";
  const d = typeof date === 'string' ? new Date(date) : date;
  if (!(d instanceof Date) || isNaN(d.getTime())) return "00:00:00 --";

  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  const s = String(d.getSeconds()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${String(h).padStart(2, '0')}:${m}:${s} ${ampm}`;
};

const formatTime12hShort = (date) => {
  if (!date) return "-";
  const d = typeof date === 'string' ? new Date(date) : date;
  if (!(d instanceof Date) || isNaN(d.getTime())) return "-";
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${String(h).padStart(2, '0')}:${m} ${ampm}`;
};

// Helper: Safe date formatter (Manual to avoid system locale flickers)
const formatDateVE = (isoStr) => {
  if (!isoStr) return "-";
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (e) {
    return isoStr;
  }
};

const getLongDateVE = (date) => {
  if (!date || isNaN(date.getTime())) return "";
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
};

// --- Components ---

const LoginPage = ({ onLogin }) => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Validar formato antes de intentar en Supabase
      const isActuallyAdmin = email.toLowerCase().includes('admin');

      if (isAdminMode && !isActuallyAdmin) {
        throw new Error('Solo cuentas de administrador pueden usar este acceso.');
      }

      if (!isAdminMode && isActuallyAdmin) {
        throw new Error('Esta cuenta es de administrador. Por favor usa el acceso de Administrador.');
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Doble verificación de rol al entrar
      const role = data.user.email.toLowerCase().includes('admin') ? 'admin' : 'teacher';

      // Si el rol detectado no coincide con el modo seleccionado, cerramos sesión inmediatamente
      if ((isAdminMode && role !== 'admin') || (!isAdminMode && role !== 'teacher')) {
        await supabase.auth.signOut();
        throw new Error('No tienes permisos suficientes para este panel.');
      }

      onLogin(role);
    } catch (err) {
      setError(err.message === 'Invalid login credentials' ? 'Credenciales inválidas' : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <motion.div
        key={isAdminMode ? 'admin' : 'teacher'}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="auth-card"
      >
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: isAdminMode ? 'rgba(27, 67, 50, 0.1)' : 'rgba(212, 122, 77, 0.1)',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 8px 16px rgba(0,0,0,0.05)'
          }}>
            <Music2 size={40} className={isAdminMode ? 'text-forest' : 'text-terracotta'} />
          </div>
          <h1 className="brand-font" style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
            {isAdminMode ? 'Directivo' : 'Conservatorio'}
          </h1>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>
            {isAdminMode ? 'Portal de Gestión Administrativa' : 'Sistema de Asistencia Docente'}
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(153, 27, 27, 0.1)',
              color: '#991B1B',
              padding: '0.8rem',
              borderRadius: '12px',
              fontSize: '0.85rem',
              marginBottom: '1.5rem',
              textAlign: 'center',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <AlertCircle size={16} /> {error}
          </motion.div>
        )}

        <div className="input-group">
          <label>Correo Electrónico</label>
          <input
            type="text"
            placeholder={isAdminMode ? 'Correo de Administrador' : 'Correo de Profesor'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="input-group">
          <label>Contraseña</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              style={{ paddingRight: '3.5rem' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button
          className="btn-primary"
          style={{
            width: '100%',
            marginBottom: '1rem',
            background: isAdminMode ? 'var(--secondary)' : 'var(--primary)',
            boxShadow: isAdminMode ? '0 4px 12px rgba(27, 67, 50, 0.3)' : '0 4px 12px rgba(212, 122, 77, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
          onClick={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }}
            />
          ) : 'Iniciar Sesión'}
        </button>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => setIsAdminMode(!isAdminMode)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '0.875rem',
              color: isAdminMode ? 'var(--primary)' : 'var(--secondary)',
              textDecoration: 'none',
              cursor: 'pointer',
              fontWeight: 600
            }}
            disabled={loading}
          >
            {isAdminMode ? 'Regresar a Login de Profesor' : '¿Eres administrador? Ingresa aquí'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const TeacherDashboard = ({ onLogout, user }) => {
  const [activeTab, setActiveTab] = useState('attendance');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [time, setTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  // Real Data States
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [mySchedule, setMySchedule] = useState([]);
  const [myAttendance, setMyAttendance] = useState([]);
  const [myJustifications, setMyJustifications] = useState([]);
  const [alreadyCheckedOutToday, setAlreadyCheckedOutToday] = useState(false);

  const [scheduleSearch, setScheduleSearch] = useState('');
  const [scheduleTypeFilter, setScheduleTypeFilter] = useState('Todos');
  const [showScheduleFilter, setShowScheduleFilter] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [historyStatusFilter, setHistoryStatusFilter] = useState('Todos');
  const [showHistoryFilter, setShowHistoryFilter] = useState(false);
  const [showJustifyChair, setShowJustifyChair] = useState(false);
  const [justificationChair, setJustificationChair] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [justificationDate, setJustificationDate] = useState('');
  const [justificationReason, setJustificationReason] = useState('');
  const [justificationFile, setJustificationFile] = useState(null);
  const [submittingJustification, setSubmittingJustification] = useState(false);

  const showNotification = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchTeacherData = async () => {
    try {
      setLoading(true);
      const { data: { user: sessionUser } } = await supabase.auth.getUser();
      if (!sessionUser) {
        setLoading(false);
        return;
      }

      // 1. Profile - Búsqueda robusta por ID o Email (ilike para evitar problemas de mayúsculas)
      const { data: profile, error: pError } = await supabase
        .from('faculty_members')
        .select('*')
        .or(`id.eq.${sessionUser.id},email.ilike.${sessionUser.email}`)
        .maybeSingle();

      if (pError) console.error('Error fetching profile:', pError);

      if (!profile) {
        console.warn('No faculty record found for email:', sessionUser.email);
        setTeacherProfile(null);
        setLoading(false);
        return;
      }

      setTeacherProfile(profile);

      // 2. Schedule
      const { data: schedule, error: sError } = await supabase
        .from('master_schedule')
        .select('*, academic_chairs(name, type, room)')
        .eq('faculty_id', profile.id);

      if (sError) console.error('Error schedule:', sError);

      const formattedSchedule = (schedule || []).map(s => ({
        id: s.id,
        day: s.day,
        time: s.time,
        chair: s.academic_chairs?.name || 'Cátedra desconocida',
        type: s.academic_chairs?.type || 'N/A',
        room: s.room || s.academic_chairs?.room || 'Sin aula'
      }));
      setMySchedule(formattedSchedule);

      // 3. Attendance
      const { data: attendance, error: attError } = await supabase
        .from('attendance')
        .select('*')
        .eq('faculty_id', profile.id)
        .order('check_in', { ascending: false });

      if (attError) console.error('Error attendance:', attError);

      if (attendance && attendance.length > 0) {
        const lastEntry = attendance[0];
        const lastEntryDate = new Date(lastEntry.check_in).toDateString();
        const todayDate = new Date().toDateString();

        if (lastEntryDate === todayDate && lastEntry.check_out) {
          setAlreadyCheckedOutToday(true);
          setIsCheckedIn(false);
        } else if (!lastEntry.check_out) {
          setIsCheckedIn(true);
          setAlreadyCheckedOutToday(false);
        } else {
          setIsCheckedIn(false);
          setAlreadyCheckedOutToday(false);
        }
      } else {
        setIsCheckedIn(false);
        setAlreadyCheckedOutToday(false);
      }

      const formattedHistory = (attendance || []).map(a => ({
        id: a.id,
        date: formatDateVE(a.check_in),
        chair: 'Clase Registrada',
        entry: formatTime12hShort(a.check_in),
        exit: formatTime12hShort(a.check_out),
        status: a.status || 'Presente'
      }));
      setMyAttendance(formattedHistory);

      // 4. Justifications
      const { data: justs, error: jError } = await supabase
        .from('justifications')
        .select('*')
        .eq('faculty_id', profile.id);

      if (jError) console.error('Error justifications:', jError);
      setMyJustifications(justs || []);
    } catch (error) {
      console.error('Error fetching teacher data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!teacherProfile) return;

    try {
      if (!isCheckedIn) {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        // 1. Buscar si el profesor tiene clases HOY para comparar la hora
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const todayName = days[now.getDay()];

        // Buscamos la primera clase del día para este profesor
        const todaysClasses = mySchedule.filter(s => s.day === todayName);

        let status = 'Presente';
        let statusReason = 'Sin clases para hoy';

        if (todaysClasses.length > 0) {
          // Ordenar clases por hora para obtener la primera del día
          const sortedClasses = todaysClasses.sort((a, b) => {
            const parseTime = (t) => {
              const [time, modifier] = t.split(' ');
              let [hours, minutes] = time.split(':').map(Number);
              if (modifier === 'PM' && hours !== 12) hours += 12;
              if (modifier === 'AM' && hours === 12) hours = 0;
              return hours * 60 + minutes;
            };
            return parseTime(a.time) - parseTime(b.time);
          });

          if (sortedClasses.length > 0) {
            // Tomar la primera clase del día (la más temprana)
            const firstClass = sortedClasses[0];
            const [timePart, ampm] = firstClass.time.split(' ');
            let [schedHour, schedMin] = timePart.split(':').map(Number);

            if (ampm === 'PM' && schedHour !== 12) schedHour += 12;
            if (ampm === 'AM' && schedHour === 12) schedHour = 0;

            const totalSchedMinutes = (schedHour * 60) + schedMin + 15;
            const totalNowMinutes = (currentHour * 60) + currentMinute;

            if (totalNowMinutes > totalSchedMinutes) {
              status = 'Tarde';
              statusReason = `Llegada después de las ${firstClass.time}`;

              // --- DISPARAR ALERTA SMS (Sin bloquear el flujo principal) ---
              // Obtenemos token si es necesario, o llamamos directo si es pública/SERVICE_ROLE (mejor usar token de usuario)
              supabase.auth.getSession().then(({ data: { session } }) => {
                const token = session?.access_token;
                const functionUrl = `${supabase.supabaseUrl}/functions/v1/send-sms-alert`;

                fetch(functionUrl, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({
                    teacherName: teacherProfile.name,
                    status: 'Tarde',
                    time: formatTime12hShort(now),
                    details: statusReason
                  })
                }).then(res => res.json())
                  .then(data => console.log("Alerta SMS resultado:", data))
                  .catch(err => console.error("Error enviando alerta SMS:", err));
              });
              // -----------------------------------------------------------

            } else {
              statusReason = 'Llegada a tiempo';
            }
          }
        }
        console.log(`[DEBUG] Clases hoy: ${todaysClasses.length}, Status: ${status}, Motivo: ${statusReason}`);

        const { error } = await supabase.from('attendance').insert([
          {
            faculty_id: teacherProfile.id,
            status: status,
            check_in: now.toISOString()
          }
        ]);
        if (error) throw error;
        setIsCheckedIn(true);
        showNotification(`Entrada marcada: ${formatTime12hShort(now)} - Estado: ${status}`);
      } else {
        const { error } = await supabase
          .from('attendance')
          .update({ check_out: new Date().toISOString() })
          .eq('faculty_id', teacherProfile.id)
          .is('check_out', null);

        if (error) throw error;
        setIsCheckedIn(false);
        showNotification(`Salida marcada: ${formatTime12hShort(new Date())}`);
      }
      fetchTeacherData();
    } catch (error) {
      alert('Error al marcar asistencia: ' + error.message);
    }
  };

  const handleJustificationSubmit = async () => {
    if (!justificationDate || !justificationChair || !justificationReason) {
      showNotification('Por favor complete todos los campos obligatorios', 'error');
      return;
    }

    setSubmittingJustification(true);
    try {
      let fileUrl = null;

      if (justificationFile) {
        const fileExt = justificationFile.name.split('.').pop();
        const fileName = `${teacherProfile.id}-${Date.now()}.${fileExt}`;
        const filePath = `justifications/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('justifications')
          .upload(filePath, justificationFile);

        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          // Continuamos sin archivo si falla la subida? O alertamos? 
          // Mejor alertar para que el docente sepa que el comprobante es importante.
          if (uploadError.message.includes('bucket not found')) {
            console.log('Bucket "justifications" no existe, guardando solo la data.');
          } else {
            throw new Error('Error al subir el comprobante: ' + uploadError.message);
          }
        } else {
          fileUrl = filePath; // Guardamos solo la ruta para generar Signed URLs después
        }
      }

      const { error } = await supabase.from('justifications').insert([
        {
          faculty_id: teacherProfile.id,
          date: justificationDate, // Campo requerido por la BD
          absence_date: justificationDate,
          chair: justificationChair,
          reason: justificationReason,
          status: 'Pendiente',
          file_url: fileUrl
        }
      ]);

      if (error) throw error;

      showNotification('Justificación enviada correctamente');
      setJustificationDate('');
      setJustificationChair('');
      setJustificationReason('');
      setJustificationFile(null);
      fetchTeacherData(); // Recargar lista
    } catch (error) {
      showNotification('Error al enviar: ' + error.message, 'error');
    } finally {
      setSubmittingJustification(false);
    }
  };

  const handleViewFile = async (path) => {
    if (!path) return;
    if (path.startsWith('http')) {
      window.open(path, '_blank');
      return;
    }
    const { data, error } = await supabase.storage
      .from('justifications')
      .createSignedUrl(path, 60);
    if (error) {
      console.error('Error:', error);
      alert('Enlace expirado o inválido');
      return;
    }
    window.open(data.signedUrl, '_blank');
  };

  const handleReposicion = () => {
    showNotification('Iniciando sesión de reposición de clase', 'info');
    setIsCheckedIn(true);
  };

  useEffect(() => {
    fetchTeacherData();
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'attendance':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <section className="attendance-hero">
              <div style={{ maxWidth: '600px' }}>
                <p style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  Hora del Servidor
                </p>
                <div className="clock-display">
                  {formatTime12h(time)}
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                  {alreadyCheckedOutToday ? (
                    <div className="card" style={{ background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', flex: 1, textAlign: 'center', padding: '1rem', color: 'white' }}>
                      <p style={{ fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <CheckCircle2 size={24} /> Asistencia del día completada
                      </p>
                    </div>
                  ) : (
                    <>
                      {!isCheckedIn ? (
                        <button
                          className="btn-primary"
                          style={{ padding: '1rem 2rem', fontSize: '1rem', flex: '1', minWidth: '200px' }}
                          onClick={handleCheckIn}
                        >
                          Marcar Entrada
                        </button>
                      ) : (
                        <button
                          className="btn-primary"
                          style={{ background: 'var(--danger)', padding: '1rem 2rem', fontSize: '1rem', flex: '1', minWidth: '200px' }}
                          onClick={handleCheckIn}
                        >
                          Marcar Salida
                        </button>
                      )}
                      <button
                        className="btn-outline"
                        style={{ borderColor: 'white', color: 'white', padding: '1rem 2rem', flex: '1', minWidth: '200px' }}
                        onClick={handleReposicion}
                      >
                        Marcar como Reposición
                      </button>
                    </>
                  )}
                </div>
              </div>
            </section>

            <div className="grid-cols-2">
              <div className="card">
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <GraduationCap className="text-terracotta" /> Resumen de Hoy
                </h3>
                {mySchedule.length > 0 ? (
                  <div style={{ background: 'var(--bg-cream)', padding: '1.5rem', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <span className="badge badge-success">{mySchedule[0].type}</span>
                      <span className="text-muted">{mySchedule[0].time}</span>
                    </div>
                    <p style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>{mySchedule[0].chair}</p>
                    <p className="text-muted">Aula: {mySchedule[0].room}</p>
                  </div>
                ) : (
                  <p className="text-muted">No tienes clases asignadas para hoy.</p>
                )}
              </div>

              <div className="card">
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle className="text-warning" /> Alertas Pendientes
                </h3>
                {myAttendance.filter(a => a.status === 'Ausente').length > 0 ? (
                  <div className="glass" style={{ border: '1px solid var(--warning)', padding: '1rem', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ background: 'rgba(180, 83, 9, 0.1)', padding: '0.75rem', borderRadius: '10px' }}>
                      <FileUp className="text-warning" />
                    </div>
                    <div>
                      <p style={{ fontWeight: 600 }}>Inasistencia detectada</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Requiere justificación técnica</p>
                    </div>
                    <button className="btn-primary" style={{ marginLeft: 'auto', padding: '0.5rem 1rem', fontSize: '0.8rem' }} onClick={() => setActiveTab('justifications')}>Justificar</button>
                  </div>
                ) : (
                  <p className="text-muted" style={{ fontSize: '0.9rem' }}>No tienes alertas pendientes. ¡Buen trabajo!</p>
                )}
              </div>
            </div>
          </motion.div>
        );
      case 'history':
        const filteredHistory = myAttendance.filter(h => {
          const matchesSearch = h.chair.toLowerCase().includes(historySearch.toLowerCase()) ||
            h.date.includes(historySearch);
          const matchesStatus = historyStatusFilter === 'Todos' || h.status === historyStatusFilter;
          return matchesSearch && matchesStatus;
        });

        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="section-header-mobile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 className="brand-font" style={{ fontSize: '2.5rem', margin: 0 }}>Mi Historial</h2>
              <div style={{ display: 'flex', gap: '1rem', flex: '1', justifyContent: 'flex-end', minWidth: '300px' }}>
                <div className="search-bar-premium" style={{ maxWidth: '350px' }}>
                  <Search size={20} className="text-terracotta" />
                  <input
                    type="text"
                    placeholder="Buscar por fecha o cátedra..."
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                  />
                </div>

                {/* Custom History Status Filter */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowHistoryFilter(!showHistoryFilter)}
                    className="custom-select-button"
                    style={{ minWidth: '180px', padding: '0.8rem 1.2rem' }}
                  >
                    <span>{historyStatusFilter === 'Todos' ? 'Estados' : historyStatusFilter}</span>
                    <ChevronDown size={18} style={{ transform: showHistoryFilter ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                  </button>

                  <AnimatePresence>
                    {showHistoryFilter && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 5 }}
                        exit={{ opacity: 0, y: 10 }}
                        style={{
                          position: 'absolute',
                          top: '100%',
                          right: 0,
                          background: 'white',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                          border: '1px solid rgba(0,0,0,0.05)',
                          zIndex: 100,
                          padding: '0.4rem',
                          minWidth: '200px'
                        }}
                      >
                        {['Todos', 'Presente', 'Ausente', 'Tarde', 'Repuesta'].map(status => (
                          <button
                            key={status}
                            onClick={() => {
                              setHistoryStatusFilter(status);
                              setShowHistoryFilter(false);
                            }}
                            style={{
                              width: '100%',
                              padding: '0.75rem 1rem',
                              border: 'none',
                              background: historyStatusFilter === status ? 'rgba(212, 122, 77, 0.08)' : 'none',
                              color: historyStatusFilter === status ? 'var(--primary)' : 'var(--text-main)',
                              borderRadius: '8px',
                              textAlign: 'left',
                              cursor: 'pointer',
                              fontSize: '0.9rem',
                              fontWeight: historyStatusFilter === status ? 700 : 500
                            }}
                          >
                            {status === 'Todos' ? 'Todos los Estados' : status}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="card animate-fade">
              <div className="table-responsive">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', color: 'var(--text-muted)', borderBottom: '1px solid #eee' }}>
                      <th style={{ padding: '1rem' }}>Fecha</th>
                      <th style={{ padding: '1rem' }}>Cátedra</th>
                      <th style={{ padding: '1rem' }}>Entrada</th>
                      <th style={{ padding: '1rem' }}>Salida</th>
                      <th style={{ padding: '1rem' }}>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.map(h => (
                      <tr key={h.id} style={{ borderBottom: '1px solid #fafafa' }}>
                        <td style={{ padding: '1rem', fontWeight: 600 }}>{h.date}</td>
                        <td style={{ padding: '1rem' }}>{h.chair}</td>
                        <td style={{ padding: '1rem', fontWeight: 700 }}>{h.entry}</td>
                        <td style={{ padding: '1rem', fontWeight: 700 }}>{h.exit}</td>
                        <td style={{ padding: '1rem' }}>
                          <span className={`badge ${h.status === 'Presente' || h.status === 'A tiempo' ? 'badge-success' :
                            h.status === 'Retraso' || h.status === 'Tarde' ? 'badge-warning' : 'badge-danger'}`}>
                            {h.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredHistory.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  <Search size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                  <p>No se encontraron registros de asistencia.</p>
                </div>
              )}
            </div>
          </motion.div>
        );
      case 'schedule':
        const filteredSchedule = mySchedule.filter(c => {
          const matchesSearch = c.chair.toLowerCase().includes(scheduleSearch.toLowerCase());
          const matchesType = scheduleTypeFilter === 'Todos' || c.type === scheduleTypeFilter;
          return matchesSearch && matchesType;
        });

        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="section-header-mobile" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              <h2 className="brand-font" style={{ fontSize: '2.5rem', margin: 0 }}>Próximas Clases</h2>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', flex: '1', justifyContent: 'flex-end', minWidth: '300px' }}>
                <div className="search-bar-premium" style={{ maxWidth: '350px' }}>
                  <Search size={20} className="text-forest" />
                  <input
                    type="text"
                    placeholder="Buscar cátedra..."
                    value={scheduleSearch}
                    onChange={(e) => setScheduleSearch(e.target.value)}
                  />
                </div>

                {/* Custom Schedule Type Filter */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowScheduleFilter(!showScheduleFilter)}
                    className="custom-select-button"
                    style={{ minWidth: '180px', padding: '0.8rem 1.2rem' }}
                  >
                    <span>{scheduleTypeFilter === 'Todos' ? 'Modalidades' : scheduleTypeFilter}</span>
                    <ChevronDown size={18} style={{ transform: showScheduleFilter ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                  </button>

                  <AnimatePresence>
                    {showScheduleFilter && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 5 }}
                        exit={{ opacity: 0, y: 10 }}
                        style={{
                          position: 'absolute',
                          top: '100%',
                          right: 0,
                          background: 'white',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                          border: '1px solid rgba(0,0,0,0.05)',
                          zIndex: 100,
                          padding: '0.4rem',
                          minWidth: '220px'
                        }}
                      >
                        {['Todos', 'Individual', 'Grupal'].map(type => (
                          <button
                            key={type}
                            onClick={() => {
                              setScheduleTypeFilter(type);
                              setShowScheduleFilter(false);
                            }}
                            style={{
                              width: '100%',
                              padding: '0.75rem 1rem',
                              border: 'none',
                              background: scheduleTypeFilter === type ? 'rgba(212, 122, 77, 0.08)' : 'none',
                              color: scheduleTypeFilter === type ? 'var(--primary)' : 'var(--text-main)',
                              borderRadius: '8px',
                              textAlign: 'left',
                              cursor: 'pointer',
                              fontSize: '0.9rem',
                              fontWeight: scheduleTypeFilter === type ? 700 : 500
                            }}
                          >
                            {type === 'Todos' ? 'Todas las Modalidades' : type}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="grid-cols-3">
              {filteredSchedule.map(c => (
                <div key={c.id} className="card" style={{ borderTop: '4px solid var(--primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <span className="badge badge-success" style={{ background: 'rgba(27, 67, 50, 0.05)' }}>{c.day}</span>
                    <Clock size={20} className="text-muted" />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{c.time}</h3>
                  <p style={{ fontWeight: 700, color: 'var(--secondary)', marginBottom: '1rem' }}>{c.chair}</p>
                  <hr style={{ border: 'none', borderTop: '1px solid #eee', marginBottom: '1.5rem' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span className="text-muted">Tipo: <strong>{c.type}</strong></span>
                    <span className="text-muted">Salón: <strong>{c.room}</strong></span>
                  </div>
                </div>
              ))}
            </div>

            {filteredSchedule.length === 0 && (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                <Calendar size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                <p>No se encontraron clases programadas</p>
              </div>
            )}
          </motion.div>
        );
      case 'justifications':
        return (
          <div style={{ paddingBottom: '2rem' }}>
            <h2 className="brand-font" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Mis Justificaciones</h2>
            <div className="grid-cols-2" style={{ gap: '2rem' }}>
              <div className="card">
                <h3 style={{ marginBottom: '1.5rem' }}>Nueva Solicitud</h3>
                <div className="input-group">
                  <label>Fecha de Ausencia</label>
                  <div className="date-input-wrapper">
                    <Calendar className="calendar-icon" size={20} />
                    <input
                      type="date"
                      value={justificationDate}
                      onChange={(e) => setJustificationDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label>Cátedra</label>
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setShowJustifyChair(!showJustifyChair)}
                      className="custom-select-button"
                    >
                      <span>{justificationChair || 'Seleccionar Cátedra'}</span>
                      <ChevronDown size={22} style={{ color: 'var(--primary)', transform: showJustifyChair ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                    </button>
                    <AnimatePresence>
                      {showJustifyChair && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            background: 'white',
                            borderRadius: '16px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                            zIndex: 100,
                            marginTop: '0.5rem',
                            padding: '0.5rem',
                            border: '1px solid rgba(0,0,0,0.05)'
                          }}
                        >
                          {Array.from(new Set((mySchedule || []).map(s => s?.chair).filter(Boolean))).map(c => (
                            <button
                              key={c}
                              onClick={() => {
                                setJustificationChair(c);
                                setShowJustifyChair(false);
                              }}
                              style={{
                                width: '100%',
                                padding: '0.8rem 1rem',
                                border: 'none',
                                background: justificationChair === c ? 'rgba(212, 122, 77, 0.08)' : 'none',
                                color: justificationChair === c ? 'var(--primary)' : 'var(--text-main)',
                                borderRadius: '10px',
                                textAlign: 'left',
                                cursor: 'pointer',
                                fontSize: '0.95rem',
                                fontWeight: justificationChair === c ? 700 : 500
                              }}
                            >
                              {c}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <div className="input-group">
                  <label>Motivo / Explicación</label>
                  <textarea
                    rows="3"
                    value={justificationReason}
                    onChange={(e) => setJustificationReason(e.target.value)}
                    placeholder="Describe el motivo de la inasistencia..."
                    style={{
                      width: '100%',
                      padding: '1rem',
                      borderRadius: '16px',
                      border: '2px solid #f0f0f0',
                      outline: 'none',
                      fontFamily: 'inherit',
                      fontSize: '0.95rem',
                      resize: 'none'
                    }}
                  />
                </div>
                <div className="input-group">
                  <label>Comprobante (Opcional)</label>
                  <div
                    style={{
                      border: '2px dashed #ddd',
                      padding: '1.5rem',
                      borderRadius: '16px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: justificationFile ? '#f0f9ff' : 'transparent',
                      borderColor: justificationFile ? 'var(--primary)' : '#ddd',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => document.getElementById('justificationFile').click()}
                  >
                    <FileUp size={24} className={justificationFile ? 'text-terracotta' : 'text-muted'} />
                    <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                      {justificationFile ? justificationFile.name : 'Subir PDF o Foto'}
                    </p>
                    <input
                      id="justificationFile"
                      type="file"
                      hidden
                      onChange={(e) => setJustificationFile(e.target.files[0])}
                    />
                  </div>
                </div>
                <button
                  className="btn-primary"
                  style={{ width: '100%', opacity: submittingJustification ? 0.7 : 1 }}
                  onClick={handleJustificationSubmit}
                  disabled={submittingJustification}
                >
                  {submittingJustification ? 'Enviando...' : 'Enviar Justificación'}
                </button>
              </div>
              <div className="card">
                <h3 style={{ marginBottom: '1.5rem' }}>Estados de Trámite</h3>
                {(myJustifications && myJustifications.length > 0) ? (
                  <div className="table-responsive">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #f8f8f8' }}>
                          <th style={{ padding: '0.75rem 0.5rem' }}>Fecha</th>
                          <th style={{ padding: '0.75rem 0.5rem' }}>Cátedra</th>
                          <th style={{ padding: '0.75rem 0.5rem' }}>Estado</th>
                          <th style={{ padding: '0.75rem 0.5rem' }}>Detalle</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myJustifications.map(j => (
                          <tr key={j?.id} style={{ borderBottom: '1px solid #fafafa' }}>
                            <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>
                              {j?.absence_date ? new Date(j.absence_date + 'T12:00:00').toLocaleDateString('es-VE') : '-'}
                            </td>
                            <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600, color: 'var(--secondary)' }}>{j?.chair || '-'}</td>
                            <td style={{ padding: '0.75rem 0.5rem' }}>
                              <span className={`badge ${(j?.status || '').toLowerCase().includes('aprob') ? 'badge-success' :
                                (j?.status || '').toLowerCase().includes('rechaz') ? 'badge-danger' :
                                  'badge-warning'}`}>{j?.status || 'Pendiente'}</span>
                            </td>
                            <td style={{ padding: '0.75rem 0.5rem' }}>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {j?.file_url && (
                                  <button
                                    onClick={() => handleViewFile(j.file_url)}
                                    style={{ background: 'none', border: 'none', padding: 0, color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                  >
                                    <FileUp size={16} title="Ver adjunto" />
                                  </button>
                                )}
                                <span className="text-muted" style={{ fontSize: '0.8rem' }} title={j?.reason}>Ver motivo</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted">No tienes solicitudes enviadas.</p>
                )}
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="layout">
      {/* Mobile Menu Button - Teacher */}
      <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
        <Menu size={24} />
      </button>

      {/* Overlay for Mobile Sidebar */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? 'visible' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3.5rem' }}>
          <div className="logo-container" style={{ marginBottom: 0 }}>
            <Music2 size={32} color="var(--primary)" />
            <div>
              <span className="logo-text" style={{ fontSize: '1.2rem', display: 'block' }}>J. M. Olivares</span>
              <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Docente</span>
            </div>
          </div>
          <button
            className="mobile-menu-btn"
            onClick={() => setIsSidebarOpen(false)}
            style={{ display: 'flex', position: 'static', background: 'none', border: 'none', color: 'white' }}
          >
            <X size={24} />
          </button>
        </div>
        <nav>
          <a href="#" className={`nav-link ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => { setActiveTab('attendance'); setIsSidebarOpen(false); }}>
            <Clock size={20} /> Asistencia
          </a>
          <a href="#" className={`nav-link ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => { setActiveTab('schedule'); setIsSidebarOpen(false); }}>
            <Calendar size={20} /> Próximas Clases
          </a>
          <a href="#" className={`nav-link ${activeTab === 'justifications' ? 'active' : ''}`} onClick={() => { setActiveTab('justifications'); setIsSidebarOpen(false); }}>
            <FileUp size={20} /> Justificaciones
          </a>
          <a href="#" className={`nav-link ${activeTab === 'history' ? 'active' : ''}`} onClick={() => { setActiveTab('history'); setIsSidebarOpen(false); }}>
            <History size={20} /> Mi Historial
          </a>
          <div style={{ marginTop: 'auto' }}>
            <a href="#" className="nav-link" onClick={() => setShowLogoutModal(true)}>
              <LogOut size={20} /> Salir
            </a>
          </div>
        </nav>
      </aside>

      <main className="main-content">
        <header className="dashboard-header" style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ minWidth: '250px' }}>
            <p className="text-muted" style={{ fontWeight: 600 }}>Bienvenido de nuevo</p>
            <h1 className="brand-font" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', margin: 0 }}>
              {loading ? 'Inicializando...' :
                teacherProfile ? `Prof. ${teacherProfile.name}` :
                  'Usuario no registrado en Personal Docente'}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Clock for Teacher - Hidden on mobile if in attendance tab to avoid duplication */}
            <div className={`glass header-clock ${activeTab === 'attendance' ? 'desktop-only' : ''}`} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              padding: '0.6rem 1.25rem',
              borderRadius: '14px',
              border: '1px solid rgba(0,0,0,0.05)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              background: 'rgba(255,255,255,0.4)'
            }}>
              <Clock size={20} className="text-terracotta" />
              <div style={{ textAlign: 'right' }}>
                <span className="clock-stabilized" style={{ display: 'block', fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1, fontFamily: "'Outfit', sans-serif" }}>
                  {formatTime12h(time)}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                  {getLongDateVE(time)}
                </span>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1.5rem', height: 'fit-content' }}>
              <Bell size={20} className="text-muted" />
              <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <User size={24} />
              </div>
            </div>
          </div>
        </header>
        {!loading && !teacherProfile ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
            <AlertCircle size={48} className="text-warning" style={{ margin: '0 auto 1.5rem' }} />
            <h2 className="brand-font">Acceso Limitado</h2>
            <p className="text-muted" style={{ maxWidth: '500px', margin: '1rem auto' }}>
              Tu cuenta de correo <strong>{user?.email || 'No identificado'}</strong> no está vinculada a ningún registro en la tabla de <strong>Personal Docente</strong>.
              Por favor, contacta al administrador para que te asigne una cátedra y active tu perfil.
            </p>
            <button className="btn-primary" onClick={onLogout} style={{ marginTop: '2rem' }}>Cerrar Sesión</button>
          </div>
        ) : loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem', gap: '1.5rem' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ width: '40px', height: '40px', border: '3px solid rgba(212,122,77,0.2)', borderTopColor: 'var(--primary)', borderRadius: '50%' }} />
            <p className="text-muted" style={{ fontWeight: 600 }}>Cargando perfil docente...</p>
          </div>
        ) : (
          renderContent()
        )}
      </main>

      <AnimatePresence>
        {showLogoutModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="card" style={{ maxWidth: '440px', width: '90%', margin: 'auto', textAlign: 'center', padding: '2.5rem', boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}>
              <div style={{ background: 'rgba(212, 122, 77, 0.1)', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <LogOut size={32} className="text-terracotta" />
              </div>
              <h3 className="brand-font" style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>¿Cerrar Sesión?</h3>
              <p className="text-muted" style={{ marginBottom: '2rem' }}>Asegúrate de haber marcado tu salida antes de retirarte del sistema.</p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button className="btn-primary" style={{ flex: 1, minWidth: '120px' }} onClick={onLogout}>Cerrar Sesión</button>
                <button className="btn-outline" style={{ flex: 1, minWidth: '120px' }} onClick={() => setShowLogoutModal(false)}>Cancelar</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              background: toast.type === 'info' ? 'var(--secondary)' : '#1B4332',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '16px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              fontWeight: 600,
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <CheckCircle2 size={20} />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div >
  );
};

const AdminDashboard = ({ onLogout, user }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [showAddFacultyModal, setShowAddFacultyModal] = useState(false);
  const [facultySearch, setFacultySearch] = useState('');
  const [facultyStatusFilter, setFacultyStatusFilter] = useState('Todos');
  const [showActionsMenu, setShowActionsMenu] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [showDeleteChairModal, setShowDeleteChairModal] = useState(null);
  const [showChairTypeDropdown, setShowChairTypeDropdown] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [editingChair, setEditingChair] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [chairSearch, setChairSearch] = useState('');
  const [chairTypeFilter, setChairTypeFilter] = useState('Todos');
  const [showChairFilterDropdown, setShowChairFilterDropdown] = useState(false);
  const [toast, setToast] = useState(null);
  const [settingsTab, setSettingsTab] = useState('General');
  const [showProfDropdown, setShowProfDropdown] = useState(false);
  const [showChairDropdownModal, setShowChairDropdownModal] = useState(false);
  const [showDayDropdown, setShowDayDropdown] = useState(false);
  const [showFacultyChair, setShowFacultyChair] = useState(false);
  const [showFacultyStatus, setShowFacultyStatus] = useState(false);
  const [showFacultyJustified, setShowFacultyJustified] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    role: 'teacher',
    password: '',
    phone: '',
    chair: ''
  });
  const [systemSettings, setSystemSettings] = useState({
    institutionName: 'Conservatorio de Música Juan Manuel Olivares',
    openingTime: '07:00',
    tolerance: '15',
    notificationsEnabled: true,
    backupEmail: 'sistemas@olivares.edu.ve'
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  const [chairsViewMode, setChairsViewMode] = useState('list');
  const [facultyViewMode, setFacultyViewMode] = useState('list');
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('Todos');
  const [showUserRoleDropdown, setShowUserRoleDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [academicChairs, setAcademicChairs] = useState([]);
  const [masterSchedule, setMasterSchedule] = useState([]);
  const [justificationsList, setJustificationsList] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    attendancePct: 0,
    delays: 0,
    absences: 0,
    recovered: 0
  });
  const [statsData, setStatsData] = useState([]);
  const [distributionData, setDistributionData] = useState([]);

  // --- Effects ---
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const showNotification = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // --- Realtime Push Notifications ---
  useEffect(() => {
    // Suscripción Realtime para actualizar la UI automáticamente
    const subscription = supabase
      .channel('attendance-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'attendance' },
        async (payload) => {
          console.log('Cambio detectado en asistencia:', payload);
          // Esta función actualiza todo el Dashboard (gráficas, contadores, lista)
          fetchAllData();

          // Lógica de notificaciones (solo si están habilitadas)
          if (systemSettings.notificationsEnabled) {
            let teacherName = 'Un profesor';
            if (payload.new && payload.new.faculty_id) {
              const localTeacher = facultyMembers.find(f => f.id === payload.new.faculty_id);
              if (localTeacher) {
                teacherName = localTeacher.name;
              } else {
                const { data } = await supabase.from('faculty_members').select('name').eq('id', payload.new.faculty_id).single();
                if (data) teacherName = data.name;
              }
            }

            // 1. Notificación tipo Toast (UI interna)
            if (payload.eventType === 'INSERT') {
              showNotification(`${teacherName} marcó ENTRADA`, 'info');
            } else if (payload.eventType === 'UPDATE' && payload.new.check_out) {
              showNotification(`${teacherName} marcó SALIDA`, 'success');
            }

            // 2. Alertas de Escritorio y Sonido (Solo para retardos)
            if (payload.eventType === 'INSERT' && payload.new.status === 'Tarde') {
              if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
                try {
                  new Notification(`⚠️ Alerta de Retraso`, {
                    body: `${teacherName} llegó tarde justo ahora.`,
                    icon: '/vite.svg'
                  });
                  const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                  audio.play().catch(e => console.log('Audio blocked', e));
                } catch (err) { console.error(err); }
              }
              showNotification(`⚠️ RETRASO: ${teacherName} llegó tarde`, 'warning');
            }
          }
        }
      )
      .subscribe((status) => {
        console.log('Estado suscripción Realtime:', status);
      });

    // Solicitar permiso de notificaciones por separado si están habilitadas
    if (systemSettings.notificationsEnabled && typeof Notification !== 'undefined') {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [systemSettings.notificationsEnabled, facultyMembers]);
  // Cargar datos desde Supabase
  const fetchAllData = async () => {
    try {
      setLoading(true);

      // 1. Profesores
      const { data: faculty, error: fError } = await supabase.from('faculty_members').select('*');

      // 1.b Obtener asistencia de HOY para marcar entrada/salida en el panel admin
      const today = new Date().toISOString().split('T')[0];
      const { data: todayAttendance } = await supabase
        .from('attendance')
        .select('*')
        .gte('check_in', `${today}T00:00:00`)
        .lte('check_in', `${today}T23:59:59`);

      if (fError) console.error('Error faculty:', fError);

      // Mapear asistencia de hoy a los profesores
      const facultyWithAttendance = (faculty || []).map(f => {
        const att = (todayAttendance || []).find(a => a.faculty_id === f.id);
        return {
          ...f,
          entry: formatTime12hShort(att?.check_in),
          exit: formatTime12hShort(att?.check_out),
          status: att ? att.status : 'Ausente'
        };
      });
      setFacultyMembers(facultyWithAttendance);

      // 2. Cátedras
      const { data: chairs, error: cError } = await supabase.from('academic_chairs').select('*');
      if (cError) console.error('Error chairs:', cError);
      setAcademicChairs(chairs || []);

      // 3. Horarios
      const { data: schedule, error: sError } = await supabase.from('master_schedule').select(`
        *,
        faculty_members(name),
        academic_chairs(name)
      `);
      if (sError) console.error('Error schedule:', sError);

      const formattedSchedule = (schedule || []).map(s => ({
        ...s,
        professor: s.faculty_members?.name || 'Desconocido',
        chair: s.academic_chairs?.name || 'Sin Cátedra'
      }));
      setMasterSchedule(formattedSchedule);

      // 4. Justificaciones
      const { data: justs, error: jError } = await supabase.from('justifications').select(`
        *,
        faculty_members(name)
      `);
      if (jError) console.error('Error justifications:', jError);

      const formattedJusts = (justs || []).map(j => ({
        ...j,
        professor: j.faculty_members?.name || 'Desconocido',
        date: j.absence_date ? new Date(j.absence_date + 'T12:00:00').toLocaleDateString('es-VE') : '-'
      }));
      setJustificationsList(formattedJusts);

      // --- CÁLCULO DE MÉTRICAS EN TIEMPO REAL ---
      const daysMap = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const todayName = daysMap[new Date().getDay()];

      // 1. Asistencia: Profesores únicos programados para hoy vs. Check-ins reales
      const scheduledToday = (schedule || []).filter(s => s.day === todayName);
      const uniqueScheduledIds = new Set(scheduledToday.map(s => s.faculty_id));
      const totalExpected = uniqueScheduledIds.size;

      const presentCount = (todayAttendance || []).length;
      const attPct = totalExpected > 0 ? Math.round((presentCount / totalExpected) * 100) : 0;

      // 2. Retrasos (Hoy)
      const delaysCount = (todayAttendance || []).filter(a => a.status === 'Tarde').length;

      // 3. Inasistencias (Hoy): Esperados - Presentes (aprox)
      // Nota: Esto asume que todos marcan. Si alguien no fue programado pero vino, no resta.
      const absencesCount = Math.max(0, totalExpected - presentCount);

      // 4. Repuestas (Año): Justificaciones 'Aprobadas' como proxy de clases recuperadas/justificadas
      const recoveredCount = (formattedJusts || []).filter(j => j.status === 'Aprobada').length;

      setDashboardStats({
        attendancePct: attPct,
        delays: delaysCount,
        absences: absencesCount,
        recovered: recoveredCount
      });

      // --- CÁLCULO PARA GRÁFICAS ---

      // 1. Tendencia de Cumplimiento (Simulada con datos reales de "Hoy" y simulados para atrás)
      // En un sistema real, haríamos query de los últimos 7 días.
      // Aquí usaremos la info real de hoy como el último punto.
      const currentAsis = attPct;
      const chartTrend = [
        { name: 'Lun', asistencia: 85 },
        { name: 'Mar', asistencia: 88 },
        { name: 'Mié', asistencia: 92 },
        { name: 'Jue', asistencia: 87 },
        { name: 'Vie', asistencia: 90 },
        { name: 'Sáb', asistencia: 85 },
        { name: todayName.substring(0, 3), asistencia: currentAsis } // El valor real de hoy
      ];
      setStatsData(chartTrend);

      // 2. Distribución Docente (Por Tipo de Cátedra)
      // Necesitamos unir Faculty -> Chair -> Type
      const typeCounts = { 'Teóricas': 0, 'Instrumentales': 0, 'Ensambles': 0 };

      (facultyMembers || []).forEach(f => {
        // Buscar la cátedra de este profesor para ver su tipo
        // Nota: f.chair es un string nombre, idealmente sería un ID, pero buscaremos por nombre
        const chairInfo = (chairs || []).find(c => c.name === f.chair);
        if (chairInfo && chairInfo.type) {
          const type = chairInfo.type; // 'Teórica', 'Instrumental', etc.
          // Normalizar nombres
          if (type.includes('Teór')) typeCounts['Teóricas']++;
          else if (type.includes('Instr')) typeCounts['Instrumentales']++;
          else typeCounts['Ensambles']++;
        } else {
          // Si no tiene cátedra definida o no machea, asumimos Instrumental por defecto o 'Otros'
          typeCounts['Instrumentales']++;
        }
      });

      const distData = [
        { name: 'Teóricas', value: typeCounts['Teóricas'], color: '#1B4332' }, // Verde
        { name: 'Instrumentales', value: typeCounts['Instrumentales'], color: '#D47A4D' }, // Terracota
        { name: 'Ensambles', value: typeCounts['Ensambles'], color: '#E6B89C' }, // Crema oscuro
      ].filter(d => d.value > 0); // Solo mostrar los que tienen datos

      setDistributionData(distData);

      setDashboardStats({
        attendancePct: attPct,
        delays: delaysCount,
        absences: absencesCount,
        recovered: recoveredCount
      });

      // 5. Cargar Configuración del Sistema
      const { data: settings } = await supabase.from('system_settings').select('*').single();
      if (settings) {
        setSystemSettings({
          institutionName: settings.institution_name,
          openingTime: settings.opening_time,
          tolerance: settings.tolerance_minutes.toString(),
          notificationsEnabled: settings.notifications_enabled,
          backupEmail: settings.backup_email
        });
      }

    } catch (error) {
      console.error('Error fetchAllData:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Estados para formularios
  const [facultyForm, setFacultyForm] = useState({
    name: '',
    email: '',
    phone: '',
    chair: 'Piano',
    entry: '',
    exit: '',
    status: 'A tiempo',
    justified: '-',
    password: ''
  });

  const [chairForm, setChairForm] = useState({
    name: '',
    room: '',
    type: 'Individual'
  });

  const [assignmentForm, setAssignmentForm] = useState({
    professorId: '',
    chairId: '',
    day: 'Lunes',
    time: '08:00 AM',
    room: ''
  });

  const activeProfessor = facultyMembers.find(f => f.id.toString() === assignmentForm.professorId);
  const activeChairAssignment = academicChairs.find(c => c.id.toString() === assignmentForm.chairId);

  // Close actions menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showActionsMenu !== null) {
        setShowActionsMenu(null);
      }
    };

    if (showActionsMenu !== null) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showActionsMenu]);

  // Funciones para Personal Docente (Reales con Supabase)
  const handleAddFaculty = async () => {
    if (!facultyForm.name || !facultyForm.email || !facultyForm.phone) {
      alert('Por favor complete todos los campos');
      return;
    }

    setLoading(true);
    try {
      console.log('Iniciando invitación de profesor para:', facultyForm.email);
      // Intentamos llamar a la Edge Function para invitar al profesor (crear Auth + Perfil)
      const { data, error: functionError } = await supabase.functions.invoke('invite-teacher', {
        body: {
          email: facultyForm.email,
          password: facultyForm.password || 'Musica2026',
          name: facultyForm.name,
          chair: facultyForm.chair,
          phone: facultyForm.phone
        }
      });

      if (functionError) {
        console.error('Error de red/invocación:', functionError);
        throw new Error(`Detalle técnico: ${functionError.message || 'Error de conexión con Supabase Functions'}`);
      }

      // La respuesta ahora viene en 'data' y siempre es status 200
      if (data && data.success === false) {
        throw new Error(data.error || 'Error desconocido al crear profesor');
      }

      console.log('Respuesta de éxito de la función:', data);
      showNotification('¡Invitación enviada con éxito! El profesor ya puede iniciar sesión.');

      fetchAllData();
      setFacultyForm({ name: '', email: '', phone: '', chair: 'Piano', entry: '', exit: '', status: 'A tiempo', justified: '-', password: '' });
      setShowAddFacultyModal(false);
    } catch (error) {
      console.error('Captura de error en handleAddFaculty:', error);
      alert('No se pudo crear el profesor: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditFaculty = async () => {
    if (!facultyForm.name || !facultyForm.email || !facultyForm.phone) {
      alert('Por favor complete todos los campos');
      return;
    }

    try {
      const { error } = await supabase
        .from('faculty_members')
        .update({
          name: facultyForm.name,
          email: facultyForm.email,
          phone: facultyForm.phone,
          chair: facultyForm.chair,
          entry_time: facultyForm.entry,
          exit_time: facultyForm.exit,
          status: facultyForm.status,
          justified: facultyForm.justified
        })
        .eq('id', editingFaculty.id);

      if (error) throw error;

      showNotification('Profesor actualizado correctamente');
      fetchAllData();
      setEditingFaculty(null);
      setShowAddFacultyModal(false);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleCreateUser = async () => {
    if (!newUserForm.name || !newUserForm.email || !newUserForm.password) {
      alert('Por favor complete los campos obligatorios');
      return;
    }

    setLoading(true);
    try {
      if (newUserForm.role === 'teacher') {
        // Usar la misma lógica de invitación para docentes
        const { data, error: functionError } = await supabase.functions.invoke('invite-teacher', {
          body: {
            email: newUserForm.email,
            password: newUserForm.password,
            name: newUserForm.name,
            chair: newUserForm.chair || 'General',
            phone: newUserForm.phone || '-'
          }
        });

        if (functionError) throw new Error(functionError.message);
        if (data && data.success === false) throw new Error(data.error || 'Error al crear docente');

        showNotification('Docente creado e invitado correctamente');
      } else {
        // Lógica para crear Administrador (Simulado o real según backend)
        // Por ahora simularemos la creación exitosa para la UI
        await new Promise(resolve => setTimeout(resolve, 1000));
        showNotification('Administrador creado correctamente (Simulación)');
      }

      setShowAddUserModal(false);
      setNewUserForm({ name: '', email: '', role: 'teacher', password: '', phone: '', chair: '' });
      fetchAllData();
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error al crear usuario: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFaculty = async () => {
    try {
      // Obtener sesión actual para el token
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) throw new Error('No hay sesión activa para invocar la función.');

      // Construcción dinámica de la URL de la función
      const functionUrl = `${supabase.supabaseUrl}/functions/v1/delete-user`;

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Necesario incluso con --no-verify-jwt para pasar el usuario a Supabase
        },
        body: JSON.stringify({ userId: showDeleteModal.id })
      });

      const resultText = await response.text();
      let result;
      try {
        result = JSON.parse(resultText);
      } catch (e) {
        result = { error: resultText };
      }

      if (!response.ok) {
        throw new Error(result.error || `Error ${response.status}`);
      }

      if (result.success === false) {
        throw new Error(result.error || 'Falló la eliminación en el servidor');
      }

      showNotification('Usuario eliminado del sistema', 'info');
      fetchAllData();
      setShowDeleteModal(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      showNotification('Error al eliminar: ' + error.message, 'error');
    }
  };

  // Funciones para Cátedras (Reales con Supabase)
  const handleAddChair = async () => {
    if (!chairForm.name || !chairForm.room) {
      alert('Por favor complete todos los campos');
      return;
    }

    try {
      const { error } = await supabase.from('academic_chairs').insert([
        {
          name: chairForm.name,
          room: chairForm.room,
          type: chairForm.type
        }
      ]);
      if (error) throw error;

      showNotification('Cátedra creada');
      fetchAllData();
      setChairForm({ name: '', room: '', type: 'Individual' });
      setShowModal(false);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleEditChair = async () => {
    if (!chairForm.name || !chairForm.room) {
      alert('Por favor complete todos los campos');
      return;
    }

    try {
      const { error } = await supabase
        .from('academic_chairs')
        .update({
          name: chairForm.name,
          room: chairForm.room,
          type: chairForm.type
        })
        .eq('id', editingChair.id);

      if (error) throw error;

      showNotification('Cátedra actualizada');
      fetchAllData();
      setEditingChair(null);
      setShowModal(false);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleDeleteChair = async () => {
    try {
      const { error } = await supabase.from('academic_chairs').delete().eq('id', showDeleteChairModal.id);
      if (error) throw error;

      showNotification('Cátedra eliminada', 'info');
      fetchAllData();
      setShowDeleteChairModal(null);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleAddAssignment = async () => {
    if (!assignmentForm.professorId || !assignmentForm.chairId) {
      alert('Por favor selecciona un profesor y una cátedra');
      return;
    }

    try {
      const { error } = await supabase.from('master_schedule').insert([
        {
          faculty_id: assignmentForm.professorId,
          chair_id: assignmentForm.chairId,
          day: assignmentForm.day,
          time: assignmentForm.time,
          room: assignmentForm.room || activeChairAssignment?.room
        }
      ]);

      if (error) throw error;

      showNotification('Horario asignado con éxito');
      fetchAllData();
      setShowAddScheduleModal(false);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleDeleteAssignment = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este horario?')) return;
    try {
      const { error } = await supabase.from('master_schedule').delete().eq('id', id);
      if (error) throw error;
      showNotification('Horario eliminado', 'info');
      fetchAllData();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleViewFile = async (path) => {
    if (!path) return;
    if (path.startsWith('http')) {
      window.open(path, '_blank');
      return;
    }
    const { data, error } = await supabase.storage
      .from('justifications')
      .createSignedUrl(path, 60);
    if (error) {
      console.error('Error:', error);
      alert('Enlace expirado o inválido');
      return;
    }
    window.open(data.signedUrl, '_blank');
  };

  const handleJustificationStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('justifications')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      showNotification(`Solicitud ${newStatus}`);
      fetchAllData();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const { error } = await supabase.from('system_settings').upsert({
        id: 1, // Siempre fila 1
        institution_name: systemSettings.institutionName,
        opening_time: systemSettings.openingTime,
        tolerance_minutes: parseInt(systemSettings.tolerance),
        notifications_enabled: systemSettings.notificationsEnabled,
        backup_email: systemSettings.backupEmail,
        updated_at: new Date()
      });

      if (error) throw error;
      showNotification('Configuración guardada exitosamente', 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error al guardar configuración: ' + error.message);
    }
  };

  // Función para generar PDF Profesional con mejor manejo de errores
  const generatePDF = (month) => {
    try {
      const doc = new jsPDF();

      // Colores corporativos
      const primaryColor = [212, 122, 77]; // Terracota
      const secondaryColor = [27, 67, 50]; // Verde Bosque

      // Encabezado
      doc.setFillColor(...secondaryColor);
      doc.rect(0, 0, 210, 40, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('CONSERVATORIO DE MÚSICA', 105, 15, { align: 'center' });
      doc.text('JUAN MANUEL OLIVARES', 105, 25, { align: 'center' });

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`REPORTE DE ASISTENCIA - ${month.toUpperCase()}`, 105, 33, { align: 'center' });

      // Fecha de generación
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(9);
      doc.text(`Generado el: ${new Date().toLocaleString('es-VE')}`, 195, 48, { align: 'right' });

      // Resumen de Asistencia
      doc.setTextColor(...secondaryColor);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Resumen de Asistencia', 14, 55);

      autoTable(doc, {
        startY: 60,
        head: [['Métrica', 'Valor']],
        body: [
          ['Asistencia Total', '94.5%'],
          ['Justificaciones Aprobadas', '18'],
          ['Retrasos registrados', '12'],
          ['Ausencias sin justificar', '8']
        ],
        headStyles: { fillColor: secondaryColor },
        theme: 'striped'
      });

      // Personal Docente
      const finalY1 = doc.lastAutoTable ? doc.lastAutoTable.finalY : 100;
      doc.setTextColor(...secondaryColor);
      doc.text('Listado de Personal Docente', 14, finalY1 + 15);

      autoTable(doc, {
        startY: finalY1 + 20,
        head: [['#', 'Nombre Completo', 'Cátedra', 'Estado']],
        body: facultyMembers.map((f, i) => [i + 1, f.name, f.chair, f.status]),
        headStyles: { fillColor: secondaryColor },
        theme: 'grid'
      });

      // Cátedras
      doc.addPage();
      doc.setTextColor(...secondaryColor);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Cátedras e Instancias Activas', 14, 20);

      autoTable(doc, {
        startY: 25,
        head: [['ID', 'Nombre de Cátedra', 'Salón', 'Tipo', 'Estudiantes', 'Docentes']],
        body: academicChairs.map(c => [c.id, c.name, c.room, c.type, c.students, c.faculty]),
        headStyles: { fillColor: secondaryColor },
        theme: 'grid'
      });

      // Pie de página en todas las páginas
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Página ${i} de ${pageCount} - Sistema de Gestión J.M. Olivares`, 105, 285, { align: 'center' });
      }

      // Guardar PDF
      doc.save(`Reporte_${month.replace(' ', '_')}.pdf`);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert("Hubo un error al generar el PDF. Por favor, intenta de nuevo.");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Metrics Grid */}
            <section className="dashboard-stats-grid" style={{ marginBottom: '3rem' }}>
              <div className="card">
                <p className="text-muted" style={{ fontSize: '0.875rem' }}>Asistencia Hoy</p>
                <h2 style={{ fontSize: '2rem' }}>{dashboardStats.attendancePct}%</h2>
                <div style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', marginTop: '4px' }}><TrendingUp size={14} /> --%</div>
              </div>
              <div className="card">
                <p className="text-muted" style={{ fontSize: '0.875rem' }}>Retrasos</p>
                <h2 style={{ fontSize: '2rem', color: 'var(--warning)' }}>{dashboardStats.delays}</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hoy</p>
              </div>
              <div className="card">
                <p className="text-muted" style={{ fontSize: '0.875rem' }}>Inasistencias</p>
                <h2 style={{ fontSize: '2rem', color: 'var(--danger)' }}>{dashboardStats.absences}</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sin justificar (Est.)</p>
              </div>
              <div className="card">
                <p className="text-muted" style={{ fontSize: '0.875rem' }}>Justificaciones</p>
                <h2 style={{ fontSize: '2rem', color: 'var(--forest)' }}>{dashboardStats.recovered}</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>En el Año Escolar</p>
              </div>
            </section>

            {/* Weekly Master Schedule Board - Compact Version */}
            <div className="card" style={{ marginBottom: '3rem', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.75rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 className="brand-font" style={{ fontSize: '1.5rem', color: 'var(--secondary)' }}>Horario Maestro Semanal</h3>
                  <p className="text-muted" style={{ fontSize: '0.85rem' }}>Vista consolidada de actividades</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></div>
                  Programadas: {masterSchedule.length}
                </div>
              </div>

              <div className="table-responsive">
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6, minmax(150px, 1fr))',
                  gap: '0.6rem',
                  width: '100%',
                  minWidth: '900px' // Ensure enough space for the 6 columns
                }}>
                  {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map(day => (
                    <div key={day} style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      minWidth: 0 // Prevent grid item overflow
                    }}>
                      <div style={{
                        background: 'var(--bg-cream)',
                        padding: '0.6rem',
                        borderRadius: '10px',
                        textAlign: 'center',
                        border: '1px solid rgba(212, 122, 77, 0.1)',
                      }}>
                        <h4 style={{
                          margin: 0,
                          color: 'var(--secondary)',
                          fontSize: '0.85rem',
                          fontWeight: 900,
                          letterSpacing: '0.5px'
                        }}>{day}</h4>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {masterSchedule.filter(s => s.day === day).length > 0 ? (
                          masterSchedule
                            .filter(s => s.day === day)
                            .sort((a, b) => a.time.localeCompare(b.time))
                            .map(session => (
                              <motion.div
                                whileHover={{ scale: 1.02, y: -2 }}
                                key={session.id}
                                style={{
                                  background: 'white',
                                  padding: '0.8rem',
                                  borderRadius: '12px',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                  border: '1px solid rgba(0,0,0,0.03)',
                                  borderLeft: '3px solid var(--primary)',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                <div style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.15rem' }}>
                                  {session.time}
                                </div>
                                <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={session.chair}>
                                  {session.chair}
                                </h5>
                                <p className="text-muted" style={{ fontSize: '0.7rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {session.professor}
                                </p>
                                <div style={{
                                  marginTop: '0.5rem',
                                  paddingTop: '0.5rem',
                                  borderTop: '1px solid rgba(0,0,0,0.04)',
                                  display: 'flex',
                                  justifyContent: 'center'
                                }}>
                                  <span style={{
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    color: 'var(--text-muted)',
                                    background: 'var(--bg-cream)',
                                    padding: '1px 6px',
                                    borderRadius: '4px'
                                  }}>
                                    S. {session.room}
                                  </span>
                                </div>
                              </motion.div>
                            ))
                        ) : (
                          <div style={{
                            textAlign: 'center',
                            padding: '1rem 0.5rem',
                            borderRadius: '12px',
                            border: '1px dashed rgba(0,0,0,0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.25rem',
                            opacity: 0.5
                          }}>
                            <Music size={14} />
                            <p style={{ margin: 0, fontSize: '0.65rem', fontStyle: 'italic' }}> vacío </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid-cols-2" style={{ marginBottom: '3rem' }}>
              <div className="card">
                <h3 style={{ marginBottom: '1.5rem' }}>Tendencia de Cumplimiento</h3>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={statsData}>
                      <defs>
                        <linearGradient id="colorAsis" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D47A4D" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#D47A4D" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="asistencia" stroke="#D47A4D" strokeWidth={3} fill="url(#colorAsis)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="card">
                <h3 style={{ marginBottom: '1.5rem' }}>Distribución Docente</h3>
                <div style={{ display: 'flex', alignItems: 'center', height: '300px', flexWrap: 'wrap', gap: '1.5rem' }}>
                  <div style={{ flex: '1', minWidth: '180px', height: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={distributionData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                          {distributionData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ minWidth: '150px' }}>
                    {distributionData.map(d => (
                      <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <div style={{ width: '12px', height: '12px', background: d.color, borderRadius: '4px' }}></div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{d.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 'faculty':
        // Filter faculty members
        const filteredFaculty = facultyMembers.filter(f => {
          const matchesSearch = f.name.toLowerCase().includes(facultySearch.toLowerCase()) ||
            f.email.toLowerCase().includes(facultySearch.toLowerCase()) ||
            f.chair.toLowerCase().includes(facultySearch.toLowerCase());
          const matchesStatus = facultyStatusFilter === 'Todos' || f.status === facultyStatusFilter;
          return matchesSearch && matchesStatus;
        });

        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            {/* Sub-tabs for Faculty */}
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem', borderBottom: '1px solid #eee', flexWrap: 'wrap' }}>
              <button
                onClick={() => setFacultyViewMode('list')}
                style={{
                  padding: '1rem 0',
                  background: 'none',
                  border: 'none',
                  borderBottom: facultyViewMode === 'list' ? '3px solid var(--secondary)' : '3px solid transparent',
                  color: facultyViewMode === 'list' ? 'var(--secondary)' : 'var(--text-muted)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'all 0.3s'
                }}
              >
                Lista de Docentes
              </button>
              <button
                onClick={() => setFacultyViewMode('users')}
                style={{
                  padding: '1rem 0',
                  background: 'none',
                  border: 'none',
                  borderBottom: facultyViewMode === 'users' ? '3px solid var(--secondary)' : '3px solid transparent',
                  color: facultyViewMode === 'users' ? 'var(--secondary)' : 'var(--text-muted)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'all 0.3s'
                }}
              >
                Gestión de Usuarios
              </button>
            </div>

            {facultyViewMode === 'list' ? (
              <>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                  {/* Search Bar */}
                  <div className="glass" style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.6rem 1.2rem',
                    borderRadius: '16px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    flex: '1',
                    maxWidth: '400px',
                    minWidth: '250px'
                  }}>
                    <Search size={18} className="text-forest" style={{ opacity: 0.7 }} />
                    <input
                      type="text"
                      placeholder="Buscar por nombre, email o cátedra..."
                      value={facultySearch}
                      onChange={(e) => setFacultySearch(e.target.value)}
                      style={{
                        border: 'none',
                        background: 'none',
                        marginLeft: '0.8rem',
                        outline: 'none',
                        width: '100%',
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        color: 'var(--text-main)'
                      }}
                    />
                  </div>

                  {/* Custom Status Filter Dropdown */}
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowActionsMenu(showActionsMenu === 'status-filter' ? null : 'status-filter');
                      }}
                      className="glass"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.6rem 1.2rem',
                        borderRadius: '16px',
                        gap: '0.8rem',
                        border: '1px solid rgba(0,0,0,0.05)',
                        cursor: 'pointer',
                        fontWeight: 600,
                        color: 'var(--text-main)',
                        minWidth: '150px',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Filter size={16} className="text-forest" />
                        <span>{facultyStatusFilter}</span>
                      </div>
                      <ChevronDown size={16} className="text-muted" style={{ transform: showActionsMenu === 'status-filter' ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
                    </button>

                    <AnimatePresence>
                      {showActionsMenu === 'status-filter' && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 5, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            left: 0,
                            background: 'white',
                            borderRadius: '16px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                            padding: '0.5rem',
                            zIndex: 100,
                            border: '1px solid rgba(0,0,0,0.05)'
                          }}
                        >
                          {['Todos', 'Presente', 'Tarde', 'A tiempo', 'Retraso', 'Ausente'].map(status => (
                            <button
                              key={status}
                              onClick={() => {
                                setFacultyStatusFilter(status);
                                setShowActionsMenu(null);
                              }}
                              style={{
                                width: '100%',
                                padding: '0.8rem 1rem',
                                border: 'none',
                                background: facultyStatusFilter === status ? 'rgba(27, 67, 50, 0.08)' : 'none',
                                borderRadius: '12px',
                                textAlign: 'left',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: facultyStatusFilter === status ? 700 : 500,
                                color: facultyStatusFilter === status ? 'var(--secondary)' : 'var(--text-main)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(27, 67, 50, 0.04)'}
                              onMouseLeave={(e) => e.currentTarget.style.background = facultyStatusFilter === status ? 'rgba(27, 67, 50, 0.08)' : 'none'}
                            >
                              {status}
                              {facultyStatusFilter === status && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--secondary)' }}></div>}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <p className="text-muted" style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                  Mostrando {filteredFaculty.length} de {facultyMembers.length} profesores
                </p>
                <div className="card">
                  <div className="table-responsive">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ textAlign: 'left', color: 'var(--text-muted)', borderBottom: '1px solid #eee' }}>
                          <th style={{ padding: '1rem' }}>Profesor</th>
                          <th style={{ padding: '1rem' }}>Cátedra</th>
                          <th style={{ padding: '1rem' }}>Entrada</th>
                          <th style={{ padding: '1rem' }}>Salida</th>
                          <th style={{ padding: '1rem' }}>Estado</th>
                          <th style={{ padding: '1rem' }}>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredFaculty.map(f => (
                          <tr key={f.id} style={{ borderBottom: '1px solid #fafafa' }}>
                            <td style={{ padding: '1rem' }}>
                              <div style={{ fontWeight: 700 }}>{f.name}</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{f.email}</div>
                            </td>
                            <td style={{ padding: '1rem' }}>{f.chair}</td>
                            <td style={{ padding: '1rem', fontWeight: 600 }}>{f.entry}</td>
                            <td style={{ padding: '1rem', fontWeight: 600 }}>{f.exit}</td>
                            <td style={{ padding: '1rem' }}>
                              <span className={`badge ${f.status === 'Presente' || f.status === 'A tiempo' ? 'badge-success' :
                                f.status === 'Tarde' || f.status === 'Retraso' ? 'badge-warning' :
                                  'badge-danger'
                                }`}>{f.status}</span>
                            </td>
                            <td style={{ padding: '1rem', position: 'relative' }}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowActionsMenu(showActionsMenu === f.id ? null : f.id);
                                }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
                              >
                                <MoreVertical size={18} />
                              </button>

                              <AnimatePresence>
                                {showActionsMenu === f.id && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    style={{
                                      position: 'absolute',
                                      right: '0',
                                      top: '100%',
                                      background: 'white',
                                      boxShadow: '0 12px 35px rgba(0,0,0,0.15)',
                                      borderRadius: '16px',
                                      padding: '0.6rem',
                                      zIndex: 1000,
                                      minWidth: '200px',
                                      marginTop: '0.5rem',
                                      border: '1px solid rgba(0,0,0,0.05)'
                                    }}
                                  >
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setFacultyForm({
                                          name: f.name,
                                          email: f.email,
                                          phone: f.phone,
                                          chair: f.chair,
                                          entry: f.entry,
                                          exit: f.exit,
                                          status: f.status,
                                          justified: f.justified
                                        });
                                        setEditingFaculty(f);
                                        setShowAddFacultyModal(true);
                                        setShowActionsMenu(null);
                                      }}
                                      className="action-menu-item"
                                      style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        border: 'none',
                                        background: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        cursor: 'pointer',
                                        borderRadius: '12px',
                                        fontSize: '0.95rem',
                                        fontWeight: 500,
                                        transition: 'all 0.2s',
                                        textAlign: 'left',
                                        color: 'var(--text-main)'
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(27, 67, 50, 0.08)';
                                        e.currentTarget.style.transform = 'translateX(2px)';
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'none';
                                        e.currentTarget.style.transform = 'translateX(0)';
                                      }}
                                    >
                                      <Edit2 size={16} style={{ color: 'var(--secondary)' }} />
                                      <span>Editar</span>
                                    </button>

                                    <div style={{
                                      height: '1px',
                                      background: 'rgba(0,0,0,0.06)',
                                      margin: '0.25rem 0.5rem'
                                    }}></div>

                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setShowDeleteModal(f);
                                        setShowActionsMenu(null);
                                      }}
                                      className="action-menu-item"
                                      style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        border: 'none',
                                        background: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        cursor: 'pointer',
                                        borderRadius: '12px',
                                        fontSize: '0.95rem',
                                        fontWeight: 500,
                                        transition: 'all 0.2s',
                                        textAlign: 'left',
                                        color: 'var(--text-main)'
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(153, 27, 27, 0.08)';
                                        e.currentTarget.style.color = 'var(--danger)';
                                        e.currentTarget.style.transform = 'translateX(2px)';
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'none';
                                        e.currentTarget.style.color = 'var(--text-main)';
                                        e.currentTarget.style.transform = 'translateX(0)';
                                      }}
                                    >
                                      <Trash2 size={16} style={{ color: 'var(--danger)' }} />
                                      <span>Eliminar</span>
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredFaculty.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                      <Users size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                      <p>No se encontraron profesores con los filtros aplicados</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // VISTA DE GESTIÓN DE USUARIOS
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <h3 style={{ margin: 0 }}>Usuarios del Sistema</h3>
                  <button
                    className="btn-primary"
                    style={{
                      background: 'var(--secondary)',
                      padding: '0.8rem 1.5rem',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      boxShadow: '0 4px 15px rgba(27, 67, 50, 0.2)'
                    }}
                    onClick={() => {
                      setNewUserForm({ name: '', email: '', role: 'teacher', password: '', phone: '', chair: '' });
                      setShowAddUserModal(true);
                    }}
                  >
                    <UserPlus size={20} /> <span style={{ whiteSpace: 'nowrap' }}>Nuevo Usuario</span>
                  </button>
                </div>

                {/* User Search and Filter */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                  <div className="glass" style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.6rem 1.2rem',
                    borderRadius: '16px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    flex: '1',
                    minWidth: '250px'
                  }}>
                    <Search size={18} className="text-forest" style={{ opacity: 0.7 }} />
                    <input
                      type="text"
                      placeholder="Buscar usuario..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      style={{
                        border: 'none',
                        background: 'none',
                        marginLeft: '0.8rem',
                        outline: 'none',
                        width: '100%',
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        color: 'var(--text-main)'
                      }}
                    />
                  </div>

                  <div style={{ position: 'relative', minWidth: '150px' }}>
                    <button
                      onClick={() => setShowUserRoleDropdown(!showUserRoleDropdown)}
                      className="glass"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.6rem 1.2rem',
                        borderRadius: '16px',
                        gap: '0.8rem',
                        border: '1px solid rgba(0,0,0,0.05)',
                        cursor: 'pointer',
                        fontWeight: 600,
                        color: 'var(--text-main)',
                        width: '100%',
                        justifyContent: 'space-between',
                        height: '100%'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Filter size={16} className="text-forest" />
                        <span>{userRoleFilter}</span>
                      </div>
                      <ChevronDown size={16} className="text-muted" style={{ transform: showUserRoleDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
                    </button>

                    <AnimatePresence>
                      {showUserRoleDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 5, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            left: 0,
                            background: 'white',
                            borderRadius: '16px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                            padding: '0.5rem',
                            zIndex: 100,
                            border: '1px solid rgba(0,0,0,0.05)'
                          }}
                        >
                          {['Todos', 'Admin', 'Docente'].map(role => (
                            <button
                              key={role}
                              onClick={() => {
                                setUserRoleFilter(role);
                                setShowUserRoleDropdown(false);
                              }}
                              style={{
                                width: '100%',
                                padding: '0.8rem 1rem',
                                border: 'none',
                                background: userRoleFilter === role ? 'rgba(27, 67, 50, 0.08)' : 'none',
                                borderRadius: '12px',
                                textAlign: 'left',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: userRoleFilter === role ? 700 : 500,
                                color: userRoleFilter === role ? 'var(--secondary)' : 'var(--text-main)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(27, 67, 50, 0.04)'}
                              onMouseLeave={(e) => e.currentTarget.style.background = userRoleFilter === role ? 'rgba(27, 67, 50, 0.08)' : 'none'}
                            >
                              {role}
                              {userRoleFilter === role && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--secondary)' }}></div>}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="table-responsive">
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ textAlign: 'left', color: 'var(--text-muted)', borderBottom: '1px solid #eee' }}>
                        <th style={{ padding: '1rem' }}>Usuario</th>
                        <th style={{ padding: '1rem' }}>Rol</th>
                        <th style={{ padding: '1rem' }}>Estado</th>
                        <th style={{ padding: '1rem' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Render Admin Row if matches filters */}
                      {('Administrador Principal'.toLowerCase().includes(userSearch.toLowerCase()) || 'admin@conservatorio.ve'.includes(userSearch.toLowerCase())) &&
                        (userRoleFilter === 'Todos' || userRoleFilter === 'Admin') && (
                          <tr style={{ borderBottom: '1px solid #fafafa' }}>
                            <td style={{ padding: '1rem' }}>
                              <div style={{ fontWeight: 700 }}>Administrador Principal</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>admin@conservatorio.ve</div>
                            </td>
                            <td style={{ padding: '1rem' }}><span className="badge badge-forest">Admin</span></td>
                            <td style={{ padding: '1rem' }}><span className="badge badge-success">Activo</span></td>
                            <td style={{ padding: '1rem' }}>-</td>
                          </tr>
                        )}

                      {/* Render Filtered Faculty Members */}
                      {facultyMembers
                        .filter(f => {
                          const matchesSearch = f.name.toLowerCase().includes(userSearch.toLowerCase()) || f.email.toLowerCase().includes(userSearch.toLowerCase());
                          const matchesRole = userRoleFilter === 'Todos' || userRoleFilter === 'Docente';
                          return matchesSearch && matchesRole;
                        })
                        .map(f => (
                          <tr key={f.id} style={{ borderBottom: '1px solid #fafafa' }}>
                            <td style={{ padding: '1rem' }}>
                              <div style={{ fontWeight: 700 }}>{f.name}</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{f.email}</div>
                            </td>
                            <td style={{ padding: '1rem' }}><span className="badge badge-forest" style={{ background: 'rgba(212, 122, 77, 0.1)', color: 'var(--primary)' }}>Docente</span></td>
                            <td style={{ padding: '1rem' }}>
                              <span className="badge badge-success">Activo</span>
                            </td>
                            <td style={{ padding: '1rem' }}>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                  onClick={() => {
                                    setFacultyForm({
                                      name: f.name,
                                      email: f.email,
                                      phone: f.phone,
                                      chair: f.chair,
                                      entry: f.entry,
                                      exit: f.exit,
                                      status: f.status,
                                      justified: f.justified
                                    });
                                    setEditingFaculty(f);
                                    setShowAddFacultyModal(true);
                                  }}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary)' }} title="Editar Usuario"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => setShowDeleteModal(f)}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }} title="Eliminar Usuario"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        );
      case 'chairs':
        // Filter chairs
        const filteredChairs = academicChairs.filter(c => {
          const matchesSearch = c.name.toLowerCase().includes(chairSearch.toLowerCase()) ||
            c.room.toLowerCase().includes(chairSearch.toLowerCase());
          const matchesType = chairTypeFilter === 'Todos' || c.type === chairTypeFilter;
          return matchesSearch && matchesType;
        });

        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 className="brand-font" style={{ fontSize: '2rem' }}>Cátedras e Instancias</h2>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', width: '100%', justifyContent: 'flex-end' }}>
                {/* Search Bar for Chairs */}
                <div className="glass" style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '16px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  flex: '1',
                  maxWidth: '300px',
                  minWidth: '200px'
                }}>
                  <Search size={18} className="text-forest" style={{ opacity: 0.7 }} />
                  <input
                    type="text"
                    placeholder="Buscar cátedra o salón..."
                    value={chairSearch}
                    onChange={(e) => setChairSearch(e.target.value)}
                    style={{
                      border: 'none',
                      background: 'none',
                      marginLeft: '0.8rem',
                      outline: 'none',
                      width: '100%',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      color: 'var(--text-main)'
                    }}
                  />
                </div>

                {/* Type Filter Dropdown for Chairs */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowChairFilterDropdown(!showChairFilterDropdown)}
                    className="glass"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.6rem 1.2rem',
                      borderRadius: '16px',
                      gap: '0.8rem',
                      border: '1px solid rgba(0,0,0,0.05)',
                      cursor: 'pointer',
                      fontWeight: 600,
                      color: 'var(--text-main)',
                      minWidth: '140px',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <Filter size={16} className="text-forest" />
                      <span>{chairTypeFilter}</span>
                    </div>
                    <ChevronDown size={16} className="text-muted" style={{ transform: showChairFilterDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
                  </button>

                  <AnimatePresence>
                    {showChairFilterDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 5, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        style={{
                          position: 'absolute',
                          top: '100%',
                          right: 0,
                          left: 0,
                          background: 'white',
                          borderRadius: '16px',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                          padding: '0.5rem',
                          zIndex: 100,
                          border: '1px solid rgba(0,0,0,0.05)'
                        }}
                      >
                        {['Todos', 'Individual', 'Grupal'].map(type => (
                          <button
                            key={type}
                            onClick={() => {
                              setChairTypeFilter(type);
                              setShowChairFilterDropdown(false);
                            }}
                            style={{
                              width: '100%',
                              padding: '0.8rem 1rem',
                              border: 'none',
                              background: chairTypeFilter === type ? 'rgba(27, 67, 50, 0.08)' : 'none',
                              borderRadius: '12px',
                              textAlign: 'left',
                              cursor: 'pointer',
                              fontSize: '0.9rem',
                              fontWeight: chairTypeFilter === type ? 700 : 500,
                              color: chairTypeFilter === type ? 'var(--secondary)' : 'var(--text-main)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(27, 67, 50, 0.04)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = chairTypeFilter === type ? 'rgba(27, 67, 50, 0.08)' : 'none'}
                          >
                            {type}
                            {chairTypeFilter === type && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--secondary)' }}></div>}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button className="btn-primary" style={{ background: 'var(--secondary)', padding: '0.7rem 1.4rem', borderRadius: '16px', whiteSpace: 'nowrap' }} onClick={() => {
                  setEditingChair(null);
                  setChairForm({ name: '', room: '', type: 'Individual' });
                  setShowModal(true);
                }}>
                  <Plus size={18} /> Nueva Cátedra
                </button>
              </div>
            </div>

            {/* Sub-tabs for Chairs/Schedules */}
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', borderBottom: '1px solid #eee', overflowX: 'auto', paddingBottom: '2px' }}>
              <button
                onClick={() => setChairsViewMode('list')}
                style={{
                  padding: '1rem 0',
                  background: 'none',
                  border: 'none',
                  borderBottom: chairsViewMode === 'list' ? '3px solid var(--secondary)' : '3px solid transparent',
                  color: chairsViewMode === 'list' ? 'var(--secondary)' : 'var(--text-muted)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                Lista de Cátedras
              </button>
              <button
                onClick={() => setChairsViewMode('schedule')}
                style={{
                  padding: '1rem 0',
                  background: 'none',
                  border: 'none',
                  borderBottom: chairsViewMode === 'schedule' ? '3px solid var(--secondary)' : '3px solid transparent',
                  color: chairsViewMode === 'schedule' ? 'var(--secondary)' : 'var(--text-muted)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                Horarios Asignados
              </button>
            </div>

            {chairsViewMode === 'list' ? (
              <div className="grid-cols-2">
                {filteredChairs.map(c => (
                  <div key={c.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <span className="badge" style={{ background: '#eee', marginBottom: '0.5rem' }}>Salón {c.room}</span>
                      <h3 style={{ fontSize: '1.25rem' }}>{c.name}</h3>
                      <p className="text-muted" style={{ fontSize: '0.85rem' }}>Modalidad: {c.type}</p>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => {
                            setEditingChair(c);
                            setChairForm({ name: c.name, room: c.room, type: c.type });
                            setShowModal(true);
                          }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 600 }}
                        >
                          <Edit2 size={14} /> Editar
                        </button>
                        <button
                          onClick={() => setShowDeleteChairModal(c)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 600 }}
                        >
                          <Trash2 size={14} /> Eliminar
                        </button>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--secondary)' }}>{c.students}</div>
                      <p style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>Estudiantes</p>
                      <div style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>{c.faculty} docentes</div>
                    </div>
                  </div>
                ))}
                {filteredChairs.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>
                    <GraduationCap size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                    <p>No se encontraron cátedras con estos filtros</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="card" style={{ padding: '0' }}>
                <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', flexWrap: 'wrap', gap: '1rem' }}>
                  <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Distribución de Horarios</h3>
                  <button
                    className="btn-primary"
                    style={{ fontSize: '0.85rem', padding: '0.6rem 1.2rem', borderRadius: '12px' }}
                    onClick={() => setShowAddScheduleModal(true)}
                  >
                    <Plus size={16} /> <span style={{ whiteSpace: 'nowrap' }}>Asignar Nuevo Horario</span>
                  </button>
                </div>
                <div className="table-responsive">
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ textAlign: 'left', color: 'var(--text-muted)', borderBottom: '1px solid #eee' }}>
                        <th style={{ padding: '1.5rem' }}>Profesor</th>
                        <th style={{ padding: '1.5rem' }}>Cátedra</th>
                        <th style={{ padding: '1.5rem' }}>Día</th>
                        <th style={{ padding: '1.5rem' }}>Hora</th>
                        <th style={{ padding: '1.5rem' }}>Salón</th>
                        <th style={{ padding: '1.5rem' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {masterSchedule.map(item => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #fafafa' }}>
                          <td style={{ padding: '1.25rem 1.5rem', fontWeight: 700 }}>{item.professor}</td>
                          <td style={{ padding: '1.25rem 1.5rem' }}>{item.chair}</td>
                          <td style={{ padding: '1.25rem 1.5rem' }}>
                            <span className="badge" style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text-main)' }}>{item.day}</span>
                          </td>
                          <td style={{ padding: '1.25rem 1.5rem', fontWeight: 600 }}>{item.time}</td>
                          <td style={{ padding: '1.25rem 1.5rem' }}>{item.room}</td>
                          <td style={{ padding: '1.25rem 1.5rem' }}>
                            <button
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}
                              onClick={() => handleDeleteAssignment(item.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        );
      case 'reports':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 className="brand-font" style={{ fontSize: '2rem' }}>Reportes Mensuales</h2>
              <button
                className="btn-primary"
                style={{
                  background: 'var(--secondary)',
                  padding: '0.8rem 1.8rem',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  boxShadow: '0 4px 15px rgba(27, 67, 50, 0.2)'
                }}
                onClick={() => generatePDF('Anual_2025')}
              >
                <Download size={20} /> <span style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Exportar Reporte Anual</span>
              </button>
            </div>
            <div className="grid-cols-3">
              {['Diciembre 2025', 'Noviembre 2025', 'Octubre 2025'].map(month => (
                <div key={month} className="card" style={{ borderRadius: '24px', padding: '1.8rem' }}>
                  <div style={{ background: 'var(--bg-cream)', padding: '1.2rem', borderRadius: '16px', marginBottom: '1.8rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                    <div style={{ background: 'white', padding: '0.8rem', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                      <FileBox className="text-forest" size={24} />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{month}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span>Asistencia Total</span>
                      <span style={{ fontWeight: 700 }}>94.5%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Justificaciones</span>
                      <span style={{ fontWeight: 700 }}>18</span>
                    </div>
                  </div>
                  <button
                    className="btn-primary"
                    style={{
                      width: '100%',
                      fontSize: '0.95rem',
                      background: 'var(--secondary)',
                      borderRadius: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.6rem'
                    }}
                    onClick={() => generatePDF(month)}
                  >
                    <Download size={18} /> Generar PDF
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        );
      case 'justifications':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 className="brand-font" style={{ fontSize: '2rem' }}>Gestión de Justificaciones</h2>
              <div className="badge badge-warning" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
                {justificationsList.filter(j => j.status === 'Pendiente').length} Pendientes
              </div>
            </div>

            <div className="card" style={{ padding: '0' }}>
              <div className="table-responsive">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', color: 'var(--text-muted)', borderBottom: '1px solid #eee' }}>
                      <th style={{ padding: '1.5rem' }}>Profesor</th>
                      <th style={{ padding: '1.5rem' }}>Fecha</th>
                      <th style={{ padding: '1.5rem' }}>Cátedra</th>
                      <th style={{ padding: '1.5rem' }}>Motivo</th>
                      <th style={{ padding: '1.5rem' }}>Adjunto</th>
                      <th style={{ padding: '1.5rem' }}>Estado</th>
                      <th style={{ padding: '1.5rem' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {justificationsList.map(j => (
                      <tr key={j.id} style={{ borderBottom: '1px solid #fafafa' }}>
                        <td style={{ padding: '1.5rem' }}>
                          <div style={{ fontWeight: 700 }}>{j.professor}</div>
                        </td>
                        <td style={{ padding: '1.5rem', fontWeight: 600 }}>{j.date}</td>
                        <td style={{ padding: '1.5rem', fontWeight: 600, color: 'var(--secondary)' }}>{j.chair || '-'}</td>
                        <td style={{ padding: '1.5rem', maxWidth: '300px' }}>
                          <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', opacity: 0.8 }}>{j.reason}</div>
                        </td>
                        <td style={{ padding: '1.5rem' }}>
                          {j.file_url ? (
                            <button
                              onClick={() => handleViewFile(j.file_url)}
                              className="btn-outline"
                              style={{
                                padding: '0.4rem 0.8rem',
                                fontSize: '0.8rem',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                textDecoration: 'none',
                                color: 'var(--secondary)',
                                width: 'fit-content',
                                border: '1px solid var(--secondary)',
                                background: 'none',
                                cursor: 'pointer'
                              }}
                            >
                              <FileUp size={14} /> Ver
                            </button>
                          ) : (
                            <span className="text-muted" style={{ fontSize: '0.8rem' }}>Sin adjunto</span>
                          )}
                        </td>
                        <td style={{ padding: '1.5rem' }}>
                          <span className={`badge ${(j.status || '').toLowerCase().includes('aprob') ? 'badge-success' :
                            (j.status || '').toLowerCase().includes('rechaz') ? 'badge-danger' :
                              'badge-warning'
                            }`}>{j.status || 'Pendiente'}</span>
                        </td>
                        <td style={{ padding: '1.5rem' }}>
                          {j.status === 'Pendiente' ? (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button
                                onClick={() => handleJustificationStatus(j.id, 'Aprobada')}
                                style={{ background: '#1B4332', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}
                                title="Aprobar"
                              >
                                <CheckCircle2 size={16} />
                              </button>
                              <button
                                onClick={() => handleJustificationStatus(j.id, 'Rechazada')}
                                style={{ background: '#991B1B', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}
                                title="Rechazar"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 500 }}>Procesada</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {justificationsList.length === 0 && (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                <ClipboardCheck size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                <p>No hay solicitudes de justificación registradas en el sistema</p>
              </div>
            )}
          </motion.div>
        );
      case 'settings':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="brand-font" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Configuración del Sistema</h2>
            <div className="settings-layout" style={{ gap: '2rem' }}>
              <div className="settings-nav" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { id: 'General', icon: <Globe size={18} /> },
                  { id: 'Notificaciones', icon: <BellRing size={18} /> },
                  { id: 'Seguridad', icon: <ShieldCheck size={18} /> },
                  { id: 'Dispositivos', icon: <Smartphone size={18} /> }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setSettingsTab(item.id)}
                    className={`nav-link ${settingsTab === item.id ? 'active' : ''}`}
                    style={{
                      textAlign: 'left',
                      color: settingsTab === item.id ? 'white' : 'var(--text-main)',
                      background: settingsTab === item.id ? 'var(--secondary)' : 'transparent',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem',
                      borderRadius: '12px'
                    }}
                  >
                    {item.icon}
                    <span style={{ fontWeight: 600 }}>{item.id}</span>
                  </button>
                ))}
              </div>

              <div className="card settings-content-card" style={{ padding: '2.5rem' }}>
                <AnimatePresence mode="wait">
                  {settingsTab === 'General' && (
                    <motion.div
                      key="general"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Globe size={20} className="text-forest" /> Ajustes del Conservatorio
                      </h3>
                      <div className="input-group">
                        <label>Nombre de la Institución</label>
                        <input
                          type="text"
                          value={systemSettings.institutionName}
                          onChange={(e) => setSystemSettings({ ...systemSettings, institutionName: e.target.value })}
                        />
                      </div>
                      <div className="grid-cols-2">
                        <div className="input-group">
                          <label>Hora de Apertura</label>
                          <input
                            type="time"
                            value={systemSettings.openingTime}
                            onChange={(e) => setSystemSettings({ ...systemSettings, openingTime: e.target.value })}
                          />
                        </div>
                        <div className="input-group">
                          <label>Tolerancia Retrasos (min)</label>
                          <input
                            type="number"
                            value={systemSettings.tolerance}
                            onChange={(e) => setSystemSettings({ ...systemSettings, tolerance: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="input-group">
                        <label>Email de Soporte/Sistemas</label>
                        <input
                          type="email"
                          value={systemSettings.backupEmail}
                          onChange={(e) => setSystemSettings({ ...systemSettings, backupEmail: e.target.value })}
                        />
                      </div>
                    </motion.div>
                  )}

                  {settingsTab === 'Notificaciones' && (
                    <motion.div
                      key="notifications"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <BellRing size={20} className="text-forest" /> Preferencias de Notificación
                      </h3>

                      <div className="card" style={{ padding: '1.5rem', marginBottom: '1rem', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <h4 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>Inasistencias y Retrasos</h4>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', gap: '1rem' }}>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: 600 }}>Alertas Inmediatas</p>
                            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Recibir un email cuando un profesor marque "Tarde" o no llegue.</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={systemSettings.notificationsEnabled}
                            onChange={(e) => setSystemSettings({ ...systemSettings, notificationsEnabled: e.target.checked })}
                            style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--secondary)', flexShrink: 0 }}
                          />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: 600 }}>Resumen Semanal</p>
                            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Reporte de estadísticas enviado los viernes.</p>
                          </div>
                          <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--secondary)', flexShrink: 0 }} />
                        </div>
                      </div>

                      <div className="card" style={{ padding: '1.5rem', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <h4 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>Sistema</h4>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: 600 }}>Mantenimiento</p>
                            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Avisos sobre actualizaciones del sistema.</p>
                          </div>
                          <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--secondary)', flexShrink: 0 }} />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {settingsTab === 'Seguridad' && (
                    <motion.div
                      key="security"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <ShieldCheck size={20} className="text-forest" /> Seguridad de la Cuenta
                      </h3>

                      <div className="card" style={{ padding: '2rem', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <h4 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Cambiar Contraseña</h4>
                        <div className="input-group">
                          <label>Nueva Contraseña</label>
                          <input type="password" placeholder="Mínimo 6 caracteres" id="newPass" />
                        </div>
                        <div className="input-group">
                          <label>Confirmar Nueva Contraseña</label>
                          <input type="password" placeholder="Repite la contraseña" id="confirmPass" />
                        </div>
                        <button
                          className="btn-primary"
                          style={{ marginTop: '1rem', width: '100%' }}
                          onClick={async () => {
                            const newPass = document.getElementById('newPass').value;
                            const confirmPass = document.getElementById('confirmPass').value;
                            if (newPass !== confirmPass) return alert("Las contraseñas no coinciden");
                            if (newPass.length < 6) return alert("La contraseña es muy corta");

                            try {
                              const { error } = await supabase.auth.updateUser({ password: newPass });
                              if (error) throw error;
                              showNotification("Contraseña actualizada correctamente", 'success');
                              document.getElementById('newPass').value = '';
                              document.getElementById('confirmPass').value = '';
                            } catch (e) {
                              alert("Error: " + e.message);
                            }
                          }}
                        >
                          Actualizar Contraseña
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {settingsTab === 'Dispositivos' && (
                    <motion.div
                      key="devices"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Smartphone size={20} className="text-forest" /> Dispositivos Conectados
                      </h3>

                      <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', border: '1px solid var(--success)', background: 'rgba(27, 67, 50, 0.02)', flexWrap: 'wrap' }}>
                        <div style={{ padding: '1rem', background: 'white', borderRadius: '50%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                          <Globe size={32} className="text-forest" />
                        </div>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <h4 style={{ marginBottom: '0.25rem' }}>Sesión Actual</h4>
                          <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                            {navigator.userAgent.includes("Windows") ? "Windows PC" : "Dispositivo"} - {navigator.userAgent.includes("Chrome") ? "Google Chrome" : "Navegador Web"}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600 }}>Activo ahora</span>
                          </div>
                        </div>
                        <button className="btn-outline" style={{ fontSize: '0.85rem', width: '100%' }} disabled>
                          Dispositivo Actual
                        </button>
                      </div>

                      <h4 style={{ margin: '2rem 0 1rem 0', fontSize: '1rem', color: 'var(--text-muted)' }}>Otras sesiones recientes</h4>

                      <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed rgba(0,0,0,0.1)' }}>
                        <p>No se detectan otras sesiones activas.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(0,0,0,0.05)', flexWrap: 'wrap' }}>
                  <button
                    className="btn-primary"
                    style={{ background: 'var(--secondary)', flex: 1, minWidth: '150px' }}
                    onClick={handleSaveSettings}
                  >
                    <Save size={18} /> Guardar Cambios
                  </button>
                  <button
                    className="btn-outline"
                    style={{ flex: 1, minWidth: '150px' }}
                    onClick={() => {
                      if (confirm('¿Deseas restaurar los valores por defecto?')) {
                        setSystemSettings({
                          institutionName: 'Conservatorio de Música Juan Manuel Olivares',
                          openingTime: '07:00',
                          tolerance: '15',
                          notificationsEnabled: true,
                          backupEmail: 'sistemas@olivares.edu.ve'
                        });
                      }
                    }}
                  >
                    Restaurar Valores
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      default: return null;
    }
  };

  return (
    <div className="layout">
      {/* Mobile Menu Button - Admin */}
      <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
        <Menu size={24} />
      </button>

      {/* Overlay for Mobile Sidebar */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? 'visible' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`} style={{ background: 'var(--secondary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3.5rem' }}>
          <div className="logo-container" style={{ marginBottom: 0 }}>
            <Music2 size={32} color="var(--primary)" />
            <div>
              <span className="logo-text" style={{ fontSize: '1.2rem', display: 'block' }}>J. M. Olivares</span>
              <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Administrador</span>
            </div>
          </div>
          <button
            className="mobile-menu-btn"
            onClick={() => setIsSidebarOpen(false)}
            style={{ display: 'flex', position: 'static', background: 'none', border: 'none', color: 'white' }}
          >
            <X size={24} />
          </button>
        </div>
        <nav>
          <a href="#" className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }}>
            <LayoutDashboard size={20} /> Resumen
          </a>
          <a href="#" className={`nav-link ${activeTab === 'faculty' ? 'active' : ''}`} onClick={() => { setActiveTab('faculty'); setIsSidebarOpen(false); }}>
            <Users size={20} /> Personal Docente
          </a>
          <a href="#" className={`nav-link ${activeTab === 'chairs' ? 'active' : ''}`} onClick={() => { setActiveTab('chairs'); setIsSidebarOpen(false); }}>
            <GraduationCap size={20} /> Cátedras / Horas
          </a>
          <a href="#" className={`nav-link ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => { setActiveTab('reports'); setIsSidebarOpen(false); }}>
            <FileBox size={20} /> Reportes
          </a>
          <a href="#" className={`nav-link ${activeTab === 'justifications' ? 'active' : ''}`} onClick={() => { setActiveTab('justifications'); setIsSidebarOpen(false); }}>
            <ClipboardCheck size={20} /> Justificaciones
          </a>
          <a href="#" className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }}>
            <Settings size={20} /> Configuración
          </a>
          <div style={{ marginTop: 'auto' }}>
            <a href="#" className="nav-link" onClick={() => setShowLogoutModal(true)}><LogOut size={20} /> Salir</a>
          </div>
        </nav>
      </aside>

      <main className="main-content">
        <header className="dashboard-header" style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ minWidth: '250px' }}>
            <h1 className="brand-font" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', margin: 0 }}>
              {activeTab === 'dashboard' ? 'Control de Asistencia' :
                activeTab === 'faculty' ? 'Personal Docente' :
                  activeTab === 'chairs' ? 'Cátedras / Horas' :
                    activeTab === 'reports' ? 'Reportes' :
                      activeTab === 'justifications' ? 'Justificaciones' :
                        activeTab === 'settings' ? 'Configuración' :
                          activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <p className="text-muted">Dirección Académica • Gestión General</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Clock for Admin */}
            <div className="glass header-clock" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              padding: '0.75rem 1.25rem',
              borderRadius: '14px',
              border: '1px solid rgba(0,0,0,0.05)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              background: 'rgba(255,255,255,0.4)'
            }}>
              <Clock size={20} className="text-terracotta" />
              <div style={{ textAlign: 'right' }}>
                <span className="clock-stabilized" style={{ display: 'block', fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1, fontFamily: "'Outfit', sans-serif" }}>
                  {formatTime12h(currentTime)}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                  {getLongDateVE(currentTime)}
                </span>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1.5rem', height: 'fit-content' }}>
              <BellRing size={20} className="text-forest" />
              <div style={{ width: '40px', height: '40px', background: 'var(--secondary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}>
                <ShieldCheck size={24} />
              </div>
            </div>
          </div>
        </header>
        {renderContent()}
      </main>

      <AnimatePresence>
        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="card" style={{ width: '500px', padding: '3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h2 className="brand-font">{editingChair ? 'Editar Cátedra' : 'Nueva Cátedra'}</h2>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
              </div>
              <div className="input-group">
                <label>Nombre de la Cátedra</label>
                <input
                  type="text"
                  placeholder="Ej: Cátedra de Arpa"
                  value={chairForm.name}
                  onChange={(e) => setChairForm({ ...chairForm, name: e.target.value })}
                />
              </div>
              <div className="grid-cols-2">
                <div className="input-group">
                  <label>Tipo</label>
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setShowChairTypeDropdown(!showChairTypeDropdown)}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        borderRadius: '12px',
                        border: '1px solid #e5e7eb',
                        background: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        fontSize: '1rem'
                      }}
                    >
                      <span style={{ fontWeight: 500 }}>{chairForm.type}</span>
                      <ChevronDown size={18} style={{
                        transform: showChairTypeDropdown ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.3s',
                        color: 'var(--text-muted)'
                      }} />
                    </button>

                    <AnimatePresence>
                      {showChairTypeDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 5 }}
                          exit={{ opacity: 0, y: 10 }}
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            background: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                            border: '1px solid rgba(0,0,0,0.05)',
                            zIndex: 10,
                            padding: '0.4rem'
                          }}
                        >
                          {['Individual', 'Grupal'].map(type => (
                            <button
                              key={type}
                              onClick={() => {
                                setChairForm({ ...chairForm, type });
                                setShowChairTypeDropdown(false);
                              }}
                              style={{
                                width: '100%',
                                padding: '0.8rem 1rem',
                                border: 'none',
                                background: chairForm.type === type ? 'rgba(27, 67, 50, 0.08)' : 'transparent',
                                borderRadius: '8px',
                                textAlign: 'left',
                                cursor: 'pointer',
                                fontSize: '0.95rem',
                                fontWeight: chairForm.type === type ? 600 : 400,
                                color: chairForm.type === type ? 'var(--secondary)' : 'var(--text-main)',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                if (chairForm.type !== type) e.currentTarget.style.background = 'rgba(0,0,0,0.02)';
                              }}
                              onMouseLeave={(e) => {
                                if (chairForm.type !== type) e.currentTarget.style.background = 'transparent';
                              }}
                            >
                              {type}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <div className="input-group">
                  <label>Número de Salón</label>
                  <input
                    type="text"
                    placeholder="Ej: 101"
                    value={chairForm.room}
                    onChange={(e) => setChairForm({ ...chairForm, room: e.target.value })}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button className="btn-primary" style={{ flex: 1, background: 'var(--secondary)' }} onClick={editingChair ? handleEditChair : handleAddChair}>
                  <Save size={18} /> {editingChair ? 'Guardar Cambios' : 'Crear Cátedra'}
                </button>
                <button className="btn-outline" style={{ flex: 1 }} onClick={() => {
                  setShowModal(false);
                  setChairForm({ name: '', room: '', type: 'Individual' });
                  setEditingChair(null);
                }}>Cancelar</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add/Edit Faculty Modal */}
      <AnimatePresence>
        {showAddFacultyModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }} onClick={() => setShowAddFacultyModal(false)}>
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="card" style={{ width: '600px', padding: '3rem', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h2 className="brand-font">{editingFaculty ? 'Editar Profesor' : 'Agregar Nuevo Profesor'}</h2>
                <button onClick={() => {
                  setShowAddFacultyModal(false);
                  setEditingFaculty(null);
                  setFacultyForm({ name: '', email: '', phone: '', chair: 'Piano', entry: '', exit: '', status: 'A tiempo', justified: '-' });
                }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
              </div>

              <div className="input-group">
                <label>Nombre Completo</label>
                <input
                  type="text"
                  placeholder="Ej: María Fernández"
                  value={facultyForm.name}
                  onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })}
                />
              </div>

              <div className="grid-cols-2">
                <div className="input-group">
                  <label>Correo Electrónico</label>
                  <input
                    type="email"
                    placeholder="profesor@musica.ve"
                    value={facultyForm.email}
                    onChange={(e) => setFacultyForm({ ...facultyForm, email: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    placeholder="+58 412 1234567"
                    value={facultyForm.phone}
                    onChange={(e) => setFacultyForm({ ...facultyForm, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="input-group">
                <label>Contraseña Inicial</label>
                <input
                  type="text"
                  placeholder="Ej: Profe2026*"
                  value={facultyForm.password}
                  onChange={(e) => setFacultyForm({ ...facultyForm, password: e.target.value })}
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                  * Si se deja vacía, se usará "Musica2026" por defecto.
                </p>
              </div>

              <div className="input-group">
                <label>Cátedra Principal</label>
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowFacultyChair(!showFacultyChair)}
                    style={{
                      width: '100%',
                      padding: '0.9rem 1.2rem',
                      borderRadius: '14px',
                      border: '1px solid rgba(0,0,0,0.1)',
                      background: 'white',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'var(--text-main)'
                    }}
                  >
                    <span>{facultyForm.chair}</span>
                    <ChevronDown size={18} style={{ transform: showFacultyChair ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                  </button>
                  <AnimatePresence>
                    {showFacultyChair && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          background: 'white',
                          borderRadius: '16px',
                          boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                          border: '1px solid rgba(0,0,0,0.05)',
                          zIndex: 1100,
                          marginTop: '0.5rem',
                          padding: '0.5rem',
                          maxHeight: '200px',
                          overflowY: 'auto'
                        }}
                      >
                        {['Piano', 'Violín', 'Teoría', 'Canto', 'Guitarra', 'Flauta', 'Orquesta'].map(c => (
                          <button
                            key={c}
                            onClick={() => {
                              setFacultyForm({ ...facultyForm, chair: c });
                              setShowFacultyChair(false);
                            }}
                            style={{
                              width: '100%',
                              padding: '0.8rem 1.5rem',
                              border: 'none',
                              background: facultyForm.chair === c ? 'rgba(27, 67, 50, 0.08)' : 'none',
                              color: facultyForm.chair === c ? 'var(--secondary)' : 'var(--text-main)',
                              borderRadius: '12px',
                              textAlign: 'left',
                              cursor: 'pointer',
                              fontSize: '0.95rem',
                              fontWeight: facultyForm.chair === c ? 700 : 500
                            }}
                          >
                            {c}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <div className="input-group">
                <label>Estado Asistencia</label>
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowFacultyStatus(!showFacultyStatus)}
                    style={{
                      width: '100%',
                      padding: '0.9rem 1.2rem',
                      borderRadius: '14px',
                      border: '1px solid rgba(0,0,0,0.1)',
                      background: 'white',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'var(--text-main)'
                    }}
                  >
                    <span>{facultyForm.status}</span>
                    <ChevronDown size={18} style={{ transform: showFacultyStatus ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                  </button>
                  <AnimatePresence>
                    {showFacultyStatus && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          background: 'white',
                          borderRadius: '16px',
                          boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                          border: '1px solid rgba(0,0,0,0.05)',
                          zIndex: 1100,
                          marginTop: '0.5rem',
                          padding: '0.5rem'
                        }}
                      >
                        {['Presente', 'Tarde', 'A tiempo', 'Retraso', 'Ausente'].map(s => (
                          <button
                            key={s}
                            onClick={() => {
                              setFacultyForm({ ...facultyForm, status: s });
                              setShowFacultyStatus(false);
                            }}
                            style={{
                              width: '100%',
                              padding: '0.8rem 1.5rem',
                              border: 'none',
                              background: facultyForm.status === s ? 'rgba(27, 67, 50, 0.08)' : 'none',
                              color: facultyForm.status === s ? 'var(--secondary)' : 'var(--text-main)',
                              borderRadius: '12px',
                              textAlign: 'left',
                              cursor: 'pointer',
                              fontSize: '0.95rem',
                              fontWeight: facultyForm.status === s ? 700 : 500
                            }}
                          >
                            {s}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>



              <div className="input-group">
                <label>¿Justificó Inasistencia/Retraso?</label>
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowFacultyJustified(!showFacultyJustified)}
                    style={{
                      width: '100%',
                      padding: '0.9rem 1.2rem',
                      borderRadius: '14px',
                      border: '1px solid rgba(0,0,0,0.1)',
                      background: 'white',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'var(--text-main)'
                    }}
                  >
                    <span>{facultyForm.justified}</span>
                    <ChevronDown size={18} style={{ transform: showFacultyJustified ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                  </button>
                  <AnimatePresence>
                    {showFacultyJustified && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          background: 'white',
                          borderRadius: '16px',
                          boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                          border: '1px solid rgba(0,0,0,0.05)',
                          zIndex: 1100,
                          marginTop: '0.5rem',
                          padding: '0.5rem'
                        }}
                      >
                        {['-', 'Sí', 'No', 'Pendiente'].map(j => (
                          <button
                            key={j}
                            onClick={() => {
                              setFacultyForm({ ...facultyForm, justified: j });
                              setShowFacultyJustified(false);
                            }}
                            style={{
                              width: '100%',
                              padding: '0.8rem 1.5rem',
                              border: 'none',
                              background: facultyForm.justified === j ? 'rgba(27, 67, 50, 0.08)' : 'none',
                              color: facultyForm.justified === j ? 'var(--secondary)' : 'var(--text-main)',
                              borderRadius: '12px',
                              textAlign: 'left',
                              cursor: 'pointer',
                              fontSize: '0.95rem',
                              fontWeight: facultyForm.justified === j ? 700 : 500
                            }}
                          >
                            {j}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button className="btn-primary" style={{ flex: 1, background: 'var(--secondary)' }} onClick={editingFaculty ? handleEditFaculty : handleAddFaculty}>
                  <Save size={18} /> {editingFaculty ? 'Guardar Cambios' : 'Agregar Profesor'}
                </button>
                <button className="btn-outline" style={{ flex: 1 }} onClick={() => {
                  setShowAddFacultyModal(false);
                  setEditingFaculty(null);
                  setFacultyForm({ name: '', email: '', phone: '', chair: 'Piano', entry: '', exit: '', status: 'A tiempo', justified: '-' });
                }}>Cancelar</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }} onClick={() => setShowDeleteModal(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="card" style={{ maxWidth: '450px', margin: 'auto', textAlign: 'center', padding: '2.5rem' }} onClick={(e) => e.stopPropagation()}>
              <div style={{ background: 'rgba(153, 27, 27, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <AlertCircle size={30} className="text-danger" />
              </div>
              <h3 className="brand-font" style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>¿Eliminar Profesor?</h3>
              <p className="text-muted" style={{ marginBottom: '0.5rem' }}>
                Estás a punto de eliminar a:
              </p>
              <p style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--secondary)' }}>
                {showDeleteModal.name}
              </p>
              <p className="text-muted" style={{ marginBottom: '2rem', fontSize: '0.9rem' }}>
                Esta acción no se puede deshacer. Todos los registros y asignaciones de este profesor se mantendrán en el historial.
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn-outline" style={{ flex: 1 }} onClick={() => setShowDeleteModal(null)}>Cancelar</button>
                <button className="btn-primary" style={{ flex: 1, background: 'var(--danger)' }} onClick={handleDeleteFaculty}>
                  <Trash2 size={18} /> Eliminar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Chair Confirmation Modal */}
      <AnimatePresence>
        {showDeleteChairModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }} onClick={() => setShowDeleteChairModal(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="card" style={{ maxWidth: '450px', margin: 'auto', textAlign: 'center', padding: '2.5rem' }} onClick={(e) => e.stopPropagation()}>
              <div style={{ background: 'rgba(153, 27, 27, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <AlertCircle size={30} className="text-danger" />
              </div>
              <h3 className="brand-font" style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>¿Eliminar Cátedra?</h3>
              <p className="text-muted" style={{ marginBottom: '0.5rem' }}>
                Estás a punto de eliminar:
              </p>
              <p style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--secondary)' }}>
                {showDeleteChairModal.name}
              </p>
              <p className="text-muted" style={{ marginBottom: '2rem', fontSize: '0.9rem' }}>
                Esta acción eliminará la cátedra permanentemente.
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn-outline" style={{ flex: 1 }} onClick={() => setShowDeleteChairModal(null)}>Cancelar</button>
                <button className="btn-primary" style={{ flex: 1, background: 'var(--danger)' }} onClick={handleDeleteChair}>
                  <Trash2 size={18} /> Eliminar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showAddUserModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="card" style={{ width: '500px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                <h2 className="brand-font" style={{ margin: 0 }}>Registrar Nuevo Usuario</h2>
                <button onClick={() => setShowAddUserModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              <div className="input-group">
                <label>Nombre Completo</label>
                <input
                  type="text"
                  placeholder="Ej: María Pérez"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label>Correo Electrónico</label>
                <input
                  type="email"
                  placeholder="usuario@musica.ve"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label>Contraseña Temporal</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newUserForm.password}
                  onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label>Rol de Usuario</label>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button
                    onClick={() => setNewUserForm({ ...newUserForm, role: 'teacher' })}
                    style={{
                      flex: 1,
                      padding: '0.8rem',
                      borderRadius: '10px',
                      border: newUserForm.role === 'teacher' ? '2px solid var(--primary)' : '1px solid #ddd',
                      background: newUserForm.role === 'teacher' ? 'rgba(212, 122, 77, 0.1)' : 'white',
                      cursor: 'pointer',
                      fontWeight: 600,
                      color: newUserForm.role === 'teacher' ? 'var(--primary)' : 'var(--text-muted)'
                    }}
                  >
                    Docente
                  </button>
                  <button
                    onClick={() => setNewUserForm({ ...newUserForm, role: 'admin' })}
                    style={{
                      flex: 1,
                      padding: '0.8rem',
                      borderRadius: '10px',
                      border: newUserForm.role === 'admin' ? '2px solid var(--secondary)' : '1px solid #ddd',
                      background: newUserForm.role === 'admin' ? 'rgba(27, 67, 50, 0.1)' : 'white',
                      cursor: 'pointer',
                      fontWeight: 600,
                      color: newUserForm.role === 'admin' ? 'var(--secondary)' : 'var(--text-muted)'
                    }}
                  >
                    Administrador
                  </button>
                </div>
              </div>

              {newUserForm.role === 'teacher' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <div className="input-group">
                    <label>Teléfono</label>
                    <input
                      type="text"
                      placeholder="+58 412 0000000"
                      value={newUserForm.phone}
                      onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label>Cátedra Principal</label>
                    <input
                      type="text"
                      placeholder="Ej: Piano, Violín"
                      value={newUserForm.chair}
                      onChange={(e) => setNewUserForm({ ...newUserForm, chair: e.target.value })}
                    />
                  </div>
                </motion.div>
              )}

              <button
                className="btn-primary"
                style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', background: newUserForm.role === 'admin' ? 'var(--secondary)' : 'var(--primary)' }}
                onClick={handleCreateUser}
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Crear Usuario'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLogoutModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }} onClick={() => setShowLogoutModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="card" style={{ maxWidth: '440px', width: '90%', margin: 'auto', textAlign: 'center', padding: '2.5rem', boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }} onClick={(e) => e.stopPropagation()}>
              <div style={{ background: 'rgba(212, 122, 77, 0.1)', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <LogOut size={32} style={{ color: 'var(--primary)' }} />
              </div>
              <h3 className="brand-font" style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>¿Cerrar Sesión?</h3>
              <p className="text-muted" style={{ marginBottom: '2rem', fontSize: '1rem' }}>
                ¿Estás seguro de que deseas salir del panel de administración? Asegúrate de haber guardado tus cambios.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button className="btn-outline" style={{ flex: 1, minWidth: '120px' }} onClick={() => setShowLogoutModal(false)}>Cancelar</button>
                <button className="btn-primary" style={{ flex: 1, minWidth: '120px', background: 'var(--secondary)' }} onClick={onLogout}>
                  Confirmar Salida
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddScheduleModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="card" style={{ maxWidth: '500px', width: '90%', padding: '2.5rem' }}>
              <h3 className="brand-font" style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Asignar Nuevo Horario</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {/* Custom Professor Selection */}
                <div className="input-group">
                  <label>Seleccionar Profesor</label>
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setShowProfDropdown(!showProfDropdown)}
                      style={{
                        width: '100%',
                        padding: '0.9rem 1.2rem',
                        borderRadius: '14px',
                        border: '1px solid rgba(0,0,0,0.1)',
                        background: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: activeProfessor ? 600 : 400,
                        color: activeProfessor ? 'var(--text-main)' : 'var(--text-muted)'
                      }}
                    >
                      <span>{activeProfessor ? activeProfessor.name : 'Elegir profesor...'}</span>
                      <ChevronDown size={18} style={{ transform: showProfDropdown ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                    </button>

                    <AnimatePresence>
                      {showProfDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            background: 'white',
                            borderRadius: '16px',
                            boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
                            border: '1px solid rgba(0,0,0,0.05)',
                            zIndex: 1100,
                            marginTop: '0.5rem',
                            maxHeight: '220px',
                            overflowY: 'auto',
                            padding: '0.5rem'
                          }}
                        >
                          {facultyMembers.map(f => (
                            <button
                              key={f.id}
                              onClick={() => {
                                setAssignmentForm({ ...assignmentForm, professorId: f.id.toString() });
                                setShowProfDropdown(false);
                              }}
                              style={{
                                width: '100%',
                                padding: '0.8rem 1rem',
                                border: 'none',
                                background: assignmentForm.professorId === f.id.toString() ? 'rgba(212, 122, 77, 0.08)' : 'none',
                                color: assignmentForm.professorId === f.id.toString() ? 'var(--primary)' : 'var(--text-main)',
                                borderRadius: '12px',
                                textAlign: 'left',
                                cursor: 'pointer',
                                fontSize: '0.95rem',
                                fontWeight: assignmentForm.professorId === f.id.toString() ? 700 : 500,
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(212, 122, 77, 0.04)'}
                              onMouseLeave={(e) => e.currentTarget.style.background = assignmentForm.professorId === f.id.toString() ? 'rgba(212, 122, 77, 0.08)' : 'none'}
                            >
                              {f.name}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Custom Chair Selection */}
                <div className="input-group">
                  <label>Seleccionar Cátedra</label>
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setShowChairDropdownModal(!showChairDropdownModal)}
                      style={{
                        width: '100%',
                        padding: '0.9rem 1.2rem',
                        borderRadius: '14px',
                        border: '1px solid rgba(0,0,0,0.1)',
                        background: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: activeChairAssignment ? 600 : 400,
                        color: activeChairAssignment ? 'var(--text-main)' : 'var(--text-muted)'
                      }}
                    >
                      <span>{activeChairAssignment ? activeChairAssignment.name : 'Elegir cátedra...'}</span>
                      <ChevronDown size={18} style={{ transform: showChairDropdownModal ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                    </button>

                    <AnimatePresence>
                      {showChairDropdownModal && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            background: 'white',
                            borderRadius: '16px',
                            boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
                            border: '1px solid rgba(0,0,0,0.05)',
                            zIndex: 1100,
                            marginTop: '0.5rem',
                            maxHeight: '220px',
                            overflowY: 'auto',
                            padding: '0.5rem'
                          }}
                        >
                          {academicChairs.map(c => (
                            <button
                              key={c.id}
                              onClick={() => {
                                setAssignmentForm({ ...assignmentForm, chairId: c.id.toString() });
                                setShowChairDropdownModal(false);
                              }}
                              style={{
                                width: '100%',
                                padding: '0.8rem 1rem',
                                border: 'none',
                                background: assignmentForm.chairId === c.id.toString() ? 'rgba(212, 122, 77, 0.08)' : 'none',
                                color: assignmentForm.chairId === c.id.toString() ? 'var(--primary)' : 'var(--text-main)',
                                borderRadius: '12px',
                                textAlign: 'left',
                                cursor: 'pointer',
                                fontSize: '0.95rem',
                                fontWeight: assignmentForm.chairId === c.id.toString() ? 700 : 500,
                                transition: 'all 0.2s'
                              }}
                            >
                              {c.name}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {/* Custom Day Selection */}
                  <div className="input-group">
                    <label>Día</label>
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={() => setShowDayDropdown(!showDayDropdown)}
                        style={{
                          width: '100%',
                          padding: '0.9rem 1.2rem',
                          borderRadius: '14px',
                          border: '1px solid rgba(0,0,0,0.1)',
                          background: 'white',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: 'var(--text-main)'
                        }}
                      >
                        <span>{assignmentForm.day}</span>
                        <ChevronDown size={16} style={{ transform: showDayDropdown ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                      </button>

                      <AnimatePresence>
                        {showDayDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            style={{
                              position: 'absolute',
                              top: '100%',
                              left: 0,
                              right: 0,
                              background: 'white',
                              borderRadius: '16px',
                              boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
                              border: '1px solid rgba(0,0,0,0.05)',
                              zIndex: 1100,
                              marginTop: '0.5rem',
                              padding: '0.4rem'
                            }}
                          >
                            {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map(d => (
                              <button
                                key={d}
                                onClick={() => {
                                  setAssignmentForm({ ...assignmentForm, day: d });
                                  setShowDayDropdown(false);
                                }}
                                style={{
                                  width: '100%',
                                  padding: '0.75rem 0.8rem',
                                  border: 'none',
                                  background: assignmentForm.day === d ? 'rgba(212, 122, 77, 0.08)' : 'none',
                                  color: assignmentForm.day === d ? 'var(--primary)' : 'var(--text-main)',
                                  borderRadius: '10px',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  fontSize: '0.9rem',
                                  fontWeight: assignmentForm.day === d ? 700 : 500
                                }}
                              >
                                {d}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Hora</label>
                    <input
                      type="text"
                      placeholder="ej: 08:00 AM"
                      value={assignmentForm.time}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, time: e.target.value })}
                      style={{ width: '100%', padding: '0.9rem 1.2rem', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '1rem', outline: 'none' }}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Salón (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Dejar vacío para usar salón de cátedra"
                    value={assignmentForm.room}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, room: e.target.value })}
                    style={{ width: '100%', padding: '0.9rem 1.2rem', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '1rem', outline: 'none' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button className="btn-primary" style={{ flex: 1 }} onClick={handleAddAssignment}>Asignar Horario</button>
                <button className="btn-outline" style={{ flex: 1 }} onClick={() => setShowAddScheduleModal(false)}>Cancelar</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              background: toast.type === 'info' ? 'var(--secondary)' : '#1B4332',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '16px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              fontWeight: 600,
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <CheckCircle2 size={20} />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div >
  );
};

function App() {
  const [view, setView] = useState('login');
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        const role = session.user.email.toLowerCase().includes('admin') ? 'admin' : 'teacher';
        setView(role);
      }
      setIsInitializing(false);
    }).catch(() => {
      setIsInitializing(false);
    });

    // Listen to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        const role = session.user.email.toLowerCase().includes('admin') ? 'admin' : 'teacher';
        setView(role);
      } else {
        setUser(null);
        setView('login');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = (role) => setView(role);
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (isInitializing) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-cream)', color: 'var(--primary)' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ width: '40px', height: '40px', border: '3px solid rgba(212,122,77,0.2)', borderTopColor: 'var(--primary)', borderRadius: '50%' }} />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {view === 'login' && <LoginPage key="login" onLogin={handleLogin} />}
      {view === 'teacher' && <TeacherDashboard key="teacher" onLogout={handleLogout} user={user} />}
      {view === 'admin' && <AdminDashboard key="admin" onLogout={handleLogout} user={user} />}
    </AnimatePresence>
  );
}

export default App;
