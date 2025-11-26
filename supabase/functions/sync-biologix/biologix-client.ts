import { SessionResponse, ExamDto, ExamsResponse, EXAM_STATUS } from './types.ts';

export class BiologixClient {
  private baseUrl = 'https://api.biologixsleep.com';
  private username: string;
  private password: string;
  private source: number;
  private partnerId: string; // Partner ID fornecido pela Biologix (ID do centro)
  private userId: string | null = null;
  private token: string | null = null;
  private tokenStart: Date | null = null;

  constructor(username: string, password: string, source: number, partnerId: string) {
    this.username = username;
    this.password = password;
    this.source = source;
    
    // Log para debug - verificar o partnerId recebido
    console.log('=== BiologixClient Constructor ===');
    console.log('partnerId received:', partnerId);
    console.log('partnerId type:', typeof partnerId);
    console.log('partnerId length:', partnerId?.length || 0);
    
    // Garantir que partnerId está correto (deve ser "4798042LW")
    if (!partnerId || partnerId.includes('basic') || partnerId.length > 20) {
      console.error('ERROR: Invalid partnerId received:', partnerId);
      throw new Error(`Invalid partnerId: ${partnerId}. Expected format: "4798042LW"`);
    }
    
    this.partnerId = partnerId;
    console.log('partnerId set to:', this.partnerId);
  }

