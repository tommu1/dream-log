'use client';

import { ButtonHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  $variant?: 'primary' | 'secondary' | 'danger';
  $size?: 'small' | 'medium' | 'large';
  $fullWidth?: boolean;
  $loading?: boolean;
}

const getVariantStyles = (variant: ButtonProps['$variant']) => {
  switch (variant) {
    case 'primary':
      return css`
        background-color: #3b82f6;
        color: white;
        &:hover:not(:disabled) {
          background-color: #2563eb;
        }
        &:focus {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
        }
      `;
    case 'secondary':
      return css`
        background-color: #e5e7eb;
        color: #4b5563;
        &:hover:not(:disabled) {
          background-color: #d1d5db;
        }
        &:focus {
          box-shadow: 0 0 0 3px rgba(107, 114, 128, 0.5);
        }
      `;
    case 'danger':
      return css`
        background-color: #ef4444;
        color: white;
        &:hover:not(:disabled) {
          background-color: #dc2626;
        }
        &:focus {
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.5);
        }
      `;
    default:
      return css`
        background-color: #3b82f6;
        color: white;
        &:hover:not(:disabled) {
          background-color: #2563eb;
        }
        &:focus {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
        }
      `;
  }
};

const getSizeStyles = (size: ButtonProps['$size']) => {
  switch (size) {
    case 'small':
      return css`
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
      `;
    case 'large':
      return css`
        padding: 0.75rem 1.5rem;
        font-size: 1.125rem;
      `;
    default:
      return css`
        padding: 0.625rem 1.25rem;
        font-size: 1rem;
      `;
  }
};

export const Button = styled.button<ButtonProps>`
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  width: ${props => (props.$fullWidth ? '100%' : 'auto')};

  ${props => getVariantStyles(props.$variant)}
  ${props => getSizeStyles(props.$size)}

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  ${props =>
    props.$loading &&
    css`
      position: relative;
      color: transparent;
      pointer-events: none;

      &::after {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        width: 1.25em;
        height: 1.25em;
        margin: -0.625em 0 0 -0.625em;
        border: 2px solid currentColor;
        border-right-color: transparent;
        border-radius: 50%;
        animation: button-loading-spinner 0.75s linear infinite;
      }

      @keyframes button-loading-spinner {
        from {
          transform: rotate(0turn);
        }
        to {
          transform: rotate(1turn);
        }
      }
    `}
`;

Button.defaultProps = {
  $variant: 'primary',
  $size: 'medium',
  $loading: false,
  $fullWidth: false
};
