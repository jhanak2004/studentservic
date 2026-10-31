import { useState } from 'react'
import axios from '../api'
import toast from 'react-hot-toast'
import styles from './TrackOrder.module.css'

const STATUS_STEPS = ['pending','confirmed','processing','out_for_delivery','delivered']
const STATUS_LABELS = { pending:'Order Placed', confirmed:'Confirmed', processing:'Processing', out_for_delivery:'Out for Delivery', delivered:'Delivered' }
const STATUS_ICONS  = { pending:'📋', confirmed:'✅', processing:'⚙️', out_for_delivery:'🛵', delivered:'🎉' }

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)

  const track = async () => {
    if (!orderId.trim()) return toast.error('Enter an Order ID')
    setLoading(true)
    try {
      const res = await axios.get(`/api/orders/track/${orderId.trim()}`)
      setOrder(res.data)
    } catch {
      toast.error('Order not found. Check your Order ID.')
      setOrder(null)
    } finally {
      setLoading(false)
    }
  }

  const stepIndex = order ? STATUS_STEPS.indexOf(order.status) : -1

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <span className={styles.tag}>Track Order</span>
        <h1 className={styles.title}>Where's My Order?</h1>
        <p className={styles.sub}>Enter your Order ID to track your delivery in real-time.</p>
      </div>

      <div className={styles.searchBox}>
        <input
          value={orderId}
          onChange={e => setOrderId(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && track()}
          placeholder="Enter Order ID (e.g. SS123456)"
          className={styles.input}
        />
        <button className={styles.trackBtn} onClick={track} disabled={loading}>
          {loading ? 'Searching...' : '🔍 Track'}
        </button>
      </div>

      {order && (
        <div className={styles.result}>
          <div className={styles.orderHeader}>
            <div>
              <div className={styles.orderIdLabel}>Order #{order.orderId}</div>
              <div className={styles.orderService}>{order.serviceIcon} {order.service}</div>
            </div>
            <div className={styles.statusBadge} data-status={order.status}>
              {STATUS_ICONS[order.status]} {STATUS_LABELS[order.status]}
            </div>
          </div>

          {/* Progress Bar */}
          <div className={styles.progress}>
            {STATUS_STEPS.map((step, i) => (
              <div key={step} className={styles.progressStep}>
                <div className={`${styles.progressDot} ${i <= stepIndex ? styles.done : ''} ${i === stepIndex ? styles.current : ''}`}>
                  {i <= stepIndex ? '✓' : i + 1}
                </div>
                <div className={`${styles.progressLabel} ${i <= stepIndex ? styles.doneLabel : ''}`}>
                  {STATUS_LABELS[step]}
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`${styles.progressLine} ${i < stepIndex ? styles.doneLine : ''}`} />
                )}
              </div>
            ))}
          </div>

          {/* Details */}
          <div className={styles.details}>
            <div className={styles.detailItem}><span>Customer</span><strong>{order.customerName}</strong></div>
            <div className={styles.detailItem}><span>College</span><strong>{order.college}</strong></div>
            <div className={styles.detailItem}><span>Quantity</span><strong>{order.quantity}</strong></div>
            <div className={styles.detailItem}><span>Total</span><strong style={{color:'var(--accent)'}}>₹{order.price}</strong></div>
            <div className={styles.detailItem}><span>Delivery</span><strong>{order.address}</strong></div>
            <div className={styles.detailItem}><span>Payment</span><strong style={{textTransform:'capitalize'}}>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</strong></div>
            <div className={styles.detailItem}><span>Ordered On</span><strong>{new Date(order.createdAt).toLocaleString('en-IN')}</strong></div>
          </div>
        </div>
      )}
    </div>
  )
}
