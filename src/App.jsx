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
  Smartphone
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
  { id: 1, date: '2025-12-22', reason: 'Cita Médica - Oftalmología', status: 'Aprobado', file: 'comprobante_01.pdf' },
  { id: 2, date: '2025-12-15', reason: 'Falla Eléctrica en Sector', status: 'Pendiente', file: 'foto_evidencia.jpg' },
];

const facultyMembers = [
  { id: 1, name: 'Carlos Rangel', email: 'crangel@musica.ve', chair: 'Piano', phone: '+58 412 1234567', status: 'Activo' },
  { id: 2, name: 'Elena Méndez', email: 'emendez@musica.ve', chair: 'Violín', phone: '+58 424 7654321', status: 'Activo' },
  { id: 3, name: 'Luis Zambrano', email: 'lzambrano@musica.ve', chair: 'Teoría', phone: '+58 416 1112233', status: 'Activo' },
  { id: 4, name: 'Martha Colmenares', email: 'mcolmenares@musica.ve', chair: 'Canto', phone: '+58 414 9998877', status: 'De Licencia' },
];

const academicChairs = [
  { id: 1, name: 'Cátedra de Piano', code: 'PI-001', type: 'Individual', faculty: 12, students: 45 },
  { id: 2, name: 'Cátedra de Violín', code: 'VN-002', type: 'Individual', faculty: 8, students: 32 },
  { id: 3, name: 'Teoría y Solfeo', code: 'TS-003', type: 'Grupal', faculty: 4, students: 120 },
  { id: 4, name: 'Orquesta de Niños', code: 'OR-004', type: 'Grupal', faculty: 2, students: 60 },
];

// --- Components ---

