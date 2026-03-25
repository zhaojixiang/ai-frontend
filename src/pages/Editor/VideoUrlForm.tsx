import React from 'react';

import S from './VideoUrlForm.module.less';

export interface VideoUrlFormProps {
  value: string;
  onChange: (url: string) => void;
  onSubmit: () => void;
  loading: boolean;
  disabled?: boolean;
}

export default function VideoUrlForm({
  value,
  onChange,
  onSubmit,
  loading,
  disabled
}: VideoUrlFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled || loading || !value.trim()) return;
    onSubmit();
  };

  return (
    <form className={S.form} onSubmit={handleSubmit}>
      <input
        type='url'
        className={S.input}
        placeholder='输入视频 URL'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || loading}
        autoComplete='off'
      />
      <button type='submit' className={S.button} disabled={disabled || loading || !value.trim()}>
        {loading ? '提交中…' : '提交分析'}
      </button>
    </form>
  );
}
