import PacientesTable from './components/PacientesTable'

export default function PacientesPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black">Pacientes</h1>
        <p className="mt-2 text-black">Gerencie todos os pacientes do sistema</p>
      </div>
      <PacientesTable />
    </div>
  )
}

