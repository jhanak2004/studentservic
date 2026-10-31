import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../api'
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
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('/api/services').then(r => setServices(r.data)).catch(() => {})
  }, [])

  const handleBook = (svc) => {
    if (svc.id === 'affidavit') { navigate('/scholarship'); return }
    setSelected(svc)
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <span className={styles.tag}>Our Services</span>
        <h1 className={styles.title}>Everything Delivered to Your Campus</h1>
        <p className={styles.sub}>6 essential student services. Order anytime, get delivered to your college or doorstep.</p>
      </div>

      <div className={styles.grid}>
        {services.map(svc => (
          <div key={svc.id} className={styles.card} onClick={() => handleBook(svc)}>
            {svc.badge && <span className={styles.badge}>{svc.badge}</span>}
            <div className={styles.icon}>{svc.icon}</div>
            <h3 className={styles.name}>{svc.name}</h3>
            <p className={styles.desc}>{svc.desc}</p>
            <div className={styles.price}>Starting ₹{svc.price} {svc.unit}</div>
            <br />
            <span className={styles.arrow}>Book Now →</span>
          </div>
        ))}
      </div>

      {selected && <BookingModal service={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
