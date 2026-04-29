import React, { useState } from 'react';
import { Droplets, Mail, Lock, User, Contact, ArrowRight, RefreshCcw } from 'lucide-react';
import axios from 'axios';

/**
 * COMPONENTE DE AUTENTICAÇÃO (Auth.jsx)
 * Lida com Login, Cadastro de novos usuários e Recuperação de Senha simplificada.
 */
const Auth = ({ onLogin }) => {
  // Modos da tela: 'login', 'register' (cadastro) ou 'recover' (recuperação)
  const [mode, setMode] = useState('login'); 
  
  // Estado local para armazenar dados digitados nos inputs
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    cpf: ''
  });
  const [message, setMessage] = useState('');
  const [recoveredPass, setRecoveredPass] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setRecoveredPass('');

    try {
      if (mode === 'login') {
        const res = await axios.post('http://localhost:3001/api/auth/login', {
          email: formData.email,
          senha: formData.senha
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        onLogin(res.data.user);
      } else if (mode === 'register') {
        await axios.post('http://localhost:3001/api/auth/register', formData);
        setMessage('Conta criada com sucesso! Faça login.');
        setMode('login');
      } else if (mode === 'recover') {
        const res = await axios.post('http://localhost:3001/api/auth/recover', {
          nome: formData.nome,
          email: formData.email,
          cpf: formData.cpf
        });
        setRecoveredPass(res.data.senha_recuperada);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Ocorreu um erro. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl p-8 md:p-12 relative overflow-hidden">
        {/* Decorativo */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-50 rounded-full opacity-50" />
        
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-blue-600 p-2 rounded-2xl shadow-lg shadow-blue-200">
              <Droplets className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Aqua Saúde</h1>
          </div>

          <h2 className="text-3xl font-black text-slate-800 mb-2">
            {mode === 'login' && 'Bem-vindo de volta!'}
            {mode === 'register' && 'Crie sua conta!'}
            {mode === 'recover' && 'Recuperar Senha'}
          </h2>
          <p className="text-slate-500 mb-8">
            {mode === 'login' && 'Entre para continuar sua jornada de economia.'}
            {mode === 'register' && 'Junte-se a milhares de protetores da água.'}
            {mode === 'recover' && 'Confirme seus dados para ver sua senha.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode !== 'login' && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Nome Completo"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  required
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="email" 
                placeholder="Seu melhor e-mail"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            {(mode === 'register' || mode === 'recover') && (
              <div className="relative">
                <Contact className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Seu CPF"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  value={formData.cpf}
                  onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                  required
                />
              </div>
            )}

            {mode !== 'recover' && (
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="password" 
                  placeholder="Sua senha secreta"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  value={formData.senha}
                  onChange={(e) => setFormData({...formData, senha: e.target.value})}
                  required
                />
              </div>
            )}

            {message && (
              <div className={`p-4 rounded-2xl text-sm font-bold ${message.includes('sucesso') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {message}
              </div>
            )}

            {recoveredPass && (
              <div className="p-6 bg-amber-50 border-2 border-dashed border-amber-200 rounded-3xl text-center">
                <p className="text-amber-800 font-bold mb-2">Sucesso!</p>
                <p className="text-amber-600 text-lg font-black">{recoveredPass}</p>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center space-x-2"
            >
              <span>
                {mode === 'login' && 'Entrar no Game'}
                {mode === 'register' && 'Começar Jornada'}
                {mode === 'recover' && 'Ver minha senha'}
              </span>
              <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col space-y-4">
            {mode === 'login' && (
              <>
                <button onClick={() => setMode('register')} className="text-slate-500 font-bold hover:text-blue-600 transition-colors">
                  Não tem conta? <span className="text-blue-600 underline">Crie uma agora!</span>
                </button>
                <button onClick={() => setMode('recover')} className="text-slate-400 text-sm font-medium hover:text-slate-600">
                  Esqueceu a senha? Clique aqui.
                </button>
              </>
            )}
            {(mode === 'register' || mode === 'recover') && (
              <button onClick={() => {setMode('login'); setMessage(''); setRecoveredPass('');}} className="flex items-center justify-center space-x-2 text-blue-600 font-bold hover:bg-blue-50 py-3 rounded-2xl transition-all">
                <RefreshCcw size={18} />
                <span>Voltar para o Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
