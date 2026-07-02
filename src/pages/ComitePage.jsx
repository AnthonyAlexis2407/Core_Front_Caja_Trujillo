import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, RefreshCw, CheckCircle, ShieldCheck } from 'lucide-react'
import PageHead from '../components/layout/PageHead.jsx'
import Loader from '../components/ui/Loader.jsx'
import Alert from '../components/ui/Alert.jsx'
import Badge from '../components/ui/Badge.jsx'
import Money from '../components/ui/Money.jsx'
import { listarSolicitudes, evaluarComite } from '../services/solicitudesService.js'
import { extractError, formatDate } from '../utils/format.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function ComitePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [evaluating, setEvaluating] = useState(null)

  const cargar = useCallback(() => {
    setLoading(true)
    listarSolicitudes()
      .then((data) => {
        // Filtrar solicitudes que esten en estado 'recibido_comite'
        const recibidas = (data || []).filter(s => s.estado === 'recibido_comite')
        setItems(recibidas)
      })
      .catch((err) => setError(extractError(err)))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { 
    // Solo permitir acceso a supervisores
    if (user?.perfil?.toLowerCase() !== 'supervisor') {
      navigate('/inicio', { replace: true })
      return
    }
    cargar() 
  }, [cargar, user, navigate])

  const handleEvaluar = async (id) => {
    setEvaluating(id)
    try {
      await evaluarComite(id)
      cargar()
    } catch (err) {
      setError(extractError(err))
      setEvaluating(null)
    }
  }

  return (
    <>
      <PageHead
        title="Comité de Créditos"
        subtitle="Evaluación y validación de solicitudes por supervisores"
        icon={Users}
        actions={
          <button className="hb-btn hb-btn-gray hb-btn-sm" onClick={cargar}>
            <RefreshCw size={15} /> Actualizar
          </button>
        }
      />

      {error && <Alert tipo="error">{error}</Alert>}

      {loading ? (
        <Loader text="Cargando solicitudes en comité…" />
      ) : items.length === 0 ? (
        <div className="hb-card hb-table-empty">
          No hay solicitudes pendientes de evaluación en comité.
        </div>
      ) : (
        <div className="hb-card" style={{ padding: 0 }}>
          <div className="hb-table-wrap">
            <table className="hb-table">
              <thead>
                <tr>
                  <th>Expediente</th>
                  <th>Cliente</th>
                  <th className="num">Solicitado</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((s) => (
                  <tr key={s.id}>
                    <td><strong>{s.numero_expediente}</strong></td>
                    <td>{s.cliente_nombre}</td>
                    <td className="num"><Money value={s.monto_solicitado} /></td>
                    <td><Badge estado={s.estado} /></td>
                    <td>{formatDate(s.created_at)}</td>
                    <td>
                      <button 
                        className="hb-btn hb-btn-sm" 
                        onClick={() => handleEvaluar(s.id)}
                        disabled={evaluating === s.id}
                      >
                        <ShieldCheck size={14} /> {evaluating === s.id ? 'Evaluando...' : 'Evaluar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )
}
