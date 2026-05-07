import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileType, Loader2, CheckCircle } from 'lucide-react';
import { api } from '../services/api';

export function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loteId, setLoteId] = useState<string | null>(null);

  // Função chamada quando o usuário solta o arquivo na tela
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setLoteId(null); // Reseta o status se escolher um arquivo novo
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'], // Aceita apenas CSV
    },
    maxFiles: 1,
  });

  // Função que envia o arquivo para o Spring Boot
  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/lotes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setLoteId(response.data.loteId);
    } catch (error) {
      console.error('Erro ao enviar arquivo:', error);
      alert('Erro ao enviar o arquivo. Verifique se o backend está rodando!');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-4 text-zinc-100">
      <div className="w-full max-w-xl rounded-xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
        <h1 className="mb-6 text-2xl font-bold text-emerald-400">Importar Leads</h1>

        {/* Área de Drag and Drop */}
        <div
          {...getRootProps()}
          className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 transition-all ${
            isDragActive
              ? 'border-emerald-500 bg-emerald-500/10'
              : 'border-zinc-700 hover:border-emerald-500/50 hover:bg-zinc-800/50'
          }`}
        >
          <input {...getInputProps()} />
          
          <UploadCloud className={`mb-4 h-12 w-12 ${isDragActive ? 'text-emerald-500' : 'text-zinc-500 group-hover:text-emerald-400'}`} />
          
          {isDragActive ? (
            <p className="text-lg font-medium text-emerald-400">Solte o arquivo CSV aqui...</p>
          ) : (
            <div className="text-center">
              <p className="text-lg font-medium text-zinc-300">Arraste e solte seu arquivo CSV</p>
              <p className="mt-1 text-sm text-zinc-500">ou clique para selecionar no computador</p>
            </div>
          )}
        </div>

        {/* Informações do Arquivo Selecionado */}
        {file && (
          <div className="mt-6 flex items-center justify-between rounded-lg bg-zinc-800/80 p-4 border border-zinc-700">
            <div className="flex items-center space-x-3 overflow-hidden">
              <FileType className="h-8 w-8 text-blue-400 shrink-0" />
              <div className="truncate">
                <p className="truncate text-sm font-medium text-zinc-200">{file.name}</p>
                <p className="text-xs text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            
            <button
              onClick={handleUpload}
              disabled={isUploading || !!loteId}
              className="ml-4 flex shrink-0 items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUploading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...</>
              ) : loteId ? (
                <><CheckCircle className="mr-2 h-4 w-4" /> Sucesso!</>
              ) : (
                'Processar Lote'
              )}
            </button>
          </div>
        )}

        {/* Alerta de Sucesso (Provisório até fazermos a barra de progresso) */}
        {loteId && (
          <div className="mt-4 rounded-lg bg-emerald-900/30 p-4 border border-emerald-500/30 text-emerald-400 text-sm">
            Arquivo enviado com sucesso! ID do Lote: <span className="font-mono">{loteId}</span>
          </div>
        )}
      </div>
    </div>
  );
}