import { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Phone, Mail, MapPin, Droplet, User, Calendar, Stethoscope,
  Activity, Shield, Bell
} from 'lucide-react';
import { useAppDispatch, useAppSelector, setSelectedPatient, addNotification } from '../../app/store';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { showPatientUpdateNotification } from '../../services/notifications';
import './PatientDetailPage.css';

function VitalCard({ label, value, unit, status, }: { label: string; value: string; unit: string; status: string; }) {
  const color = status === 'normal' ? 'var(--color-emerald-400)'
    : status === 'warning' ? 'var(--color-amber-400)'
    : 'var(--color-rose-400)';
  return (
    <div className="vital-card" style={{ borderColor: `${color}25` }}>
      <div className="vital-value" style={{ color }}>{value}<span className="vital-unit">{unit}</span></div>
      <div className="vital-label">{label}</div>
      <div className="vital-status">
        <span style={{ color, background: `${color}15`, border: `1px solid ${color}25` }} className="vital-status-badge">
          {status}
        </span>
      </div>
    </div>
  );
}

export function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { patients } = useAppSelector(state => state.patients);

  const patient = patients.find((p) => p.id === id);

  const handleNotify = useCallback((name: string) => {
    showPatientUpdateNotification(name);
    dispatch(addNotification({
      title: 'Patient Update',
      message: `${name}'s vitals have been updated by nursing staff.`,
      type: 'info'
    }));
  }, [dispatch]);

  useEffect(() => {
    if (patient) {
      dispatch(setSelectedPatient(patient));
      // Demo: fire notification after 3 seconds
      const t = setTimeout(() => {
        handleNotify(patient.name);
      }, 3000);
      return () => { clearTimeout(t); dispatch(setSelectedPatient(null)); };
    }
  }, [patient, dispatch, handleNotify]);

  if (!patient) {
    return (
      <div className="patient-not-found" id="patient-not-found">
        <span className="not-found-icon">👤</span>
        <h2>Patient Not Found</h2>
        <p>No patient record matched ID: {id}</p>
        <button className="back-btn" onClick={() => navigate('/patients')}>
          <ArrowLeft size={16} /> Back to Patients
        </button>
      </div>
    );
  }

  return (
    <div className="patient-detail-page animate-fade-in" id="patient-detail-page">
      {/* Header */}
      <div className="pd-header">
        <button className="back-btn" onClick={() => navigate('/patients')} id="back-to-patients-btn">
          <ArrowLeft size={16} /> Back to Patients
        </button>
        <button
          className="notif-trigger-btn"
          id="trigger-patient-notification-btn"
          onClick={() => handleNotify(patient.name)}
        >
          <Bell size={14} /> Notify Vitals Update
        </button>
      </div>

      {/* Profile Card */}
      <div className="pd-profile-card" id="patient-profile-card">
        <div className="pd-profile-left">
          <Avatar initials={patient.avatarInitials} color={patient.avatarColor} size="xl" name={patient.name} />
          <div className="pd-profile-info">
            <h2 className="pd-name">{patient.name}</h2>
            <div className="pd-sub">{patient.id} · {patient.age} years · {patient.gender}</div>
            <div className="pd-tags">
              <Badge dot>{patient.status}</Badge>
              <span className="pd-dept-tag">{patient.department}</span>
            </div>
          </div>
        </div>
        <div className="pd-profile-right">
          <div className="pd-contact-item"><Phone size={14} />{patient.phone}</div>
          <div className="pd-contact-item"><Mail size={14} />{patient.email}</div>
          <div className="pd-contact-item"><MapPin size={14} />{patient.address}</div>
          <div className="pd-contact-item"><Droplet size={14} /><strong style={{color:'var(--color-rose-400)'}}>{patient.bloodGroup}</strong></div>
          <div className="pd-contact-item"><Shield size={14} />{patient.insurance}</div>
        </div>
      </div>

      {/* Vitals */}
      <div className="pd-section" id="vitals-section">
        <h3 className="pd-section-title"><Activity size={16} />Current Vitals</h3>
        <div className="vitals-grid">
          {patient.vitals.map((v) => (
            <VitalCard key={v.label} label={v.label} value={v.value} unit={v.unit} status={v.status} />
          ))}
        </div>
      </div>

      {/* Details grid */}
      <div className="pd-two-col">
        {/* Medications */}
        <div className="pd-info-card" id="medications-card">
          <h3 className="pd-section-title"><Stethoscope size={16} />Current Medications</h3>
          <ul className="pd-list">
            {patient.medications.map((m) => (
              <li key={m} className="pd-list-item">
                <span className="pd-list-dot" style={{ background: 'var(--color-primary-400)' }} />
                {m}
              </li>
            ))}
          </ul>
        </div>

        {/* Allergies */}
        <div className="pd-info-card" id="allergies-card">
          <h3 className="pd-section-title">⚠️ Known Allergies</h3>
          {patient.allergies.length === 0 ? (
            <div className="pd-no-allergies">No known allergies</div>
          ) : (
            <div className="allergy-tags">
              {patient.allergies.map((a) => (
                <span key={a} className="allergy-tag">{a}</span>
              ))}
            </div>
          )}

          <h3 className="pd-section-title" style={{marginTop:'24px'}}><User size={16} />Attending Physician</h3>
          <div className="pd-doctor-info">
            <div className="pd-doctor-name">{patient.doctor}</div>
            <div className="pd-doctor-dept">{patient.department}</div>
          </div>

          <h3 className="pd-section-title" style={{marginTop:'24px'}}><Calendar size={16} />Admission Date</h3>
          <div className="pd-date">
            {new Date(patient.admittedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Visit History */}
      <div className="pd-section" id="visit-history-section">
        <h3 className="pd-section-title"><Calendar size={16} />Visit History</h3>
        <div className="timeline">
          {patient.visits.map((v, i) => (
            <div key={v.id} className="timeline-item" id={`visit-${v.id}`}>
              <div className="timeline-marker">
                <div className="timeline-dot" style={{ background: i === 0 ? 'var(--color-primary-400)' : 'var(--border-default)' }} />
                {i < patient.visits.length - 1 && <div className="timeline-line" />}
              </div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <span className="timeline-type">{v.type}</span>
                  <span className="timeline-date">{new Date(v.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="timeline-diagnosis">{v.diagnosis}</div>
                <div className="timeline-notes">{v.notes}</div>
                <div className="timeline-doctor">Dr: {v.doctor}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
