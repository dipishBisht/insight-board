import React, { useMemo } from 'react';

interface PasswordStrengthProps {
  password: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const { score, feedback } = useMemo(() => {
    // Very simple password strength algorithm - in a real app you would use a library
    let calculatedScore = 0;
    let feedbackText = '';
    
    if (password.length >= 8) calculatedScore += 1;
    if (password.length >= 12) calculatedScore += 1;
    if (/[A-Z]/.test(password)) calculatedScore += 1;
    if (/[0-9]/.test(password)) calculatedScore += 1;
    if (/[^A-Za-z0-9]/.test(password)) calculatedScore += 1;
    
    switch (calculatedScore) {
      case 0:
      case 1:
        feedbackText = 'Too weak';
        break;
      case 2:
        feedbackText = 'Could be stronger';
        break;
      case 3:
        feedbackText = 'Good password';
        break;
      case 4:
        feedbackText = 'Strong password';
        break;
      case 5:
        feedbackText = 'Very strong password';
        break;
      default:
        feedbackText = 'Password strength';
    }
    
    return { score: calculatedScore, feedback: feedbackText };
  }, [password]);
  
  // Determine color based on score
  const getColor = (index: number) => {
    if (password.length === 0) return 'bg-gray-200 dark:bg-gray-700';
    if (index >= score) return 'bg-gray-200 dark:bg-gray-700';
    
    if (score <= 1) return 'bg-red-500';
    if (score <= 2) return 'bg-orange-500';
    if (score <= 3) return 'bg-yellow-500';
    if (score <= 4) return 'bg-green-500';
    return 'bg-green-600';
  };

  return (
    <div className="space-y-1 animate-fade-in">
      <div className="flex space-x-1">
        {[0, 1, 2, 3, 4].map((index) => (
          <div 
            key={index}
            className={`h-1 w-full rounded-full transition-all duration-300 ${getColor(index)}`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400">{feedback}</p>
    </div>
  );
};

export default PasswordStrength;