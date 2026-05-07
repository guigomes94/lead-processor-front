import { useState, useEffect } from 'react';
import { Users, LayoutGrid, AlertCircle, Activity } from 'lucide-react';
import { api } from '../services/api';

interface GlobalStats {
  totalLeads: number;
  totalLotes: number;
  taxaErro: string;
  totalProcessado: number;
}

export function DashboardPage() {
  const [stats, setStats] = useState<GlobalStats | null>(null);

  useEffect(() => {
    api.get('/lotes/stats/global').then(res => setStats(res.data));
  }, []);

  if (!stats) return <div className="p-8 text-zinc-500">Carregando indicadores...</div>;

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-950 p-6 text-zinc-100">
      <div className="w-full max-w-5xl">
        <h1 className="mb-8 text-3xl font-bold text-emerald-400">Dashboard</h1>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Card: Total de Leads */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-400 uppercase">Total de Leads</span>
              <Users className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="mt-4 flex items-baseline">
              <span className="text-4xl font-bold tracking-tight">{stats.totalLeads}</span>
            </div>
            <p className="mt-1 text-xs text-zinc-500">Armazenados no banco de dados</p>
          </div>

          {/* Card: Lotes Processados */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-400 uppercase">Lotes Enviados</span>
              <LayoutGrid className="h-5 w-5 text-blue-500" />
            </div>
            <div className="mt-4 flex items-baseline">
              <span className="text-4xl font-bold tracking-tight">{stats.totalLotes}</span>
            </div>
            <p className="mt-1 text-xs text-zinc-500">Arquivos CSV processados até hoje</p>
          </div>

          {/* Card: Taxa de Erro */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-400 uppercase">Taxa de Erro Global</span>
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="mt-4 flex items-baseline">
              <span className="text-4xl font-bold tracking-tight">{stats.taxaErro}</span>
            </div>
            <p className="mt-1 text-xs text-zinc-500">Média de falhas/duplicatas</p>
          </div>
        </div>

        {/* Seção Extra: Saúde do Sistema */}
        <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900 p-8">
          <div className="flex items-center space-x-3 mb-4">
            <Activity className="h-6 w-6 text-emerald-500" />
            <h2 className="text-xl font-semibold">Resumo da Operação</h2>
          </div>
          <div className="h-2 w-full rounded-full bg-zinc-800">
             <div 
               className="h-2 rounded-full bg-emerald-500 transition-all duration-1000" 
               style={{ width: `${100 - parseFloat(stats.taxaErro)}%` }}
             ></div>
          </div>
          <p className="mt-4 text-sm text-zinc-400">
            Atualmente, {100 - parseFloat(stats.taxaErro)}% dos dados processados foram integrados com sucesso. 
            O sistema está operando dentro dos parâmetros ideais.
          </p>
        </div>
      </div>
    </div>
  );
}