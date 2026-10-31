import { useState } from 'react'
import axios from '../api'
import toast from 'react-hot-toast'
import styles from './Scholarship.module.css'

const COLLEGES = ['RGPV','IIT Indore','DAVV','SSTC','NRI College','ITM University','Sage University','Other']
const SCHOLARSHIP_TYPES = ['MP Scholarship','OBC Scholarship','SC/ST Scholarship','Merit Scholarship','Central Sector Scheme','NSP Scholarship','Other']

export default function ScholarshipAffidavit() {
  const [form, setForm] = useState({ studentName:'', phone:'', college:'', year:'', scholarshipType:'', address:'' })
  const [loading, setLoading] = useState(false)
  const [requestId, setRequestId] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    const { studentName, phone, college, year, scholarshipType, address } = form
    if (!studentName || !phone || !college || !year || !scholarshipType || !address)
      return toast.error('Please fill all fields')
    if (phone.length < 10) return toast.error('Enter valid 10-digit mobile number')
    setLoading(true)
    try {
      const res = await axios.post('/api/affidavit', form)
      setRequestId(res.data.requestId)
      toast.success('Affidavit requested! We\'ll deliver soon.')
    } catch {
      toast.error('Failed to submit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (requestId) return (
    <div className={styles.page}>
      <div className={styles.successBox}>
        <div className={styles.successIcon}>🎓</div>
        <h2 className={styles.successTitle}>Affidavit Requested!</h2>
        <p className={styles.successSub}>Your scholarship affidavit is being prepared and will be delivered to your address.</p>
        <div className={styles.reqId}>
          <small>Request ID</small>
          <strong>#{requestId}</strong>
        </div>
        <button className={styles.submit} onClick={() => { setRequestId(null); setForm({studentName:'',phone:'',college:'',year:'',scholarshipType:'',address:''}) }}>
          Submit Another
        </button>
      </div>
    </div>
  )

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.glow} />
        <span className={styles.tag}>Scholarship Affidavit</span>
        <h1 className={styles.title}>Instant Affidavit for Your Scholarship</h1>
        <p className={styles.sub}>Official, court-stamp-verified affidavits for scholarship applications across all major colleges. Suitable for 1st to final year students.</p>

        <div className={styles.colleges}>
          {['RGPV','IIT Indore','DAVV','SSTC','NRI College','ITM','Sage University','+ Any College'].map((c, i) => (
            <span key={c} className={`${styles.pill} ${i === 0 || i === 7 ? styles.active : ''}`}>{c}</span>
          ))}
        </div>

        <div className={styles.features}>
          <span>✅ Court-verified stamp</span>
          <span>✅ Same-day delivery</span>
          <span>✅ All scholarship types</span>
        </div>
      </div>

      <div className={styles.formCard}>
        <h2 className={styles.formTitle}>📋 Request Your Affidavit</h2>

        <div className={styles.group}>
          <label>Student Full Name *</label>
          <input value={form.studentName} onChange={e => set('studentName', e.target.value)} placeholder="Enter your full name" />
        </div>
        <div className={styles.row}>
          <div className={styles.group}>
            <label>College / University *</label>
            <select value={form.college} onChange={e => set('college', e.target.value)}>
              <option value="">Select College</option>
              {COLLEGES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className={styles.group}>
            <label>Academic Year *</label>
            <select value={form.year} onChange={e => set('year', e.target.value)}>
              <option value="">Select Year</option>
              <option>1st Year</option><option>2nd Year</option>
              <option>3rd Year</option><option>4th Year</option>
            </select>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.group}>
            <label>Scholarship Type *</label>
            <select value={form.scholarshipType} onChange={e => set('scholarshipType', e.target.value)}>
              <option value="">Select Type</option>
              {SCHOLARSHIP_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className={styles.group}>
            <label>Mobile Number *</label>
            <input type="tel" maxLength={10} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="10-digit number" />
          </div>
        </div>
        <div className={styles.group}>
          <label>Delivery Address *</label>
          <input value={form.address} onChange={e => set('address', e.target.value)} placeholder="Hostel / Home address for delivery" />
        </div>

        <div className={styles.priceRow}>
          <span>Price: <strong>₹50 per affidavit</strong></span>
          <button className={styles.submit} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : '🎓 Request Affidavit — ₹50'}
          </button>
        </div>
      </div>
    </div>
  )
}
