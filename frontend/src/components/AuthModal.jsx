import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import styles from './Modal.module.css'

const COLLEGES = ['RGPV','IIT Indore','DAVV','SSTC','NRI College','ITM University','Sage University','Other']

export default function AuthModal({ mode, onClose, onSwitch }) {
  const { login, register } = useAuth()
  const [form, setForm] = useState({ name: '', phone: '', password: '', college: '', year: '' })
  const [loading, setLoading] = useState(false)
  const isLogin = mode === 'login'

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    if (!form.phone || !form.password) return toast.error('Phone and password required')
    if (!isLogin && !form.name) return toast.error('Name is required')
    setLoading(true)
    try {
      if (isLogin) {
        await login(form.phone, form.password)
        toast.success('Welcome back! 👋')
      } else {
        await register(form)
        toast.success('Account created! 🎉')
      }
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose}>✕</button>
        <h2 className={styles.title}>{isLogin ? 'Login to StudyServe' : 'Create Account'}</h2>
        <p className={styles.sub}>{isLogin ? 'Track orders & get exclusive student discounts.' : 'Join 5000+ students using StudyServe.'}</p>

        {!isLogin && (
          <div className={styles.group}>
            <label>Full Name</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your full name" />
          </div>
        )}
        <div className={styles.group}>
          <label>Mobile Number</label>
          <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="10-digit number" maxLength={10} />
        </div>
        <div className={styles.group}>
          <label>Password</label>
          <input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Enter password" />
        </div>
        {!isLogin && (
          <div className={styles.row}>
            <div className={styles.group}>
              <label>College</label>
              <select value={form.college} onChange={e => set('college', e.target.value)}>
                <option value="">Select</option>
                {COLLEGES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className={styles.group}>
              <label>Year</label>
              <select value={form.year} onChange={e => set('year', e.target.value)}>
                <option value="">Select</option>
                <option>1st Year</option><option>2nd Year</option>
                <option>3rd Year</option><option>4th Year</option>
              </select>
            </div>
          </div>
        )}
        <button className={styles.submit} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
        </button>
        <p className={styles.switch}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => onSwitch(isLogin ? 'signup' : 'login')}>
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  )
}
