
export interface PasswordValidation {
  isValid: boolean;
  score: number;
  feedback: string[];
}

export const validatePassword = (password: string): PasswordValidation => {
  const feedback: string[] = [];
  let score = 0;

  // Minimum length check
  if (password.length < 8) {
    feedback.push('Deve ter pelo menos 8 caracteres');
  } else {
    score += 1;
  }

  // Lowercase check
  if (!/[a-z]/.test(password)) {
    feedback.push('Deve conter pelo menos uma letra minúscula');
  } else {
    score += 1;
  }

  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    feedback.push('Deve conter pelo menos uma letra maiúscula');
  } else {
    score += 1;
  }

  // Number check
  if (!/\d/.test(password)) {
    feedback.push('Deve conter pelo menos um número');
  } else {
    score += 1;
  }

  // Special character check
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    feedback.push('Deve conter pelo menos um caractere especial');
  } else {
    score += 1;
  }

  // Common patterns check
  if (/123456|password|qwerty|abc123/i.test(password)) {
    feedback.push('Evite padrões comuns como "123456" ou "password"');
    score = Math.max(0, score - 1);
  }

  return {
    isValid: feedback.length === 0 && score >= 4,
    score,
    feedback
  };
};

export const getPasswordStrengthLabel = (score: number): string => {
  switch (score) {
    case 0:
    case 1:
      return 'Muito fraca';
    case 2:
      return 'Fraca';
    case 3:
      return 'Razoável';
    case 4:
      return 'Forte';
    case 5:
      return 'Muito forte';
    default:
      return 'Muito fraca';
  }
};

export const getPasswordStrengthColor = (score: number): string => {
  switch (score) {
    case 0:
    case 1:
      return 'text-red-500';
    case 2:
      return 'text-orange-500';
    case 3:
      return 'text-yellow-500';
    case 4:
      return 'text-green-500';
    case 5:
      return 'text-green-600';
    default:
      return 'text-red-500';
  }
};
