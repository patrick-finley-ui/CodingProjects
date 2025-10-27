import { useState, useEffect } from 'react'
import { UiPath } from '@uipath/uipath-typescript'
import type { EntityRecord } from '@uipath/uipath-typescript'
import './InvoiceGrid.css'

interface InvoiceGridProps {
  sdk: UiPath
}

interface InvoiceRecord extends EntityRecord {
  InvoiceID?: string
  ContractNumber?: string
  VendorName?: string
  VendorCAGE?: string
  VendorUEI?: string
  InvoiceDate?: string
  ShipmentNumber?: string
  AcceptanceDate?: string
  PaymentDueDate?: string
  InvoiceTotal?: number
  Status?: string
  Remarks?: string
  InvoiceDoc?: string
}

const ENTITY_UUID = '9f8f532a-a6ae-f011-8e61-002248862cce'

const InvoiceGrid = ({ sdk }: InvoiceGridProps) => {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch records using the provided function
        const records = await sdk.entities.getRecordsById(ENTITY_UUID, {
          pageSize: 100,
          expansionLevel: 1
        })

        setInvoices(records.items as InvoiceRecord[])
      } catch (err) {
        console.error('Error fetching invoices:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch invoices')
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [sdk])

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const formatCurrency = (amount?: number) => {
    if (amount === null || amount === undefined) return '-'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading invoices...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    )
  }

  return (
    <div className="invoice-grid-container">
      <div className="grid-header">
        <h2>Invoices ({invoices.length})</h2>
      </div>
      <div className="table-wrapper">
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Contract Number</th>
              <th>Vendor Name</th>
              <th>Vendor CAGE</th>
              <th>Vendor UEI</th>
              <th>Invoice Date</th>
              <th>Shipment Number</th>
              <th>Acceptance Date</th>
              <th>Payment Due Date</th>
              <th>Invoice Total</th>
              <th>Status</th>
              <th>Remarks</th>
              <th>Invoice Doc</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={13} className="no-data">
                  No invoices found
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.InvoiceID || '-'}</td>
                  <td>{invoice.ContractNumber || '-'}</td>
                  <td>{invoice.VendorName || '-'}</td>
                  <td>{invoice.VendorCAGE || '-'}</td>
                  <td>{invoice.VendorUEI || '-'}</td>
                  <td>{formatDate(invoice.InvoiceDate)}</td>
                  <td>{invoice.ShipmentNumber || '-'}</td>
                  <td>{formatDate(invoice.AcceptanceDate)}</td>
                  <td>{formatDate(invoice.PaymentDueDate)}</td>
                  <td className="currency">{formatCurrency(invoice.InvoiceTotal)}</td>
                  <td><span className={`status-badge status-${invoice.Status?.toLowerCase()}`}>{invoice.Status || '-'}</span></td>
                  <td className="remarks-cell">{invoice.Remarks || '-'}</td>
                  <td>{invoice.InvoiceDoc ? '📎' : '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default InvoiceGrid
