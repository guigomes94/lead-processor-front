import { useState, useEffect } from 'react';
import { api } from '../services/api';

export interface LoteStats {
  totalLinhas: number;
  linhasSucesso: number;
  linhasErro: number;
  tempoProcessamentoMs: number;
  status: string;
}

export function useLoteStatus(loteId: string | null) {
  const [stats, setStats] = useState<LoteStats | null>(null);

  useEffect(() => {
    if (!loteId) return;

    let intervalId: ReturnType<typeof setInterval>;

    const fetchStatus = async () => {
      try {
        const response = await api.get(`/lotes/${loteId}/status`);
        const data = response.data;
        setStats(data);

        // Se o backend avisar que acabou, nós paramos as consultas!
        if (data.status === 'CONCLUIDO' || data.status === 'ERRO') {
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error('Erro ao buscar status do lote', error);
      }
    };

    fetchStatus(); // Busca a primeira vez
    intervalId = setInterval(fetchStatus, 1000); // Fica buscando a cada 1s

    return () => clearInterval(intervalId); // Limpa ao sair da tela
  }, [loteId]);

  return { stats };
}