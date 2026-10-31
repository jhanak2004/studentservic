import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../api'
import { useAuth } from '../context/AuthContext'
import styles from './MyOrders.module.css'

const STATUS_COLORS = { pending:'#a09aff', confirmed:'#43e97b', processing:'#fbbf24', out_for_delivery:'#60a5fa', delivered:'#43e97b', cancelled:'#ff6584' }

export default function MyOrders() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/'); return }
    axios.get('/api/orders/my')
      .then(r => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  if (loading) return <div className={styles.loading}>Loading your orders...</div>

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Orders</h1>
        <p className={styles.sub}>Hello {user?.name?.split(' ')[0]} 👋 — Here are all your orders.</p>
      </div>

      {orders.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📦</div>
          <h3>No orders yet</h3>
          <p>Start by ordering a service!</p>
          <button className={styles.btn} onClick={() => navigate('/services')}>Browse Services</button>
        </div>
      ) : (
        <div className={styles.list}>
          {orders.map(o => (
            <div key={o._id} className={styles.card}>
              <div className={styles.cardTop}>
                <div>
                  <div className={styles.orderName}>{o.serviceIcon} {o.service}</div>
                  <div className={styles.orderId}>#{o.orderId}</div>
                </div>
                <span className={styles.status} style={{color: STATUS_COLORS[o.status] || '#a09aff'}}>
                  ● {o.status.replace('_', ' ')}
                </span>
              </div>
              <div className={styles.cardInfo}>
                <span>Qty: {o.quantity}</span>
                <span>{o.college}</span>
                <span style={{color:'var(--accent)', fontWeight:600}}>₹{o.price}</span>
                <span>{new Date(o.createdAt).toLocaleDateString('en-IN')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
