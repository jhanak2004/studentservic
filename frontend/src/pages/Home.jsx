import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Home.module.css'

const STATS = [
  { num: '5000+', label: 'Happy Students' },
  { num: '12+',   label: 'Colleges Covered' },
  { num: '6',     label: 'Services' },
  { num: '1hr',   label: 'Avg. Delivery' },
]

const STEPS = [
  { num: '01', icon: '🔍', title: 'Choose Service', desc: 'Pick from 6 essential student services.' },
  { num: '02', icon: '📝', title: 'Fill Details',   desc: 'Specify college, year, quantity & address.' },
  { num: '03', icon: '💳', title: 'Pay & Confirm',  desc: 'Pay via UPI, card, or cash on delivery.' },
  { num: '04', icon: '🚀', title: 'Get Delivered',  desc: 'We deliver to hostel, home or college gate.' },
]

const REVIEWS = [
  { initials:'RK', name:'Rahul Kumar',  college:'RGPV, 3rd Year CSE',     stars:5, text:'Got my scholarship affidavit delivered to my hostel in under an hour! Brilliant service.' },
  { initials:'PS', name:'Priya Sharma', college:'DAVV, 2nd Year BCA',     stars:5, text:'Ordered Shivani books for my entire semester. Delivered next morning. Much cheaper!' },
  { initials:'AJ', name:'Akash Jain',   college:'NRI College, Final Year', stars:5, text:'Spiral binding for my final year project was perfect. Very professional quality.' },
  { initials:'SM', name:'Sneha Mehra',  college:'SSTC, 1st Year ME',      stars:4, text:'Photocopied 200 pages of notes before exam. Great quality, very fair pricing.' },
  { initials:'VT', name:'Vikas Tiwari', college:'ITM University, 2nd EE', stars:5, text:'File pages delivered in 45 minutes! This app is a lifesaver during submission week.' },
  { initials:'NK', name:'Nisha Kurmi',  college:'Sage University, MBA 1st', stars:5, text:'I use StudyServe every semester for my OBC scholarship affidavit. Always reliable!' },
]

export default function Home() {
  const navigate = useNavigate()
  const revealRefs = useRef([])

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add(styles.revealed) })
    }, { threshold: 0.1 })
    revealRefs.current.forEach(r => r && obs.observe(r))
    return () => obs.disconnect()
  }, [])

  const addRef = el => { if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el) }

  return (
    <div>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroGrid} />
        <div className={styles.heroContent}>
          <div className={styles.badge}><span className={styles.dot} /> Trusted by 5000+ Students</div>
          <h1>Your Campus <span className={styles.hl}>Services</span><br />At Your Fingertips</h1>
          <p className={styles.heroSub}>File pages, book spirals, photocopies, affidavits & more —<br />order from hostel or home. Fast. Affordable. Reliable.</p>
          <div className={styles.heroActions}>
            <button className={styles.btnPrimary} onClick={() => navigate('/services')}>Explore Services</button>
            <button className={styles.btnOutline} onClick={() => navigate('/track')}>Track My Order</button>
          </div>
          <div className={styles.stats}>
            {STATS.map(s => (
              <div key={s.num} className={styles.stat}>
                <div className={styles.statNum}>{s.num}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={styles.howSection}>
        <div className={`${styles.sectionHeader} ${styles.reveal}`} ref={addRef}>
          <span className={styles.tag}>Process</span>
          <h2 className={styles.sectionTitle}>How StudyServe Works</h2>
          <p className={styles.sectionSub}>Simple 4-step process. Order in minutes.</p>
        </div>
        <div className={styles.stepsGrid}>
          {STEPS.map(s => (
            <div key={s.num} className={`${styles.step} ${styles.reveal}`} ref={addRef}>
              <div className={styles.stepNum}>{s.num}</div>
              <div className={styles.stepIcon}>{s.icon}</div>
              <div className={styles.stepTitle}>{s.title}</div>
              <div className={styles.stepDesc}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className={styles.reviewsSection}>
        <div className={`${styles.sectionHeader} ${styles.reveal}`} ref={addRef}>
          <span className={styles.tag}>Reviews</span>
          <h2 className={styles.sectionTitle}>Students Love StudyServe</h2>
          <p className={styles.sectionSub}>Real reviews from students across Madhya Pradesh.</p>
        </div>
        <div className={styles.reviewsGrid}>
          {REVIEWS.map((r, i) => (
            <div key={i} className={`${styles.rcard} ${styles.reveal}`} ref={addRef}>
              <div className={styles.stars}>{'★'.repeat(r.stars)}{'☆'.repeat(5-r.stars)}</div>
              <p className={styles.rtext}>"{r.text}"</p>
              <div className={styles.rauthor}>
                <div className={styles.ravatar}>{r.initials}</div>
                <div>
                  <div className={styles.rname}>{r.name}</div>
                  <div className={styles.rcollege}>{r.college}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
