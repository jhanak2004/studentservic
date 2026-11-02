import { useEffect, useState } from 'react'
import axios from '../api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import styles from './Modal.module.css'

const FALLBACK_COLLEGES = ['RGPV','IIT Indore','DAVV','SSTC','NRI College','ITM University','Sage University'].map(name => ({ _id: name, name }))
const OTHER_COLLEGE = '__other_college__'

export default function AuthModal({ mode, onClose, onSwitch }) {
  const { login, register } = useAuth()
  const [form, setForm] = useState({ name: '', phone: '', password: '', college: '', year: '', role: 'student', adminCode: '' })
  const [colleges, setColleges] = useState(FALLBACK_COLLEGES)
  const [customCollege, setCustomCollege] = useState('')
  const [loading, setLoading] = useState(false)
  const isLogin = mode === 'login'

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  useEffect(() => {
    if (mode !== 'signup') return
    axios.get('/api/colleges').then(res => setColleges(res.data)).catch(() => {})
  }, [mode])

  const handleSubmit = async () => {
    if (!form.phone || !form.password) return toast.error('Phone and password required')
    if (!isLogin && !form.name) return toast.error('Name is required')
    setLoading(true)
    try {
      if (isLogin) {
        await login(form.phone, form.password)
        toast.success('Welcome back! 👋')
      } else {
        const college = form.college === OTHER_COLLEGE ? customCollege.trim() : form.college
        await register({ ...form, college })
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
          <div className={styles.group}>
            <label>Join as</label>
            <select value={form.role} onChange={e => set('role', e.target.value)}>
              <option value="student">Student</option>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        )}
        {!isLogin && form.role === 'admin' && (
          <div className={styles.group}>
            <label>Admin Invitation Code</label>
            <input type="password" value={form.adminCode} onChange={e => set('adminCode', e.target.value)} placeholder="Enter the code from your administrator" autoComplete="off" />
            <small className={styles.fieldHint}>Admin registration requires an invitation code.</small>
          </div>
        )}
        {!isLogin && (
          <div className={styles.row}>
            <div className={styles.group}>
              <label>College</label>
              <select value={form.college} onChange={e => { set('college', e.target.value); if (e.target.value !== OTHER_COLLEGE) setCustomCollege('') }}>
                <option value="">Select</option>
                {colleges.map(college => <option key={college._id} value={college.name}>{college.name}</option>)}
                <option value={OTHER_COLLEGE}>Other</option>
              </select>
              {form.college === OTHER_COLLEGE && <input value={customCollege} onChange={e => setCustomCollege(e.target.value)} placeholder="Enter your college name" />}
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
