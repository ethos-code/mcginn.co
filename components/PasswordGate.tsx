'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { WorkEntry } from '@/lib/content';
import { NDA_PASSWORD } from '@/lib/config';

interface PasswordGateProps {
  entry: WorkEntry;
  onUnlock: () => void;
}

export function PasswordGate({ entry, onUnlock }: PasswordGateProps) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === NDA_PASSWORD) {
      onUnlock();
    } else {
      setError(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full h-full flex items-center justify-center px-6"
    >
      <div className="w-full max-w-[440px]">
        <p className="font-mono text-[12px] tracking-[0.06em] uppercase opacity-60 m-0">
          NDA · Restricted
        </p>
        <h2
          className="mt-3 font-display m-0 leading-[1.05] tracking-[-0.022em]"
          style={{ fontSize: 'clamp(28px, 3.6vw, 40px)' }}
        >
          {entry.title}
        </h2>
        <p className="mt-5 font-sans text-[15px] leading-[1.55] opacity-85 m-0">
          This case study is available under mutual NDA. Enter the access
          password to continue, or{' '}
          <a
            href="mailto:j@mcginn.co?subject=NDA%20conversation"
            className="border-b border-current/40 hover:border-current"
            style={{ borderColor: 'currentColor' }}
          >
            request access
          </a>
          .
        </p>

        <form onSubmit={submit} className="mt-8 flex flex-col gap-3">
          <label className="font-mono text-[12px] tracking-[0.04em] uppercase opacity-70">
            Password
          </label>
          <input
            ref={inputRef}
            type="password"
            value={pw}
            onChange={(e) => {
              setPw(e.target.value);
              setError(false);
            }}
            autoComplete="off"
            spellCheck={false}
            className="bg-transparent border border-current/30 focus:border-current outline-none px-4 py-3 font-mono text-[14px] tracking-[0.02em]"
            style={{ color: 'currentColor', borderColor: 'currentColor' }}
          />
          {error && (
            <p className="font-mono text-[12px] opacity-70 m-0">
              Incorrect password.
            </p>
          )}
          <div className="mt-2 flex gap-4 items-center">
            <button
              type="submit"
              className="font-mono text-[13px] uppercase tracking-[0.06em] border border-current px-5 py-2 hover:bg-current/10 transition-colors"
              style={{ borderColor: 'currentColor' }}
            >
              Open
            </button>
            <span className="font-mono text-[12px] opacity-50">
              or press ESC to close
            </span>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
