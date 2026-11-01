import { useEffect, useState } from 'react'
import axios from '../api'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import styles from './Scholarship.module.css'

const COLLEGES = ['RGPV','IIT Indore','DAVV','SSTC','NRI College','ITM University','Sage University','Other']
const SCHOLARSHIP_TYPES = ['MP Scholarship','OBC Scholarship','SC/ST Scholarship','Merit Scholarship','Central Sector Scheme','NSP Scholarship','Other']
const OTHER_COLLEGE = '__other_college__'

export default function ScholarshipAffidavit() {
  const [form, setForm] = useState({ studentName:'', phone:'', college:'', year:'', scholarshipType:'', address:'' })
  const [colleges, setColleges] = useState(COLLEGES.filter(college => college !== 'Other').map(name => ({ _id: name, name })))
  const [customCollege, setCustomCollege] = useState('')
  const [newCollege, setNewCollege] = useState('')
  const [showCollegeForm, setShowCollegeForm] = useState(false)
  const [collegeSaving, setCollegeSaving] = useState(false)
  const [deletingCollege, setDeletingCollege] = useState(null)
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [requestId, setRequestId] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  useEffect(() => {
    axios.get('/api/colleges').then(res => setColleges(res.data)).catch(() => {})
  }, [])

  const chooseCollege = (college) => {
    set('college', college)
    if (college !== OTHER_COLLEGE) setCustomCollege('')
  }

  const handleAddCollege = async (event) => {
    event.preventDefault()
    const name = newCollege.trim()
    if (!name) return
    setCollegeSaving(true)
    try {
      const { data } = await axios.post('/api/colleges', { name })
      setColleges(current => [...current, data].sort((a, b) => a.name.localeCompare(b.name)))
      setNewCollege('')
      setShowCollegeForm(false)
      chooseCollege(data.name)
      toast.success('College added')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not add college')
    } finally {
      setCollegeSaving(false)
    }
  }

  const handleDeleteCollege = async (event, college) => {
    event.stopPropagation()
    if (!window.confirm(`Remove “${college.name}” from the college choices? Existing affidavit requests will be kept.`)) return
    setDeletingCollege(college._id)
    try {
      await axios.delete(`/api/colleges/${college._id}`)
      setColleges(current => current.filter(item => item._id !== college._id))
      if (form.college === college.name) set('college', '')
      toast.success(`${college.name} removed`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not remove college')
    } finally {
      setDeletingCollege(null)
    }
  }

  const handleSubmit = async () => {
    const { studentName, phone, college, year, scholarshipType, address } = form
    const selectedCollege = college === OTHER_COLLEGE ? customCollege.trim() : college
    if (!studentName || !phone || !selectedCollege || !year || !scholarshipType || !address)
      return toast.error('Please fill all fields')
    if (phone.length < 10) return toast.error('Enter valid 10-digit mobile number')
    setLoading(true)
    try {
      const res = await axios.post('/api/affidavit', { ...form, college: selectedCollege })
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
        <button className={styles.submit} onClick={() => { setRequestId(null); setForm({studentName:'',phone:'',college:'',year:'',scholarshipType:'',address:''}); setCustomCollege('') }}>
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
          {colleges.map(college => <span className={styles.collegeChip} key={college._id}>
            <button type="button" className={`${styles.pill} ${form.college === college.name ? styles.active : ''}`} onClick={() => chooseCollege(college.name)}>{college.name}</button>
            {user?.role === 'admin' && <button
              type="button"
              className={styles.removeCollege}
              aria-label={`Remove ${college.name}`}
              title={`Remove ${college.name}`}
              disabled={deletingCollege === college._id}
              onClick={event => handleDeleteCollege(event, college)}
            >×</button>}
          </span>)}
          <button type="button" className={`${styles.pill} ${form.college === OTHER_COLLEGE ? styles.active : ''}`} onClick={() => chooseCollege(OTHER_COLLEGE)}>+ Any College</button>
        </div>

        {user?.role === 'admin' && <div className={styles.collegeAdmin}>
          <button type="button" className={styles.manageColleges} onClick={() => setShowCollegeForm(open => !open)}>
            {showCollegeForm ? 'Cancel' : '+ Add College'}
          </button>
          {showCollegeForm && <form className={styles.addCollegeForm} onSubmit={handleAddCollege}>
            <input value={newCollege} onChange={event => setNewCollege(event.target.value)} placeholder="College or university name" required />
            <button type="submit" disabled={collegeSaving}>{collegeSaving ? 'Adding…' : 'Save'}</button>
          </form>}
        </div>}

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
            <select id="college-select" value={form.college} onChange={e => chooseCollege(e.target.value)}>
              <option value="">Select College</option>
              {colleges.map(college => <option key={college._id} value={college.name}>{college.name}</option>)}
              <option value={OTHER_COLLEGE}>Any other college</option>
            </select>
            {form.college === OTHER_COLLEGE && <input className={styles.customCollege} value={customCollege} onChange={event => setCustomCollege(event.target.value)} placeholder="Enter your college or university" />}
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
