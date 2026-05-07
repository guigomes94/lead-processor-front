import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { api } from '../services/api';
import type { Lead, PageResponse } from '../types';

export function LeadsPage() {
  const [data, setData] = useState<PageResponse<Lead> | null>(null);
  const [loading, setLoading] = useState(false);

  // Estados dos filtros e paginação
  const [page, setPage] = useState(0);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [origem, setOrigem] = useState('');

  // O efeito principal que busca os dados no backend
  useEffect(() => {
    // Implementamos um "debounce" para não bombardear a API a cada letra digitada
    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await api.get<PageResponse<Lead>>('/leads', {
          params: {
            page,
            size: 20,
            ...(nome && { nome }),
            ...(email && { email }),
            ...(origem && { origem }),
          },
        });
        setData(response.data);
      } catch (error) {
        console.error('Erro ao buscar leads:', error);
      } finally {
        setLoading(false);
      }
    }, 500); // Aguarda 500ms após o usuário parar de digitar

    return () => clearTimeout(delayDebounceFn);
  }, [page, nome, email, origem]); // Refaz a busca se qualquer um destes mudar

  // Volta para a página 0 sempre que o usuário digitar um novo filtro
  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    setPage(0);
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-950 p-6 text-zinc-100">
      <div className="w-full max-w-6xl rounded-xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-emerald-400">Base de Leads</h1>
          <span className="rounded-full bg-zinc-800 px-3 py-1 text-sm text-zinc-400">
            Total: {data?.totalElements || 0}
          </span>
        </div>

        {/* Barra de Filtros */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Filtrar por nome..."
              value={nome}
              onChange={(e) => handleFilterChange(setNome, e.target.value)}
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 py-2 pl-10 pr-4 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Filtrar por e-mail..."
              value={email}
              onChange={(e) => handleFilterChange(setEmail, e.target.value)}
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 py-2 pl-10 pr-4 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Filtrar por origem..."
              value={origem}
              onChange={(e) => handleFilterChange(setOrigem, e.target.value)}
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 py-2 pl-10 pr-4 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Tabela de Leads */}
        <div className="overflow-x-auto rounded-lg border border-zinc-800">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-zinc-800/50 text-xs uppercase text-zinc-400">
              <tr>
                <th className="px-6 py-4 font-medium">Nome</th>
                <th className="px-6 py-4 font-medium">E-mail</th>
                <th className="px-6 py-4 font-medium">Telefone</th>
                <th className="px-6 py-4 font-medium">Origem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-zinc-500">
                    Carregando leads...
                  </td>
                </tr>
              ) : data?.content.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-zinc-500">
                    Nenhum lead encontrado com estes filtros.
                  </td>
                </tr>
              ) : (
                data?.content.map((lead) => (
                  <tr key={lead.id} className="transition hover:bg-zinc-800/30">
                    <td className="px-6 py-4 font-medium text-zinc-100 flex items-center">
                      <User className="mr-2 h-4 w-4 text-emerald-500" /> {lead.nome}
                    </td>
                    <td className="px-6 py-4">{lead.email}</td>
                    <td className="px-6 py-4">{lead.telefone || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-zinc-800 px-2 py-1 text-xs text-emerald-400">
                        {lead.origem || 'Desconhecida'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-zinc-500">
            Página {data ? data.number + 1 : 0} de {data?.totalPages || 1}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0 || loading}
              className="flex items-center rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm font-medium transition hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Anterior
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!data || page >= data.totalPages - 1 || loading}
              className="flex items-center rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm font-medium transition hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próxima <ChevronRight className="ml-1 h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}