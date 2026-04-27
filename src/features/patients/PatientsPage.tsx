import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, List, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppDispatch, useAppSelector, setViewMode, setSearchQuery, setStatusFilter, setDepartmentFilter, setCurrentPage } from '../../app/store';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import type { Patient } from '../../types';
import './PatientsPage.css';

const STATUSES = ['All', 'Active', 'Critical', 'Recovering', 'Discharged', 'Scheduled'];
const DEPARTMENTS = ['All', 'Cardiology', 'Pulmonology', 'Orthopedics', 'Oncology', 'Neurology', 'Endocrinology', 'Psychiatry', 'Urology', 'Rheumatology'];
const PER_PAGE = 12;

function PatientGridCard({ patient, onClick }: { patient: Patient; onClick: () => void }) {
  return (
    <div className="patient-grid-card" onClick={onClick} id={`patient-card-${patient.id}`} tabIndex={0} onKeyDown={e => e.key === 'Enter' && onClick()}>
      <div className="pgc-header">
        <Avatar initials={patient.avatarInitials} color={patient.avatarColor} size="lg" name={patient.name} />
        <Badge dot>{patient.status}</Badge>
      </div>
      <div className="pgc-name">{patient.name}</div>
      <div className="pgc-id">{patient.id} · {patient.age}y · {patient.gender}</div>
      <div className="pgc-condition">{patient.condition}</div>
      <div className="pgc-meta">
        <span className="pgc-dept">{patient.department}</span>
        <span className="pgc-doctor">{patient.doctor}</span>
      </div>
      <div className="pgc-divider" />
      <div className="pgc-footer">
        <div className="pgc-blood">
          <span className="pgc-blood-icon">🩸</span>
          {patient.bloodGroup}
        </div>
        <div className="pgc-insurance">{patient.insurance}</div>
      </div>
    </div>
  );
}

function PatientListRow({ patient, onClick }: { patient: Patient; onClick: () => void }) {
  return (
    <div className="patient-list-row" onClick={onClick} id={`patient-list-row-${patient.id}`} tabIndex={0} onKeyDown={e => e.key === 'Enter' && onClick()}>
      <div className="plr-patient">
        <Avatar initials={patient.avatarInitials} color={patient.avatarColor} size="sm" name={patient.name} />
        <div>
          <div className="plr-name">{patient.name}</div>
          <div className="plr-id">{patient.id}</div>
        </div>
      </div>
      <div className="plr-cell plr-age">{patient.age} / {patient.gender[0]}</div>
      <div className="plr-cell plr-condition truncate">{patient.condition}</div>
      <div className="plr-cell plr-dept truncate">{patient.department}</div>
      <div className="plr-cell plr-doctor truncate">{patient.doctor}</div>
      <div className="plr-cell"><Badge dot>{patient.status}</Badge></div>
      <ChevronRight size={14} className="plr-arrow" />
    </div>
  );
}

export function PatientsPage() {
  const dispatch = useAppDispatch();
  const { patients, viewMode, searchQuery, statusFilter, departmentFilter, currentPage } = useAppSelector(state => state.patients);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
        || p.condition.toLowerCase().includes(q) || p.doctor.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'All' || p.status === statusFilter;
      const matchDept = departmentFilter === 'All' || p.department === departmentFilter;
      return matchSearch && matchStatus && matchDept;
    });
  }, [patients, searchQuery, statusFilter, departmentFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const goToPatient = (id: string) => navigate(`/patients/${id}`);

  return (
    <div className="patients-page animate-fade-in" id="patients-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Patient Management</h2>
          <p className="page-subtitle">{filtered.length} of {patients.length} patients</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="patients-toolbar" id="patients-toolbar">
        {/* Search */}
        <div className="patients-search">
          <Search size={15} className="patients-search-icon" />
          <input
            id="patient-search-input"
            type="search"
            placeholder="Search by name, ID, condition, doctor..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="patients-search-input"
            aria-label="Search patients"
          />
        </div>

        {/* Status Filter */}
        <div className="patients-filter">
          <Filter size={14} />
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => dispatch(setStatusFilter(e.target.value))}
            className="filter-select"
            aria-label="Filter by status"
          >
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Department Filter */}
        <div className="patients-filter">
          <select
            id="dept-filter"
            value={departmentFilter}
            onChange={(e) => dispatch(setDepartmentFilter(e.target.value))}
            className="filter-select"
            aria-label="Filter by department"
          >
            {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>

        {/* View Toggle */}
        <div className="view-toggle" id="view-toggle" role="group" aria-label="View mode toggle">
          <button
            className={`view-toggle-btn ${viewMode === 'grid' ? 'view-toggle-btn--active' : ''}`}
            onClick={() => dispatch(setViewMode('grid'))}
            id="toggle-grid-view"
            aria-pressed={viewMode === 'grid'}
            aria-label="Grid view"
            title="Grid view"
          >
            <LayoutGrid size={15} />
            <span>Grid</span>
          </button>
          <button
            className={`view-toggle-btn ${viewMode === 'list' ? 'view-toggle-btn--active' : ''}`}
            onClick={() => dispatch(setViewMode('list'))}
            id="toggle-list-view"
            aria-pressed={viewMode === 'list'}
            aria-label="List view"
            title="List view"
          >
            <List size={15} />
            <span>List</span>
          </button>
        </div>
      </div>

      {/* Status Pills */}
      <div className="status-pills" id="status-pills">
        {STATUSES.map((s) => (
          <button
            key={s}
            className={`status-pill ${statusFilter === s ? 'status-pill--active' : ''}`}
            onClick={() => dispatch(setStatusFilter(s))}
            id={`status-pill-${s.toLowerCase()}`}
          >
            {s}
            <span className="status-pill-count">
              {s === 'All' ? patients.length : patients.filter(p => p.status === s).length}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {paginated.length === 0 ? (
        <div className="patients-empty" id="patients-empty">
          <span className="patients-empty-icon">🔍</span>
          <div className="patients-empty-title">No patients found</div>
          <div className="patients-empty-sub">Try adjusting your search or filters</div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="patients-grid" id="patients-grid">
          {paginated.map((p) => (
            <PatientGridCard key={p.id} patient={p} onClick={() => goToPatient(p.id)} />
          ))}
        </div>
      ) : (
        <div className="patients-list-view" id="patients-list-view">
          <div className="plv-header">
            <div className="plr-patient">Patient</div>
            <div className="plr-cell">Age / Sex</div>
            <div className="plr-cell">Condition</div>
            <div className="plr-cell">Department</div>
            <div className="plr-cell">Doctor</div>
            <div className="plr-cell">Status</div>
            <div style={{width:'14px'}} />
          </div>
          {paginated.map((p) => (
            <PatientListRow key={p.id} patient={p} onClick={() => goToPatient(p.id)} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination" id="pagination">
          <button
            className="page-btn"
            onClick={() => dispatch(setCurrentPage(Math.max(1, currentPage - 1)))}
            disabled={currentPage === 1}
            id="prev-page-btn"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
            <button
              key={pg}
              className={`page-btn ${pg === currentPage ? 'page-btn--active' : ''}`}
              onClick={() => dispatch(setCurrentPage(pg))}
              id={`page-btn-${pg}`}
              aria-label={`Page ${pg}`}
              aria-current={pg === currentPage ? 'page' : undefined}
            >
              {pg}
            </button>
          ))}
          <button
            className="page-btn"
            onClick={() => dispatch(setCurrentPage(Math.min(totalPages, currentPage + 1)))}
            disabled={currentPage === totalPages}
            id="next-page-btn"
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
