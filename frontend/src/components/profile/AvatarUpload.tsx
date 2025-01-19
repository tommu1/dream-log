import Button from '@/components/common/Button';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  onUpload: (file: File) => Promise<void>;
}

const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const AvatarWrapper = styled.div`
  position: relative;
  width: 128px;
  height: 128px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f3f4f6;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const DefaultAvatar = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e5e7eb;
  color: #9ca3af;
  font-size: 2rem;
`;

const HiddenInput = styled.input`
  display: none;
`;

const AvatarUpload: React.FC<AvatarUploadProps> = ({ currentAvatarUrl, onUpload }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ファイルサイズチェック (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('ファイルサイズは5MB以下にしてください。');
      return;
    }

    // ファイル形式チェック
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('JPEGまたはPNG形式の画像を選択してください。');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onUpload(file);
    } catch (err) {
      setError('画像のアップロードに失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AvatarContainer>
      <AvatarWrapper onClick={handleClick}>
        {currentAvatarUrl ? (
          <Image src={currentAvatarUrl} alt='プロフィール画像' width={128} height={128} objectFit='cover' />
        ) : (
          <DefaultAvatar>
            <span>+</span>
          </DefaultAvatar>
        )}
      </AvatarWrapper>

      <HiddenInput ref={fileInputRef} type='file' accept='image/jpeg,image/png' onChange={handleFileChange} />

      <Button type='button' variant='outline' size='small' onClick={handleClick} isLoading={isLoading}>
        画像を変更
      </Button>

      {error && <p className='text-red-500 text-sm'>{error}</p>}
    </AvatarContainer>
  );
};

export default AvatarUpload;