  /**
   * Opens a session with Biologix API and stores the token
   * Token is valid for 7 days
   */
  async openSession(): Promise<SessionResponse> {
    const response = await fetch(`${this.baseUrl}/v2/sessions/open`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.username,
        password: this.password,
        source: this.source,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to open session: ${response.status} ${errorText}`);
    }

    const sessionData: SessionResponse = await response.json();
    
    // Conforme workflow n8n: token vem de headers["bx-session-token"] (minúsculo)
    // Tentar ambos os casos para garantir compatibilidade
    let token = response.headers.get('bx-session-token') || 
                response.headers.get('Bx-Session-Token') ||
                response.headers.get('BX-Session-Token');

    if (!token) {
      // Log todos os headers disponíveis para debug
      const allHeaders: string[] = [];
      response.headers.forEach((value, key) => {
        allHeaders.push(`${key}: ${value}`);
      });
      console.error('Available headers:', allHeaders.join(', '));
      throw new Error('Token not found in response headers. Looking for: bx-session-token, Bx-Session-Token, or BX-Session-Token');
    }

    this.userId = sessionData.userId;
    this.token = token;
    this.tokenStart = new Date(sessionData.tokenStart);

    // Log para debug
    console.log('Session opened - userId:', this.userId);
    console.log('Session opened - token received:', token ? 'Yes' : 'No');
    console.log('Session opened - token length:', token?.length || 0);

    return sessionData;
  }

  /**
   * Checks if token needs renewal (before day 7)
   * Returns true if token should be renewed
   */
  shouldRenewToken(): boolean {
    if (!this.tokenStart) {
      return true; // No token, need to get one
    }

    const now = new Date();
    const daysSinceStart = (now.getTime() - this.tokenStart.getTime()) / (1000 * 60 * 60 * 24);
    
    // Renew if token is older than 6 days (renew before day 7)
    return daysSinceStart >= 6;
  }

  /**
   * Ensures we have a valid token, renewing if necessary
   */
  async ensureValidToken(): Promise<void> {
    if (!this.token || this.shouldRenewToken()) {
      await this.openSession();
    }
  }

  /**
   * Gets Basic Auth header value
   * Conforme manual: Authorization: basic [base64]
   * Manual exemplo: 4820681ER:3bFk3sL429dk -> NDgyMDY4MUVSOjNiRmszc0w0Mjlkaw==
   * 
   * IMPORTANTE: O manual especifica "basic" (minúsculo), não "Basic"
   * 
   * Exatamente como no script PowerShell que funciona:
   * $credentials = "$userId`:$token"
   * $bytes = [System.Text.Encoding]::UTF8.GetBytes($credentials)
   * $base64Auth = [System.Convert]::ToBase64String($bytes)
   * $authHeader = "basic $base64Auth"
   */
  private getAuthHeader(): string {
    if (!this.userId || !this.token) {
      throw new Error('Session not initialized. Call openSession() first.');
    }
    
    // Garantir que não há espaços extras (trim) - importante!
    const userId = this.userId.trim();
    const token = this.token.trim();
    
    // Montar credentials exatamente como no PowerShell: userId:token
    const credentials = `${userId}:${token}`;
    
    // Converter para Base64 usando TextEncoder (igual ao PowerShell UTF8.GetBytes)
    // Isso garante encoding UTF-8 correto mesmo que tenha caracteres especiais
    const encoder = new TextEncoder();
    const bytes = encoder.encode(credentials);
    
    // Converter bytes para string binária e depois para Base64
    // Equivalente ao PowerShell: [System.Convert]::ToBase64String($bytes)
    let binaryString = '';
    for (let i = 0; i < bytes.length; i++) {
      binaryString += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binaryString);
    
    // Formato exato do PowerShell: "basic [base64]" (sem espaços extras)
    const authHeader = `basic ${base64}`;
    
    // Log detalhado para debug (comparar com script PowerShell)
    console.log('=== Auth Header Generation (igual ao PowerShell) ===');
    console.log('UserId:', userId);
    console.log('Token (first 10 chars):', token.substring(0, 10) + '...');
    console.log('Token length:', token.length);
    console.log('Credentials string:', credentials);
    console.log('Base64:', base64);
    console.log('Full Authorization header:', authHeader);
    
    return authHeader;
  }

  /**
   * Fetches all exams with status = DONE (6) with pagination
   */
  async getExams(offset: number = 0, limit: number = 100): Promise<ExamsResponse> {
    await this.ensureValidToken();

    // Use partnerId provided by Biologix (ID do centro) in the URL
    // userId is used for Basic Auth, but partnerId is used in the URL path
    if (!this.userId) {
      throw new Error('Session not initialized. Call openSession() first.');
    }
    
    // Conforme manual: GET https://api.biologixsleep.com/v2/partners/{partnerId}/exams
    // IMPORTANTE: Garantir que partnerId está correto antes de construir a URL
    const partnerIdForUrl = this.partnerId;
    
    // Log ANTES de chamar getAuthHeader para evitar qualquer interferência
    console.log('=== Request Details (conforme manual) ===');
    console.log('Method: GET');
    console.log('PartnerId (original):', partnerIdForUrl);
    console.log('Offset:', offset);
    console.log('Limit:', limit);
    
    // Construir URL com partnerId garantido
    const url = new URL(`${this.baseUrl}/v2/partners/${partnerIdForUrl}/exams`);
    url.searchParams.set('offset', offset.toString());
    url.searchParams.set('limit', limit.toString());
    
    console.log('URL:', url.toString());

    const authHeader = this.getAuthHeader();
    
    // Headers conforme manual: apenas Authorization com basic auth
    // Exatamente como no script PowerShell que funciona
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
      },
    });

    if (response.status === 401) {
      // Token expired, renew and retry
      await this.openSession();
      return this.getExams(offset, limit);
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get exams: ${response.status} ${errorText}`);
    }

    const exams: ExamDto[] = await response.json();
    const total = parseInt(response.headers.get('X-Pagination-Total') || '0');
    const paginationLimit = parseInt(response.headers.get('X-Pagination-Limit') || limit.toString());
    const paginationOffset = parseInt(response.headers.get('X-Pagination-Offset') || offset.toString());

    return {
      exams,
      pagination: {
        limit: paginationLimit,
        offset: paginationOffset,
        total,
      },
    };
  }

  /**
   * Fetches all exams with status = DONE, handling pagination automatically
   */
  async getAllDoneExams(): Promise<ExamDto[]> {
    const allExams: ExamDto[] = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
      const response = await this.getExams(offset, limit);
      
      // Filter only DONE exams
      const doneExams = response.exams.filter(exam => exam.status === EXAM_STATUS.DONE);
      allExams.push(...doneExams);

      // Check if there are more pages
      if (offset + limit >= response.pagination.total) {
        hasMore = false;
      } else {
        offset += limit;
      }
    }

    return allExams;
  }
}

