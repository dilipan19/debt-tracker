import { useAppSelector } from '../../store/hooks';
import { GitCommit, PlusCircle, Edit, Trash } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function HistoryView() {
    const logs = useAppSelector((state) => state.history.logs);

    const getIcon = (type: string) => {
        switch (type) {
            case 'CREATE': return <PlusCircle size={16} color="var(--success)" />;
            case 'UPDATE': return <Edit size={16} color="var(--accent-primary)" />;
            case 'DELETE': return <Trash size={16} color="var(--danger)" />;
            default: return <GitCommit size={16} />;
        }
    };

    return (
        <div className="card">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Activity Log</h3>

            <div style={{ position: 'relative', paddingLeft: '1rem' }}>
                {/* Vertical Line */}
                <div style={{
                    position: 'absolute',
                    left: '19px',
                    top: '0',
                    bottom: '0',
                    width: '2px',
                    backgroundColor: 'var(--border)'
                }}></div>

                {logs.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', paddingLeft: '2rem' }}>No activity recorded yet.</p>
                ) : (
                    logs.map((log) => (
                        <div key={log.id} className="animate-fade-in" style={{
                            display: 'flex',
                            gap: '1rem',
                            marginBottom: '1.5rem',
                            position: 'relative'
                        }}>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                backgroundColor: 'var(--bg-secondary)',
                                border: '2px solid var(--border)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1,
                                marginTop: '4px'
                            }}>
                                {getIcon(log.changeType)}
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                                        {log.user} <span style={{ fontWeight: 'normal', color: 'var(--text-secondary)' }}>performed</span> {log.changeType}
                                    </span>
                                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                        {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                                    </span>
                                </div>
                                <div style={{
                                    backgroundColor: 'var(--bg-primary)',
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius)',
                                    border: '1px solid var(--border)',
                                    fontSize: '0.9rem',
                                    color: 'var(--text-secondary)'
                                }}>
                                    {log.details}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
