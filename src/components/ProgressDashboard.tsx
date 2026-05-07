import { CheckCircle2, XCircle, Clock, List } from 'lucide-react';
import type { LoteStats } from '../hooks/useLoteStatus';

interface ProgressDashboardProps {
  stats: LoteStats | null;
}

export function ProgressDashboard({ stats }: ProgressDashboardProps) {
  if (!stats) return null;

  return (
    <div className="mt-8 grid w-full grid-cols-2 gap-4 md:grid-cols-4">
      {/* Card: Total Processado */}
      <div className="flex flex-col items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
        <List className="mb-2 h-6 w-6 text-blue-400" />
        <span className="text-2xl font-bold text-blue-400">{stats.totalLinhas}</span>
        <span className="text-xs uppercase tracking-wider text-blue-500/80">Processadas</span>
      </div>

      {/* Card: Sucesso */}
      <div className="flex flex-col items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
        <CheckCircle2 className="mb-2 h-6 w-6 text-emerald-400" />
        <span className="text-2xl font-bold text-emerald-400">{stats.linhasSucesso}</span>
        <span className="text-xs uppercase tracking-wider text-emerald-500/80">Sucesso</span>
      </div>

      {/* Card: Erros (Duplicatas) */}
      <div className="flex flex-col items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 p-4">
        <XCircle className="mb-2 h-6 w-6 text-red-400" />
        <span className="text-2xl font-bold text-red-400">{stats.linhasErro}</span>
        <span className="text-xs uppercase tracking-wider text-red-500/80">Erros</span>
      </div>

      {/* Card: Tempo Gasto */}
      <div className="flex flex-col items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 p-4">
        <Clock className="mb-2 h-6 w-6 text-purple-400" />
        <span className="text-2xl font-bold text-purple-400">
          {(stats.tempoProcessamentoMs / 1000).toFixed(1)}s
        </span>
        <span className="text-xs uppercase tracking-wider text-purple-500/80">Tempo</span>
      </div>
    </div>
  );
}