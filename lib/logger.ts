export enum SecurityEventType {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  SIGNUP_SUCCESS = 'SIGNUP_SUCCESS',
  SIGNUP_FAILED = 'SIGNUP_FAILED',
  PASSWORD_RESET_REQUEST = 'PASSWORD_RESET_REQUEST',
  PASSWORD_RESET_SUCCESS = 'PASSWORD_RESET_SUCCESS',
  EMAIL_VERIFICATION_SENT = 'EMAIL_VERIFICATION_SENT',
  EMAIL_VERIFIED = 'EMAIL_VERIFIED',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  CSRF_TOKEN_INVALID = 'CSRF_TOKEN_INVALID',
  GOOGLE_OAUTH_SUCCESS = 'GOOGLE_OAUTH_SUCCESS',
  GOOGLE_OAUTH_FAILED = 'GOOGLE_OAUTH_FAILED',
}

export interface SecurityEvent {
  type: SecurityEventType;
  timestamp: number;
  userId?: string;
  email?: string;
  ip?: string;
  userAgent?: string;
  details?: Record<string, unknown>;
}

class SecurityLogger {
  private events: SecurityEvent[] = [];
  private maxEvents = 1000;

  log(event: SecurityEvent): void {
    this.events.push(event);
    
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }

    const logMessage = this.formatLogMessage(event);
    
    switch (event.type) {
      case SecurityEventType.LOGIN_SUCCESS:
      case SecurityEventType.SIGNUP_SUCCESS:
      case SecurityEventType.EMAIL_VERIFIED:
      case SecurityEventType.PASSWORD_RESET_SUCCESS:
      case SecurityEventType.GOOGLE_OAUTH_SUCCESS:
        console.log(`[SECURITY] ${logMessage}`);
        break;
      
      case SecurityEventType.LOGIN_FAILED:
      case SecurityEventType.SIGNUP_FAILED:
      case SecurityEventType.GOOGLE_OAUTH_FAILED:
        console.warn(`[SECURITY] ${logMessage}`);
        break;
      
      case SecurityEventType.ACCOUNT_LOCKED:
      case SecurityEventType.RATE_LIMIT_EXCEEDED:
      case SecurityEventType.CSRF_TOKEN_INVALID:
        console.error(`[SECURITY] ${logMessage}`);
        break;
      
      default:
        console.info(`[SECURITY] ${logMessage}`);
    }
  }

  private formatLogMessage(event: SecurityEvent): string {
    const parts = [
      event.type,
      event.email || event.userId || 'unknown',
      event.ip || 'unknown-ip',
    ];

    if (event.details) {
      const detailStr = Object.entries(event.details)
        .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
        .join(', ');
      parts.push(detailStr);
    }

    return parts.join(' | ');
  }

  getRecentEvents(count: number = 50): SecurityEvent[] {
    return this.events.slice(-count);
  }

  getEventsByType(type: SecurityEventType): SecurityEvent[] {
    return this.events.filter(e => e.type === type);
  }

  getEventsByEmail(email: string): SecurityEvent[] {
    return this.events.filter(e => e.email === email);
  }

  getEventsByUserId(userId: string): SecurityEvent[] {
    return this.events.filter(e => e.userId === userId);
  }

  clear(): void {
    this.events = [];
  }
}

export const securityLogger = new SecurityLogger();

export function logSecurityEvent(
  type: SecurityEventType,
  request: Request,
  additionalDetails?: Record<string, unknown>
): void {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
             request.headers.get('x-real-ip') || 
             'unknown';
  
  const userAgent = request.headers.get('user-agent') || undefined;

  securityLogger.log({
    type,
    timestamp: Date.now(),
    ip,
    userAgent,
    ...additionalDetails,
  });
}
