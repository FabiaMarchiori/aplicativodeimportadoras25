
import { supabase } from "@/lib/supabase";

interface SecurityEvent {
  event_type: string;
  user_id?: string;
  details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

export const logSecurityEvent = async (event: SecurityEvent) => {
  try {
    // In production, this would go to a security audit table
    // For now, we'll use console logging with structured format
    const logEntry = {
      timestamp: new Date().toISOString(),
      ...event,
      ip_address: event.ip_address || 'unknown',
      user_agent: event.user_agent || navigator.userAgent
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🔒 Security Event: ${event.event_type}`);
      console.log('Details:', logEntry);
      console.groupEnd();
    }

    // In production, you would send this to your logging service
    // Example: await fetch('/api/security-log', { method: 'POST', body: JSON.stringify(logEntry) });
    
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};

export const logAdminAction = async (action: string, targetId?: string, details?: Record<string, any>) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  await logSecurityEvent({
    event_type: 'admin_action',
    user_id: user?.id,
    details: {
      action,
      target_id: targetId,
      ...details
    }
  });
};

export const logAuthAttempt = async (success: boolean, email?: string, error?: string) => {
  await logSecurityEvent({
    event_type: 'auth_attempt',
    details: {
      success,
      email: email ? email.replace(/(.{2}).*(@.*)/, '$1***$2') : undefined, // Mask email
      error: error || undefined
    }
  });
};

export const logFileUpload = async (filename: string, fileSize: number, bucket: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  await logSecurityEvent({
    event_type: 'file_upload',
    user_id: user?.id,
    details: {
      filename,
      file_size: fileSize,
      bucket
    }
  });
};
