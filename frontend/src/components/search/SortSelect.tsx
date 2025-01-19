import React from 'react';
import styled from 'styled-components';

interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const Select = styled.select`
  padding: 0.5rem 2rem 0.5rem 1rem;
  font-size: 0.875rem;
  color: #4b5563;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const sortOptions = [
  { value: 'newest', label: '新着順' },
  { value: 'oldest', label: '古い順' },
  { value: 'likes', label: 'いいね数順' },
  { value: 'comments', label: 'コメント数順' }
];

const SortSelect: React.FC<SortSelectProps> = ({ value, onChange }) => {
  return (
    <Select value={value} onChange={e => onChange(e.target.value)}>
      {sortOptions.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  );
};

export default SortSelect;
