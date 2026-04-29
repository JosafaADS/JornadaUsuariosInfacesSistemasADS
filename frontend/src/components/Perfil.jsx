import React, { useState } from 'react';
import { User, Mail, Lock, Save, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

/**
 * COMPONENTE DE PERFIL
 * Permite ao usuário alterar seu nome, e-mail e senha.
 */
const Perfil = ({ user, onUpdate }) => {
  // Estado inicial carregado com os dados do usuário logado
  const [formData, setFormData] = useState({
    nome: user.nome,
    email: user.email,
    senha: ''
  });
  const [status, setStatus] = useState('idle'); // idle (aguardando), loading (salvando), success (sucesso), error (erro)
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await axios.put('http://localhost:3001/api/auth/update', {
        userId: user.id,
        ...formData
      });
      
      // Atualiza o estado global e o localStorage
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onUpdate(res.data.user);
      
      setStatus('success');
      setMessage(res.data.message);
      setFormData({ ...formData, senha: '' }); // Limpa o campo de senha
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Erro ao atualizar perfil.');
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-12">
        <h2 className="text-3xl font-black text-slate-800 flex items-center">
          <User className="mr-3 text-blue-600" size={32} /> Meu Perfil
        </h2>
        <p className="text-slate-500 mt-2">Mantenha seus dados sempre atualizados.</p>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 p-8 md:p-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-2">Nome ou Apelido</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="text" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-slate-700"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-2">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="email" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-slate-700"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-2">Nova Senha (deixe em branco para manter)</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-slate-700"
                value={formData.senha}
                onChange={(e) => setFormData({...formData, senha: e.target.value})}
              />
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-2xl flex items-center space-x-3 text-sm font-bold ${
              status === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
            }`}>
              {status === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <span>{message}</span>
            </div>
          )}

          <button 
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Save size={22} />
            <span>{status === 'loading' ? 'Salvando...' : 'Salvar Alterações'}</span>
          </button>
        </form>
      </div>

      <div className="mt-8 bg-blue-50 rounded-3xl p-6 flex items-center space-x-4">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
          <CheckCircle size={24} />
        </div>
        <p className="text-blue-800 text-sm font-medium">
          Seus dados de XP e Nível são salvos automaticamente e não podem ser alterados manualmente. 
          Continue economizando água para subir no ranking!
        </p>
      </div>
    </div>
  );
};

export default Perfil;
