import { useState } from 'react'
import axios from '../api'
import toast from 'react-hot-toast'
import styles from './Modal.module.css'

const COLLEGES = ['RGPV','IIT Indore','DAVV','SSTC','NRI College','ITM University','Sage University','Other']

export default function BookingModal({ service, onClose }) {
  const [form, setForm] = useState({ customerName:'', phone:'', college:'', quantity:1, address:'', notes:'' })
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    if (!form.customerName || !form.phone || !form.college || !form.address)
      return toast.error('Please fill all required fields')
    if (form.phone.length < 10) return toast.error('Enter valid 10-digit mobile number')
    setLoading(true)
    try {
      const res = await axios.post('/api/orders', {
        ...form,
        service: service.name,
        serviceIcon: service.icon,
        price: service.price * form.quantity,
        paymentMethod: 'cod',
      })
      setOrderId(res.data.orderId)
      toast.success('Order placed successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  if (orderId) return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose}>✕</button>
        <div className={styles.successScreen}>
          <div className={styles.successIcon}>🎉</div>
          <div className={styles.successTitle}>Order Confirmed!</div>
          <p className={styles.successSub}>We'll deliver to your address soon.</p>
          <div className={styles.orderId}>
            <small>Your Order ID</small>
            <strong>#{orderId}</strong>
          </div>
          <button className={styles.submit} onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose}>✕</button>
        <h2 className={styles.title}>Book {service.name}</h2>
        <p className={styles.sub} style={{color:'var(--accent)'}}>{service.icon} {service.name} — ₹{service.price} {service.unit}</p>

        <div className={styles.group}>
          <label>Your Name *</label>
          <input value={form.customerName} onChange={e => set('customerName', e.target.value)} placeholder="Full name" />
        </div>
        <div className={styles.row}>
          <div className={styles.group}>
            <label>College *</label>
            <select value={form.college} onChange={e => set('college', e.target.value)}>
              <option value="">Select</option>
              {COLLEGES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className={styles.group}>
            <label>Quantity</label>
            <input type="number" min={1} value={form.quantity} onChange={e => set('quantity', parseInt(e.target.value) || 1)} />
          </div>
        </div>
        <div className={styles.group}>
          <label>Mobile Number *</label>
          <input type="tel" maxLength={10} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="10-digit number" />
        </div>
        <div className={styles.group}>
          <label>Delivery Address *</label>
          <input value={form.address} onChange={e => set('address', e.target.value)} placeholder="Hostel / Home / College gate" />
        </div>
        <div className={styles.group}>
          <label>Special Instructions</label>
          <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any specific requirements..." />
        </div>

        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'1rem'}}>
          <span style={{color:'var(--muted)', fontSize:'.9rem'}}>
            Total: <strong style={{color:'var(--accent)'}}>₹{service.price * form.quantity}</strong>
          </span>
          <button className={styles.submit} style={{width:'auto', padding:'.65rem 1.75rem'}} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Placing...' : 'Confirm & Pay (COD)'}
          </button>
        </div>
      </div>
    </div>
  )
}
