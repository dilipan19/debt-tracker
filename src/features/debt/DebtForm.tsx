import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addDebt, updateDebt } from '../../store/debtSlice';
import { logChange } from '../../store/historySlice';
import { X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    editId: string | null;
}

export default function DebtForm({ isOpen, onClose, editId }: Props) {
    const dispatch = useAppDispatch();
    const existingDebt = useAppSelector((state) =>
        editId ? state.debt.items.find(i => i.id === editId) : null
    );

    const [formData, setFormData] = useState({
        description: '',
        creditor: '',
        amount: '',
        type: 'receivable' // 'receivable' (+) or 'payable' (-)
    });

    useEffect(() => {
        if (existingDebt) {
            setFormData({
                description: existingDebt.description,
                creditor: existingDebt.creditor,
                amount: Math.abs(existingDebt.amount).toString(),
                type: existingDebt.amount >= 0 ? 'receivable' : 'payable'
            });
        } else {
            setFormData({ description: '', creditor: '', amount: '', type: 'receivable' });
        }
    }, [existingDebt, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const amountVal = parseFloat(formData.amount);
        if (isNaN(amountVal)) return;

        const finalAmount = formData.type === 'receivable' ? amountVal : -amountVal;

        if (editId && existingDebt) {
            // Update
            dispatch(updateDebt({
                ...existingDebt,
                description: formData.description,
                creditor: formData.creditor,
                amount: finalAmount,
                updatedAt: new Date().toISOString()
            }));

            dispatch(logChange({
                id: uuidv4(),
                debtId: editId,
                changeType: 'UPDATE',
                timestamp: new Date().toISOString(),
                user: 'CurrentUser',
                details: `Updated "${formData.description}". Amount: ${existingDebt.amount} -> ${finalAmount}`
            }));
        } else {
            // Create
            const newId = uuidv4();
            dispatch(addDebt({
                id: newId,
                description: formData.description,
                creditor: formData.creditor,
                amount: finalAmount,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }));

            dispatch(logChange({
                id: uuidv4(),
                debtId: newId,
                changeType: 'CREATE',
                timestamp: new Date().toISOString(),
                user: 'CurrentUser',
                details: `Created entry "${formData.description}" for ${finalAmount}`
            }));
        }
        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
        }}>
            <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '500px', position: 'relative' }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                    <X size={24} />
                </button>

                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                    {editId ? 'Edit Entry' : 'New Entry'}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">Type</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="type"
                                    value="receivable"
                                    checked={formData.type === 'receivable'}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                />
                                Receivable (I am owed)
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="type"
                                    value="payable"
                                    checked={formData.type === 'payable'}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                />
                                Payable (I owe)
                            </label>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Description</label>
                        <input
                            className="input-field"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            placeholder="e.g. Dinner, Rent, Freelance work"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Person / Entity</label>
                        <input
                            className="input-field"
                            value={formData.creditor}
                            onChange={e => setFormData({ ...formData, creditor: e.target.value })}
                            placeholder="e.g. John Doe"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Amount</label>
                        <input
                            type="number"
                            step="0.01"
                            className="input-field"
                            value={formData.amount}
                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            placeholder="0.00"
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                        <button type="button" className="btn" onClick={onClose} style={{ border: '1px solid var(--border)' }}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {editId ? 'Save Changes' : 'Create Entry'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
