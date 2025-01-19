'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import styled from 'styled-components';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  $hasError?: boolean;
  $fullWidth?: boolean;
}

const Container = styled.div<{ $fullWidth?: boolean }>`
  width: ${props => (props.$fullWidth ? '100%' : 'auto')};
`;

const StyledInput = styled.input<InputProps>`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => (props.$hasError ? '#ef4444' : '#d1d5db')};
  border-radius: 0.375rem;
  font-size: 1rem;
  color: #1f2937;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => (props.$hasError ? '#ef4444' : '#3b82f6')};
    box-shadow: 0 0 0 3px ${props => (props.$hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)')};
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { $hasError, $fullWidth, ...rest } = props;

  return (
    <Container $fullWidth={$fullWidth}>
      <StyledInput ref={ref} $hasError={$hasError} {...rest} />
    </Container>
  );
});
