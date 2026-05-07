export interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  origem: string;
  dataCadastro: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}