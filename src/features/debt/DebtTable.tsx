import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { deleteDebt, toggleComplete, adjustDebtAmount } from '../../store/debtSlice';
import { logChange } from '../../store/historySlice';
import { Edit2, Trash2, ArrowUpRight, ArrowDownLeft, Check, ChevronDown, ChevronUp, Save } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Props {
    onEdit: (id: string) => void;
}

export default function DebtTable({ onEdit }: Props) {
    const debts = useAppSelector((state) => state.debt.items);
    const dispatch = useAppDispatch();
    const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
    const [adjustAmount, setAdjustAmount] = useState('');

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

    const handleToggleComplete = (id: string, description: string, currentStatus: boolean) => {
        dispatch(toggleComplete(id));
        dispatch(logChange({
            id: uuidv4(),
            debtId: id,
            changeType: 'UPDATE',
            timestamp: new Date().toISOString(),
            user: 'CurrentUser',
            details: `Marked "${description}" as ${!currentStatus ? 'completed' : 'active'}`
        }));
    };

    const toggleExpand = (id: string) => {
        if (expandedRowId === id) {
            setExpandedRowId(null);
            setAdjustAmount('');
        } else {
            setExpandedRowId(id);
            setAdjustAmount('');
        }
    };

    const handleAdjustSubmit = (e: React.FormEvent, id: string, currentAmount: number, description: string) => {
        e.preventDefault();
        const amountVal = parseFloat(adjustAmount);
        if (isNaN(amountVal) || amountVal === 0) return;

        // If current amount is positive (Receivable), adding a positive amount increases debt, negative decreases.
        // If current amount is negative (Payable), adding a positive amount (payment) should bring it closer to 0.
        // Let's assume the user enters the amount of the transaction.
        // If I owe 100 (amount: -100). I pay 20. New amount should be -80. So I add +20.
        // If I am owed 100 (amount: 100). They pay 20. New amount should be 80. So I add -20.

        // Wait, the user request says "update a small amount of rupees that receiving/paying".
        // If I am receiving money (for a receivable), the debt amount should decrease.
        // If I am paying money (for a payable), the debt amount (absolute value) should decrease.

        // Let's implement it as "Add to balance".
        // If user enters +10, it adds 10 to the balance.
        // If user enters -10, it subtracts 10 from the balance.
        // This is the most flexible. The user can decide the sign.
        // BUT, for better UX on "receiving/paying":
        // If it's a receivable (positive), receiving money means REDUCING the balance. So input should be subtracted.
        // If it's a payable (negative), paying money means REDUCING the absolute balance (adding to the negative).

        // Let's just stick to "Adjust Balance" and let user enter signed value? 
        // Or maybe "Transaction Amount":
        // If Receivable: "Received: [ ]". This implies subtraction.
        // If Payable: "Paid: [ ]". This implies addition (to negative).

        // Let's try to be smart.
        // If amount > 0 (Receivable): User enters X. We subtract X. (Received X).
        // If amount < 0 (Payable): User enters X. We add X. (Paid X).

        const adjustment = currentAmount >= 0 ? -amountVal : amountVal;

        dispatch(adjustDebtAmount({ id, amount: adjustment }));
        dispatch(logChange({
            id: uuidv4(),
            debtId: id,
            changeType: 'UPDATE',
            timestamp: new Date().toISOString(),
            user: 'CurrentUser',
            details: `Adjusted "${description}" by ${adjustment} (Transaction: ${amountVal})`
        }));

        setExpandedRowId(null);
        setAdjustAmount('');
    };

    const totalAmount = debts.reduce((sum, item) => item.completed ? sum : sum + item.amount, 0);

    return (
        <div className="card">
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Active Entries</h3>
                <div style={{ fontSize: '1.1rem' }}>
                    Total (Active): <span style={{ color: totalAmount >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold' }}>
                        ₹{totalAmount.toFixed(2)}
                    </span>
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th style={{ width: '40px' }}></th>
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
                                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                                    No entries found. Click "Add New Entry" to get started.
                                </td>
                            </tr>
                        ) : (
                            debts.map((debt) => (
                                <>
                                    <tr key={debt.id} className="animate-fade-in" style={{ opacity: debt.completed ? 0.5 : 1 }}>
                                        <td>
                                            <button
                                                className="btn btn-icon"
                                                onClick={() => toggleExpand(debt.id)}
                                                disabled={debt.completed}
                                            >
                                                {expandedRowId === debt.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </button>
                                        </td>
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
                                        <td style={{ textDecoration: debt.completed ? 'line-through' : 'none' }}>{debt.description}</td>
                                        <td>{debt.creditor}</td>
                                        <td>{new Date(debt.createdAt).toLocaleDateString()}</td>
                                        <td style={{ fontWeight: 'bold', color: debt.amount >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                                            {debt.amount >= 0 ? '+' : ''}{debt.amount.toFixed(2)}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    className="btn btn-icon"
                                                    style={{
                                                        color: (debt.completed || Math.abs(debt.amount) > 0.01) ? 'var(--text-secondary)' : 'var(--success)',
                                                        cursor: (debt.completed || Math.abs(debt.amount) > 0.01) ? 'not-allowed' : 'pointer'
                                                    }}
                                                    onClick={() => handleToggleComplete(debt.id, debt.description, debt.completed)}
                                                    disabled={debt.completed || Math.abs(debt.amount) > 0.01}
                                                    title={
                                                        debt.completed
                                                            ? "This entry is completed"
                                                            : Math.abs(debt.amount) > 0.01
                                                                ? "Balance must be 0 to complete"
                                                                : "Mark as Completed"
                                                    }
                                                >
                                                    <Check size={16} />
                                                </button>
                                                <button
                                                    className="btn btn-icon"
                                                    style={{ color: 'var(--accent-primary)' }}
                                                    onClick={() => onEdit(debt.id)}
                                                    disabled={debt.completed}
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
                                    {expandedRowId === debt.id && !debt.completed && (
                                        <tr className="animate-fade-in" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                                            <td colSpan={7} style={{ padding: '1rem' }}>
                                                <form
                                                    onSubmit={(e) => handleAdjustSubmit(e, debt.id, debt.amount, debt.description)}
                                                    style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
                                                >
                                                    <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                                                        {debt.amount >= 0 ? 'Record Receipt:' : 'Record Payment:'}
                                                    </span>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        className="input-field"
                                                        style={{ width: '150px', padding: '0.25rem 0.5rem' }}
                                                        placeholder="Amount"
                                                        value={adjustAmount}
                                                        onChange={(e) => setAdjustAmount(e.target.value)}
                                                        autoFocus
                                                    />
                                                    <button type="submit" className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.9rem' }}>
                                                        <Save size={14} style={{ marginRight: '4px' }} /> Update Balance
                                                    </button>
                                                </form>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
