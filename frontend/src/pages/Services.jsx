import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../api'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import BookingModal from '../components/BookingModal'
import styles from './Services.module.css'

// Fallback in case backend is not running
const FALLBACK = [
  { id:'file-pages',    name:'File Pages',           icon:'📄', desc:'Ruled, plain and graph file pages for assignments, practicals & lab records.', price:2,  unit:'per page',     badge:'Popular' },
  { id:'book-spiral',   name:'Book Spiral Binding',  icon:'📚', desc:'Professional spiral binding for your assignments, projects, and reports.',      price:30, unit:'per book',     badge:null },
  { id:'files-folders', name:'Files & Folders',      icon:'🗂️', desc:'L-folders, box files, clear folders, and expandable files.',                   price:15, unit:'per piece',    badge:null },
  { id:'shivani',       name:'Shivani Books',         icon:'✍️', desc:'Shivani publication books, guides and subject-wise notes all semesters.',       price:80, unit:'per book',     badge:'New' },
  { id:'photocopy',     name:'Photocopy',             icon:'🖨️', desc:'B&W and colour photocopies of documents, notes, marksheets, certificates.',    price:1,  unit:'per page',     badge:'Popular' },
  { id:'affidavit',     name:'Scholarship Affidavit', icon:'🎓', desc:'Official affidavits for scholarship applications — all colleges & years.',      price:50, unit:'per affidavit', badge:null },
]

export default function Services() {
  const [services, setServices] = useState(FALLBACK)
  const [selected, setSelected] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [availabilitySaving, setAvailabilitySaving] = useState(null)
  const [deletingService, setDeletingService] = useState(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', icon: '📦', desc: '', price: '', unit: 'per item', badge: '' })

  useEffect(() => {
    axios.get('/api/services').then(r => setServices(r.data)).catch(() => {})
  }, [])

  const handleBook = (svc) => {
    if (svc.isAvailable === false) return
    if (svc.id === 'affidavit') { navigate('/scholarship'); return }
    setSelected(svc)
  }

  const handleAvailabilityChange = async (event, service) => {
    event.stopPropagation()
    const isAvailable = event.currentTarget.dataset.available === 'true'
    if ((service.isAvailable !== false) === isAvailable) return

    setAvailabilitySaving(service.id)
    try {
      const { data } = await axios.patch(`/api/services/${service.id}/availability`, { isAvailable })
      setServices(current => current.map(item => item.id === data.id ? data : item))
      toast.success(`${service.name} marked ${isAvailable ? 'available' : 'unavailable'}`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update availability')
    } finally {
      setAvailabilitySaving(null)
    }
  }

  const handleDeleteService = async (event, service) => {
    event.stopPropagation()
    if (!window.confirm(`Permanently delete “${service.name}”? This removes it from the service catalog.`)) return

    setDeletingService(service.id)
    try {
      await axios.delete(`/api/services/${service.id}`)
      setServices(current => current.filter(item => item.id !== service.id))
      toast.success(`${service.name} permanently deleted`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not delete service')
    } finally {
      setDeletingService(null)
    }
  }

  const handleAddService = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      const { data } = await axios.post('/api/services', { ...form, price: Number(form.price) })
      setServices(current => [...current, data])
      setForm({ name: '', icon: '📦', desc: '', price: '', unit: 'per item', badge: '' })
      setShowAddForm(false)
      toast.success('Service added to the catalog')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not add service')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <span className={styles.tag}>Our Services</span>
        <h1 className={styles.title}>Everything Delivered to Your Campus</h1>
        <p className={styles.sub}>Student services, ready when you need them. Order anytime for delivery to your college or doorstep.</p>
      </div>

      {user?.role === 'admin' && <div className={styles.adminTools}>
        <button className={styles.addButton} onClick={() => setShowAddForm(open => !open)}>
          {showAddForm ? 'Cancel' : '+ Add Service'}
        </button>
        {showAddForm && <form className={styles.addForm} onSubmit={handleAddService}>
          <h2>Add a service</h2>
          <div className={styles.formGrid}>
            <label>Service name<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Document Printing" /></label>
            <label>Icon (emoji)<input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} maxLength={8} /></label>
            <label className={styles.wide}>Description<input required value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} placeholder="Describe what students receive" /></label>
            <label>Price (₹)<input required type="number" min="0" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></label>
            <label>Price unit<input required value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} placeholder="per page, per item..." /></label>
            <label>Badge (optional)<input value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })} placeholder="New, Popular..." /></label>
          </div>
          <button className={styles.addButton} type="submit" disabled={saving}>{saving ? 'Adding…' : 'Save Service'}</button>
        </form>}
      </div>}

      <div className={styles.grid}>
        {services.map(svc => (
          <div key={svc.id} className={`${styles.card} ${svc.isAvailable === false ? styles.unavailable : ''}`} onClick={() => handleBook(svc)}>
            {user?.role === 'admin' && <div className={styles.availabilityControl} onClick={event => event.stopPropagation()}>
              <button
                type="button"
                data-available="true"
                className={`${styles.availabilityButton} ${svc.isAvailable !== false ? styles.availableActive : ''}`}
                aria-pressed={svc.isAvailable !== false}
                disabled={availabilitySaving === svc.id}
                onClick={event => handleAvailabilityChange(event, svc)}
              >Available</button>
              <button
                type="button"
                data-available="false"
                className={`${styles.availabilityButton} ${svc.isAvailable === false ? styles.unavailableActive : ''}`}
                aria-pressed={svc.isAvailable === false}
                disabled={availabilitySaving === svc.id}
                onClick={event => handleAvailabilityChange(event, svc)}
              >Unavailable</button>
              <button
                type="button"
                className={styles.deleteButton}
                disabled={deletingService === svc.id}
                aria-label={`Permanently delete ${svc.name}`}
                title="Permanently delete service"
                onClick={event => handleDeleteService(event, svc)}
              >{deletingService === svc.id ? 'Deleting…' : 'Delete'}</button>
            </div>}
            {svc.isAvailable === false
              ? <span className={styles.unavailableLabel}>Currently unavailable</span>
              : svc.badge && <span className={styles.badge}>{svc.badge}</span>}
            <div className={styles.icon}>{svc.icon}</div>
            <h3 className={styles.name}>{svc.name}</h3>
            <p className={styles.desc}>{svc.desc}</p>
            <div className={styles.price}>Starting ₹{svc.price} {svc.unit}</div>
            <br />
            {svc.isAvailable === false
              ? <span className={styles.unavailableText}>Not available for booking right now</span>
              : <span className={styles.arrow}>Book Now →</span>}
          </div>
        ))}
      </div>

      {selected && <BookingModal service={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
