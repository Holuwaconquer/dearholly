'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminPaymentSettingsPage() {
  const { token, user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [details, setDetails] = useState('')
  const [label, setLabel] = useState('')

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard')
    }
  }, [user, router])

  useEffect(() => {
    const fetchSettings = async () => {
      if (!token) return
      setLoading(true)
      try {
        const res = await fetch('/api/admin/payment-methods', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        if (data.success && data.data) {
          setLabel(data.data.label)
          setDetails(data.data.details)
        }
      } catch (err) {
        console.error('Failed to load payment settings', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [token])

  const handleSave = async () => {
    if (!token || !label || !details) return
    setSaving(true)
    try {
      const res = await fetch('/api/admin/payment-methods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ label, details, isActive: true })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Save failed')
      alert('Payment settings saved')
    } catch (err) {
      console.error('Failed to save payment settings', err)
      alert('Failed to save payment settings')
    } finally {
      setSaving(false)
    }
  }

  if (!token || !user || user.role !== 'admin') return null

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 p-6 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-4">Payment Settings</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
              <input value={label} onChange={(e) => setLabel(e.target.value)} className="w-full rounded-lg border p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
              <textarea value={details} onChange={(e) => setDetails(e.target.value)} className="w-full rounded-lg border p-2 h-36" />
            </div>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-emerald-600 text-white rounded-lg">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}

        <div className="mt-6">
          <Link href="/dashboard/admin">← Back to Admin</Link>
        </div>
      </div>
    </main>
  )
}
