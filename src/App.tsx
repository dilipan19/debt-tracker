import { useState } from 'react';
import { LayoutDashboard, History, Plus } from 'lucide-react';
import DebtTable from './features/debt/DebtTable';
import HistoryView from './features/history/HistoryView';
import DebtForm from './features/debt/DebtForm';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { markRead } from './store/historySlice';
import './styles/global.css';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history'>('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDebtId, setEditingDebtId] = useState<string | null>(null);

  const unreadCount = useAppSelector((state) => state.history.unreadCount);
  const dispatch = useAppDispatch();

  const handleTabChange = (tab: 'dashboard' | 'history') => {
    setActiveTab(tab);
    if (tab === 'history') {
      dispatch(markRead());
    }
  };

  const handleEdit = (id: string) => {
    setEditingDebtId(id);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingDebtId(null);
  };

  return (
    <div className="app-container">
      <nav style={{
        borderBottom: '1px solid var(--border)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'var(--bg-secondary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.25rem' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--accent-primary)', borderRadius: '8px' }}></div>
          DebtTracker
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : ''}`}
            style={{ background: activeTab === 'dashboard' ? '' : 'transparent', color: activeTab === 'dashboard' ? '' : 'var(--text-secondary)' }}
            onClick={() => handleTabChange('dashboard')}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button
            className={`btn ${activeTab === 'history' ? 'btn-primary' : ''}`}
            style={{
              background: activeTab === 'history' ? '' : 'transparent',
              color: activeTab === 'history' ? '' : 'var(--text-secondary)',
              position: 'relative'
            }}
            onClick={() => handleTabChange('history')}
          >
            <History size={18} />
            History
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                background: 'var(--danger)',
                color: 'white',
                fontSize: '10px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      <main className="container animate-fade-in">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', marginTop: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {activeTab === 'dashboard' ? 'Overview' : 'Change History'}
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              {activeTab === 'dashboard' ? 'Manage your debts and credits efficiently.' : 'Track all modifications to your records.'}
            </p>
          </div>

          {activeTab === 'dashboard' && (
            <button className="btn btn-primary" onClick={() => setIsFormOpen(true)}>
              <Plus size={18} />
              Add New Entry
            </button>
          )}
        </header>

        {activeTab === 'dashboard' ? (
          <DebtTable onEdit={handleEdit} />
        ) : (
          <HistoryView />
        )}
      </main>

      {isFormOpen && (
        <DebtForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          editId={editingDebtId}
        />
      )}
    </div>
  );
}

export default App;
