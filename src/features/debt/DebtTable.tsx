import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { deleteDebt } from '../../store/debtSlice';
import { logChange } from '../../store/historySlice';
import { Edit2, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Props {
    onEdit: (id: string) => void;
}

export default function DebtTable({ onEdit }: Props) {
    const debts = useAppSelector((state) => state.debt.items);
    const dispatch = useAppDispatch();

    const handleDelete = (id: string, description: string) => {
        if (confirm('Are you sure you want to delete this entry?')) {
            dispatch(deleteDebt(id));
            dispatch(logChange({
                id: uuidv4(),
                debtId: id,
                changeType: 'DELETE',
                timestamp: new Date().toISOString(),
                user: 'CurrentUser',
                details: `Deleted entry: ${description}`
            }));
        }
    };

    const totalAmount = debts.reduce((sum, item) => sum + item.amount, 0);

    return (
        <div className="card">
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Active Entries</h3>
                <div style={{ fontSize: '1.1rem' }}>
                    Total: <span style={{ color: totalAmount >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold' }}>
                        ₹{totalAmount.toFixed(2)}
                    </span>
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Description</th>
                            <th>Creditor/Debtor</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {debts.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                                    No entries found. Click "Add New Entry" to get started.
                                </td>
                            </tr>
                        ) : (
                            debts.map((debt) => (
                                <tr key={debt.id} className="animate-fade-in">
                                    <td>
                                        {debt.amount >= 0 ? (
                                            <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                <ArrowDownLeft size={12} /> Receivable
                                            </span>
                                        ) : (
                                            <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                <ArrowUpRight size={12} /> Payable
                                            </span>
                                        )}
                                    </td>
                                    <td>{debt.description}</td>
                                    <td>{debt.creditor}</td>
                                    <td>{new Date(debt.createdAt).toLocaleDateString()}</td>
                                    <td style={{ fontWeight: 'bold', color: debt.amount >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                                        {debt.amount >= 0 ? '+' : ''}{debt.amount.toFixed(2)}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                className="btn btn-icon"
                                                style={{ color: 'var(--accent-primary)' }}
                                                onClick={() => onEdit(debt.id)}
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                className="btn btn-icon"
                                                style={{ color: 'var(--danger)' }}
                                                onClick={() => handleDelete(debt.id, debt.description)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
