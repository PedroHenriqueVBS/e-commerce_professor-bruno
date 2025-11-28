const API_URL = 'http://localhost:3000';

interface RequestOptions extends RequestInit {
  token?: string;
}

async function fetchWithAuth(endpoint: string, options: RequestOptions = {}) {
  const token = localStorage.getItem('token');
  const headers = new Headers(options.headers);

  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }
  headers.append('Content-Type', 'application/json');

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // tenta extrair mensagem do servidor, senão retorna status
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const data = await response.json();
      if (data?.message) errorMessage = data.message;
    } catch {
      // não faz nada, mantém a mensagem padrão
    }
    throw new Error(errorMessage);
  }

  // Só tenta converter em JSON se houver conteúdo
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }

  return response;
}

export const api = {
  get: (endpoint: string) => fetchWithAuth(endpoint),

  post: (endpoint: string, data: any) =>
    fetchWithAuth(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  put: (endpoint: string, data: any) =>
    fetchWithAuth(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (endpoint: string) =>
    fetchWithAuth(endpoint, {
      method: 'DELETE',
    }),
};

export default api;
