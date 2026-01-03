'use client';

import { useState } from 'react';
import { BoardProvider, useBoardState } from '@/contexts/BoardContext';
import { redirect } from 'next/navigation'
 function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    redirect('/board');
  };

  
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        width: '350px',
        padding: '40px',
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '10px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.18)'
      }}>
        <h1 style={{
          textAlign: 'center',
          marginBottom: '30px',
          color: '#333',
          fontSize: '2rem'
        }}>Login</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{
            marginBottom: '15px',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '1rem',
            outline: 'none',
            transition: 'border-color 0.3s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = '#ddd'}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            marginBottom: '15px',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '1rem',
            outline: 'none',
            transition: 'border-color 0.3s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = '#ddd'}
        />
        {error && <p style={{
          color: 'red',
          marginBottom: '15px',
          textAlign: 'center'
        }}>{error}</p>}
        <button type="submit" style={{
          padding: '12px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          fontSize: '1rem',
          cursor: 'pointer',
          transition: 'background 0.3s'
        }}
        >Login</button>
      </form>
    </div>
  );
}

export default function Page() {
  return <LoginPage />;
}