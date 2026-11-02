import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import styles from './Settings.module.css'

const EMPTY_PROFILE = { name: '', phone: '', college: '', year: '', address: '' }

export default function Settings() {
  const { user, updateProfile } = useAuth()
  const [form, setForm] = useState(EMPTY_PROFILE)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) setForm({
      name: user.name || '',
      phone: user.phone || '',
      college: user.college || '',
      year: user.year || '',
      address: user.address || '',
    })
  }, [user])

  const updateField = (field, value) => setForm(current => ({ ...current, [field]: value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      await updateProfile(form)
      toast.success('Profile updated')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update profile')
    } finally {
      setSaving(false)
    }
  }

  if (!user) return (
    <main className={styles.page}>
      <section className={styles.card}><h1 className={styles.title}>Profile Settings</h1><p className={styles.sub}>Log in to edit your profile.</p></section>
    </main>
  )

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <span className={styles.tag}>Account</span>
        <h1 className={styles.title}>Profile Settings</h1>
        <p className={styles.sub}>Update the details used for your StudyServe account and orders.</p>
      </header>

      <form className={styles.card} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span>Full name</span>
          <input required value={form.name} onChange={event => updateField('name', event.target.value)} autoComplete="name" />
        </label>
        <label className={styles.field}>
          <span>Mobile number</span>
          <input required type="tel" inputMode="numeric" pattern="[0-9]{10}" maxLength={10} value={form.phone} onChange={event => updateField('phone', event.target.value.replace(/\D/g, ''))} autoComplete="tel" />
        </label>
        <div className={styles.row}>
          <label className={styles.field}>
            <span>College / University</span>
            <input value={form.college} onChange={event => updateField('college', event.target.value)} autoComplete="organization" />
          </label>
          <label className={styles.field}>
            <span>Year</span>
            <select value={form.year} onChange={event => updateField('year', event.target.value)}>
              <option value="">Select year</option>
              <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option>
            </select>
          </label>
        </div>
        <label className={styles.field}>
          <span>Address</span>
          <textarea rows="3" value={form.address} onChange={event => updateField('address', event.target.value)} autoComplete="street-address" placeholder="Hostel, home, or preferred delivery address" />
        </label>
        <div className={styles.footer}>
          <span className={styles.role}>Account type: {user.role === 'admin' ? 'Admin' : user.role === 'member' ? 'Member' : 'Student'}</span>
          <button className={styles.saveButton} type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
        </div>
      </form>
    </main>
  )
}