const LoginPage = ({ onLogin }) => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    onLogin(isAdminMode ? 'admin' : 'teacher');
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
          <Music2 size={48} className={isAdminMode ? 'text-forest' : 'text-terracotta'} style={{ marginBottom: '1rem' }} />
          <h1 className="brand-font" style={{ fontSize: '2rem' }}>
            {isAdminMode ? 'Administración' : 'Conservatorio'}
          </h1>
          <p className="text-muted">
            {isAdminMode ? 'Panel de Control Directivo' : 'Sistema de Registro Docente'}
          </p>
        </div>

        {!isAdminMode ? (
          <div className="glass" style={{ padding: '2rem', borderRadius: '16px', textAlign: 'center', marginBottom: '2rem', border: '2px dashed var(--primary)' }}>
            <QrCode size={120} style={{ opacity: 0.15, marginBottom: '1rem' }} />
            <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>Escanea tu código QR</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>O ingresa manualmente</p>
          </div>
        ) : (
          <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', textAlign: 'center', marginBottom: '2rem', background: 'rgba(27, 67, 50, 0.05)', border: '1px solid var(--secondary)' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--secondary)', fontWeight: 600 }}>Acceso Restringido</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Solo personal directivo autorizado</p>
          </div>
        )}

        <div className="input-group">
          <label>Correo Electrónico</label>
          <input
            type="text"
            placeholder={isAdminMode ? 'admin@conservatorio.ve' : 'profesor@musica.ve'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>Contraseña</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="btn-primary"
          style={{
            width: '100%',
            marginBottom: '1rem',
            background: isAdminMode ? 'var(--secondary)' : 'var(--primary)',
            boxShadow: isAdminMode ? '0 4px 12px rgba(27, 67, 50, 0.3)' : '0 4px 12px rgba(212, 122, 77, 0.3)'
          }}
          onClick={handleSignIn}
        >
          Iniciar Sesión
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
          >
            {isAdminMode ? 'Regresar a Login de Profesor' : '¿Eres administrador? Ingresa aquí'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const TeacherDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('attendance');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [time, setTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  useEffect(() => {
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
                <h2 className="clock-display">
                  {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </h2>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                  {!isCheckedIn ? (
                    <button className="btn-primary" style={{ padding: '1.25rem 3rem', fontSize: '1.1rem' }} onClick={() => setIsCheckedIn(true)}>
                      Marcar Entrada
                    </button>
                  ) : (
                    <button className="btn-primary" style={{ background: 'var(--danger)', padding: '1.25rem 3rem', fontSize: '1.1rem' }} onClick={() => setIsCheckedIn(false)}>
                      Marcar Salida
                    </button>
                  )}
                  <button className="btn-outline" style={{ borderColor: 'white', color: 'white' }}>
                    Marcar como Repuesta
                  </button>
                </div>
              </div>
            </section>

            <div className="grid-cols-2">
              <div className="card">
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <GraduationCap className="text-terracotta" /> Resumen de Hoy
                </h3>
                <div style={{ background: 'var(--bg-cream)', padding: '1.5rem', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span className="badge badge-success">Grupal</span>
                    <span className="text-muted">04:00 PM - 05:30 PM</span>
                  </div>
                  <p style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>Práctica Coral I</p>
                  <p className="text-muted">Aula Magna • 12 alumnos inscritos</p>
                </div>
              </div>

              <div className="card">
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle className="text-warning" /> Alertas Pendientes
                </h3>
                <div className="glass" style={{ border: '1px solid var(--warning)', padding: '1rem', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ background: 'rgba(180, 83, 9, 0.1)', padding: '0.75rem', borderRadius: '10px' }}>
                    <FileUp className="text-warning" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600 }}>Inasistencia Lunes 22</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Requiere justificación técnica</p>
                  </div>
                  <button className="btn-primary" style={{ marginLeft: 'auto', padding: '0.5rem 1rem', fontSize: '0.8rem' }} onClick={() => setActiveTab('justifications')}>Justificar</button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 'history':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 className="brand-font" style={{ fontSize: '2rem' }}>Mi Historial</h2>
              <div className="glass" style={{ padding: '0.5rem 1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Search size={16} />
                <input type="text" placeholder="Filtrar por mes..." style={{ border: 'none', background: 'none', outline: 'none' }} />
              </div>
            </div>
            <div className="card">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '2px solid #f8f8f8' }}>
                    <th style={{ padding: '1.5rem 1rem' }}>Fecha</th>
                    <th style={{ padding: '1.5rem 1rem' }}>Cátedra</th>
                    <th style={{ padding: '1.5rem 1rem' }}>Entrada</th>
                    <th style={{ padding: '1.5rem 1rem' }}>Salida</th>
                    <th style={{ padding: '1.5rem 1rem' }}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceHistory.map(h => (
                    <tr key={h.id} style={{ borderBottom: '1px solid #fafafa' }}>
                      <td style={{ padding: '1.25rem 1rem', fontWeight: 600 }}>{h.date}</td>
                      <td style={{ padding: '1.25rem 1rem' }}>{h.chair}</td>
                      <td style={{ padding: '1.25rem 1rem' }}>{h.entry}</td>
                      <td style={{ padding: '1.25rem 1rem' }}>{h.exit}</td>
                      <td style={{ padding: '1.25rem 1rem' }}>
                        <span className={`badge ${h.status === 'Presente' ? 'badge-success' :
                            h.status === 'Repuesta' ? 'badge-forest' :
                              h.status === 'Ausente' ? 'badge-danger' : 'badge-warning'
                          }`} style={{
                            backgroundColor: h.status === 'Repuesta' ? 'rgba(27, 67, 50, 0.1)' : '',
                            color: h.status === 'Repuesta' ? 'var(--secondary)' : ''
                          }}>
                          {h.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        );
      case 'schedule':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="brand-font" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Próximas Clases</h2>
            <div className="grid-cols-3">
              {upcomingClasses.map(c => (
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
                    <span className="text-muted">Alumnos: <strong>{c.students}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      case 'justifications':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="brand-font" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Mis Justificaciones</h2>
            <div className="grid-cols-2" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
              <div className="card">
                <h3 style={{ marginBottom: '1.5rem' }}>Nueva Solicitud</h3>
                <div className="input-group">
                  <label>Fecha de Ausencia</label>
                  <input type="date" />
                </div>
                <div className="input-group">
                  <label>Cátedra</label>
                  <select>
                    <option>Piano III</option>
                    <option>Armonía I</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Comprobante</label>
                  <div style={{ border: '2px dashed #ddd', padding: '2rem', borderRadius: '12px', textAlign: 'center' }}>
                    <FileUp size={24} className="text-muted" />
                    <p className="text-muted" style={{ fontSize: '0.8rem' }}>Subir PDF o Foto</p>
                  </div>
                </div>
                <button className="btn-primary" style={{ width: '100%' }}>Enviar</button>
              </div>
              <div className="card">
                <h3 style={{ marginBottom: '1.5rem' }}>Estados de Trámite</h3>
                {justifications.map(j => (
                  <div key={j.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-cream)', borderRadius: '12px', marginBottom: '1rem' }}>
                    <div>
                      <p style={{ fontWeight: 700 }}>{j.date}</p>
                      <p className="text-muted" style={{ fontSize: '0.8rem' }}>{j.reason}</p>
                    </div>
                    <span className={`badge ${j.status === 'Aprobado' ? 'badge-success' : 'badge-warning'}`}>{j.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );
      default: return null;
    }
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="logo-container">
          <Music2 size={32} color="var(--primary)" />
          <div>
            <span className="logo-text" style={{ fontSize: '1.2rem', display: 'block' }}>J. M. Olivares</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Docente</span>
          </div>
        </div>
        <nav>
          <a href="#" className={`nav-link ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => setActiveTab('attendance')}>
            <Clock size={20} /> Asistencia
          </a>
          <a href="#" className={`nav-link ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')}>
            <Calendar size={20} /> Próximas Clases
          </a>
          <a href="#" className={`nav-link ${activeTab === 'justifications' ? 'active' : ''}`} onClick={() => setActiveTab('justifications')}>
            <FileUp size={20} /> Justificaciones
          </a>
          <a href="#" className={`nav-link ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
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
        <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p className="text-muted" style={{ fontWeight: 600 }}>Bienvenido de nuevo</p>
            <h1 style={{ fontSize: '2.5rem' }}>Prof. Carlos Rangel</h1>
          </div>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1.5rem' }}>
            <Bell size={20} className="text-muted" />
            <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <User size={24} />
            </div>
          </div>
        </header>
        {renderContent()}
      </main>

      <AnimatePresence>
        {showLogoutModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyCenter: 'center', backdropFilter: 'blur(4px)' }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="card" style={{ maxWidth: '400px', margin: 'auto', textAlign: 'center', padding: '2.5rem' }}>
              <div style={{ background: 'rgba(212, 122, 77, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <LogOut size={30} className="text-terracotta" />
              </div>
              <h3 className="brand-font" style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>¿Cerrar Sesión?</h3>
              <p className="text-muted" style={{ marginBottom: '2rem' }}>Asegúrate de haber marcado tu salida antes de retirarte.</p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn-primary" style={{ flex: 1 }} onClick={onLogout}>Salir</button>
                <button className="btn-outline" style={{ flex: 1 }} onClick={() => setShowLogoutModal(false)}>Cancelar</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <section className="grid-cols-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
              <div className="card">
                <p className="text-muted" style={{ fontSize: '0.875rem' }}>Asistencia Hoy</p>
                <h2 style={{ fontSize: '2rem' }}>92%</h2>
                <div style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', marginTop: '4px' }}><TrendingUp size={14} /> +3.2%</div>
              </div>
              <div className="card">
                <p className="text-muted" style={{ fontSize: '0.875rem' }}>Retrasos</p>
                <h2 style={{ fontSize: '2rem', color: 'var(--warning)' }}>4</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Últimos 15 min</p>
              </div>
              <div className="card">
                <p className="text-muted" style={{ fontSize: '0.875rem' }}>Inasistencias</p>
                <h2 style={{ fontSize: '2rem', color: 'var(--danger)' }}>2</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sin justificar</p>
              </div>
              <div className="card">
                <p className="text-muted" style={{ fontSize: '0.875rem' }}>Repuestas</p>
                <h2 style={{ fontSize: '2rem', color: 'var(--forest)' }}>12</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Este semestre</p>
              </div>
            </section>

            <div className="grid-cols-2" style={{ marginBottom: '3rem' }}>
              <div className="card">
                <h3>Tendencia de Cumplimiento</h3>
                <div style={{ height: '300px', marginTop: '2rem' }}>
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
                <h3>Distribución Docente</h3>
                <div style={{ display: 'flex', alignItems: 'center', height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={distributionData} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                        {distributionData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ minWidth: '120px' }}>
                    {distributionData.map(d => (
                      <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <div style={{ width: '12px', height: '12px', background: d.color, borderRadius: '3px' }}></div>
                        <span style={{ fontSize: '0.8rem' }}>{d.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 'faculty':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 className="brand-font" style={{ fontSize: '2rem' }}>Personal Docente</h2>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="glass" style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 1rem', borderRadius: '12px' }}>
                  <Search size={18} className="text-muted" />
                  <input type="text" placeholder="Buscar profesor..." style={{ border: 'none', background: 'none', marginLeft: '0.5rem', outline: 'none' }} />
                </div>
                <button className="btn-primary" style={{ background: 'var(--secondary)' }}><UserPlus size={18} /> Agregar</button>
              </div>
            </div>
            <div className="card">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', color: 'var(--text-muted)', borderBottom: '1px solid #eee' }}>
                    <th style={{ padding: '1rem' }}>Profesor</th>
                    <th style={{ padding: '1rem' }}>Cátedra</th>
                    <th style={{ padding: '1rem' }}>Contacto</th>
                    <th style={{ padding: '1rem' }}>Estado</th>
                    <th style={{ padding: '1rem' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {facultyMembers.map(f => (
                    <tr key={f.id} style={{ borderBottom: '1px solid #fafafa' }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 700 }}>{f.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{f.email}</div>
                      </td>
                      <td style={{ padding: '1rem' }}>{f.chair}</td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Mail size={14} className="text-muted" />
                          <Phone size={14} className="text-muted" />
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`badge ${f.status === 'Activo' ? 'badge-success' : 'badge-warning'}`}>{f.status}</span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}><MoreVertical size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        );
      case 'chairs':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 className="brand-font" style={{ fontSize: '2rem' }}>Cátedras e Instancias</h2>
              <button className="btn-primary" style={{ background: 'var(--secondary)' }} onClick={() => setShowModal(true)}>
                <Plus size={18} /> Nueva Cátedra
              </button>
            </div>
            <div className="grid-cols-2">
              {academicChairs.map(c => (
                <div key={c.id} className="card" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <span className="badge" style={{ background: '#eee', marginBottom: '0.5rem' }}>{c.code}</span>
                    <h3 style={{ fontSize: '1.25rem' }}>{c.name}</h3>
                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>Modalidad: {c.type}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--secondary)' }}>{c.students}</div>
                    <p style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>Estudiantes</p>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>{c.faculty} docentes</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      case 'reports':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 className="brand-font" style={{ fontSize: '2rem' }}>Reportes Mensuales</h2>
              <button className="btn-primary" style={{ background: 'var(--secondary)' }}><Download size={18} /> Exportar Reporte Anual</button>
            </div>
            <div className="grid-cols-3">
              {['Diciembre 2025', 'Noviembre 2025', 'Octubre 2025'].map(month => (
                <div key={month} className="card">
                  <div style={{ background: 'var(--bg-cream)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <FileBox className="text-forest" />
                    <span style={{ fontWeight: 700 }}>{month}</span>
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
                  <button className="btn-outline" style={{ width: '100%', fontSize: '0.85rem' }}>Generar PDF</button>
                </div>
              ))}
            </div>
          </motion.div>
        );
      case 'settings':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="brand-font" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Configuración del Sistema</h2>
            <div className="grid-cols-2" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 2fr', gap: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {['General', 'Notificaciones', 'Seguridad', 'Dispositivos'].map(item => (
                  <button key={item} className="nav-link" style={{ textAlign: 'left', color: 'var(--text-main)', border: '1px solid transparent' }}>
                    {item === 'General' && <Globe size={18} style={{ marginRight: '1rem' }} />}
                    {item === 'Notificaciones' && <BellRing size={18} style={{ marginRight: '1rem' }} />}
                    {item === 'Seguridad' && <ShieldCheck size={18} style={{ marginRight: '1rem' }} />}
                    {item === 'Dispositivos' && <Smartphone size={18} style={{ marginRight: '1rem' }} />}
                    {item}
                  </button>
                ))}
              </div>
              <div className="card">
                <h3 style={{ marginBottom: '2rem' }}>Ajustes del Conservatorio</h3>
                <div className="input-group">
                  <label>Nombre de la Institución</label>
                  <input type="text" defaultValue="Escuela de Música Juan Manuel Olivares" />
                </div>
                <div className="grid-cols-2">
                  <div className="input-group">
                    <label>Hora de Apertura</label>
                    <input type="time" defaultValue="07:00" />
                  </div>
                  <div className="input-group">
                    <label>Tolerancia Retrasos (min)</label>
                    <input type="number" defaultValue="15" />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button className="btn-primary" style={{ background: 'var(--secondary)' }}>Guardar Cambios</button>
                  <button className="btn-outline">Restaurar Valores</button>
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
      <aside className="sidebar" style={{ background: 'var(--secondary)' }}>
        <div className="logo-container">
          <Music2 size={32} color="var(--primary)" />
          <div>
            <span className="logo-text" style={{ fontSize: '1.2rem', display: 'block' }}>J. M. Olivares</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Administrador</span>
          </div>
        </div>
        <nav>
          <a href="#" className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={20} /> Resumen
          </a>
          <a href="#" className={`nav-link ${activeTab === 'faculty' ? 'active' : ''}`} onClick={() => setActiveTab('faculty')}>
            <Users size={20} /> Personal Docente
          </a>
          <a href="#" className={`nav-link ${activeTab === 'chairs' ? 'active' : ''}`} onClick={() => setActiveTab('chairs')}>
            <GraduationCap size={20} /> Cátedras / Horas
          </a>
          <a href="#" className={`nav-link ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
            <FileBox size={20} /> Reportes
          </a>
          <a href="#" className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <Settings size={20} /> Configuración
          </a>
          <div style={{ marginTop: 'auto' }}>
            <a href="#" className="nav-link" onClick={onLogout}><LogOut size={20} /> Salir</a>
          </div>
        </nav>
      </aside>

      <main className="main-content">
        <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem' }}>{activeTab === 'dashboard' ? 'Control de Asistencia' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
            <p className="text-muted">Dirección Académica • Gestión General</p>
          </div>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1.5rem' }}>
            <BellRing size={20} className="text-forest" />
            <div style={{ width: '40px', height: '40px', background: 'var(--secondary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <ShieldCheck size={24} />
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
                <h2 className="brand-font">Nueva Cátedra</h2>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
              </div>
              <div className="input-group">
                <label>Nombre de la Cátedra</label>
                <input type="text" placeholder="Ej: Cátedra de Arpa" />
              </div>
              <div className="grid-cols-2">
                <div className="input-group">
                  <label>Tipo</label>
                  <select><option>Individual</option><option>Grupal</option></select>
                </div>
                <div className="input-group">
                  <label>Código</label>
                  <input type="text" placeholder="AR-005" />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button className="btn-primary" style={{ flex: 1, background: 'var(--secondary)' }} onClick={() => setShowModal(false)}>Crear Materia</button>
                <button className="btn-outline" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancelar</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

function App() {
  const [view, setView] = useState('login');
  const handleLogin = (role) => setView(role);
  const handleLogout = () => setView('login');

  return (
    <AnimatePresence mode="wait">
      {view === 'login' && <LoginPage key="login" onLogin={handleLogin} />}
      {view === 'teacher' && <TeacherDashboard key="teacher" onLogout={handleLogout} />}
      {view === 'admin' && <AdminDashboard key="admin" onLogout={handleLogout} />}
    </AnimatePresence>
  );
}

export default App
