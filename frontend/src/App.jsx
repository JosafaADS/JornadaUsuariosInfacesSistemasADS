import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import DragDropUpload from './components/DragDropUpload';
import Historico from './components/Historico';
import Ranking from './components/Ranking';
import DicasSaude from './components/DicasSaude';
import Auth from './components/Auth';
import Perfil from './components/Perfil';
import { LayoutDashboard, History, Trophy, Lightbulb, User as UserIcon, LogOut, Droplets, Award } from 'lucide-react';
import axios from 'axios';

/**
 * COMPONENTE PRINCIPAL (App.jsx)
 * Gerencia o estado global da aplicação, navegação e autenticação.
 */
function App() {
  // Estado para verificar se o usuário está logado (checa token no localStorage)
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  
  // Dados do usuário logado
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  
  // Controle de Abas (Dashboard, Histórico, Ranking, Dicas)
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Controle de visibilidade da área de Upload OCR
  const [showUpload, setShowUpload] = useState(false);
  
  // Controle do modal de sucesso elegante
  const [successModal, setSuccessModal] = useState({ show: false, xp: 0, level: 1 });

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleConfirmConsumo = async (data) => {
    try {
      const response = await axios.post('http://localhost:3001/api/fatura/confirmar', {
        ...data,
        userId: user.id,
        origem: 'ocr'
      });

      console.log('Sucesso:', response.data);
      
      // Abre o modal de sucesso elegante em vez do alert básico
      setSuccessModal({ 
        show: true, 
        xp: response.data.xp_ganho, 
        level: response.data.user.level 
      });
      
      setShowUpload(false);
      setActiveTab('dashboard');
      // Em vez de reload, poderíamos recarregar os dados do dashboard via estado, 
      // mas por enquanto vamos apenas fechar o upload. 
    } catch (error) {
      console.error('Erro ao confirmar:', error);
      alert('Erro ao registrar consumo. Verifique o console.');
    }
  };

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'historico', icon: History, label: 'Histórico' },
    { id: 'ranking', icon: Trophy, label: 'Ranking' },
    { id: 'dicas', icon: Lightbulb, label: 'Dicas de Saúde' },
    { id: 'perfil', icon: UserIcon, label: 'Meu Perfil' },
  ];

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar / Navigation */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-12 px-2">
          <div className="bg-blue-600 p-2 rounded-2xl shadow-lg shadow-blue-200">
            <Droplets className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-black tracking-tight">Aqua Saúde</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setShowUpload(false);
              }}
              className={`w-full flex items-center space-x-4 px-4 py-4 rounded-2xl font-bold transition-all ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              <item.icon size={22} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-2">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-4 px-4 py-4 rounded-2xl font-bold text-red-400 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut size={22} />
            <span>Sair do Game</span>
          </button>
          
          <div className="p-4 bg-slate-50 rounded-3xl flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold">
              {user?.nome?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-800 truncate">{user?.nome || 'Usuário'}</p>
              <p className="text-xs text-slate-400 font-medium">Nível {user?.level || 1}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 lg:hidden bg-white border-b flex justify-between items-center">
          <span className="text-xl font-black text-blue-600">AquaSaúde</span>
          <button className="p-2 bg-slate-100 rounded-lg"><UserIcon size={20} /></button>
        </div>

        {activeTab === 'dashboard' && !showUpload && (
          <div className="relative">
            <Dashboard userInitial={user} onStartOCR={() => setShowUpload(true)} />
            <button 
              onClick={() => setShowUpload(true)}
              className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-3xl shadow-2xl shadow-blue-400 flex items-center space-x-2 hover:bg-blue-700 transition-all hover:scale-110 z-50"
            >
              <span className="font-bold px-2">Registrar Consumo</span>
            </button>
          </div>
        )}

        {showUpload && (
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              <button 
                onClick={() => setShowUpload(false)}
                className="mb-8 text-slate-400 hover:text-slate-600 flex items-center font-bold"
              >
                ← Voltar para Dashboard
              </button>
              <h2 className="text-3xl font-black text-slate-800 mb-2">Upload de Fatura</h2>
              <p className="text-slate-500 mb-10">Envie seu PDF da Sabesp para processamento automático.</p>
              <DragDropUpload onConfirm={handleConfirmConsumo} />
            </div>
          </div>
        )}

        {activeTab === 'historico' && !showUpload && <Historico userId={user.id} />}
        {activeTab === 'ranking' && !showUpload && <Ranking />}
        {activeTab === 'dicas' && !showUpload && <DicasSaude />}

        {activeTab === 'perfil' && !showUpload && <Perfil user={user} onUpdate={setUser} />}
      </main>

      {/* MODAL DE SUCESSO (CONQUISTA DE XP)
          Este modal é exibido após a confirmação do consumo via OCR, 
          proporcionando um feedback visual elegante de progresso. */}
      {successModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSuccessModal({ ...successModal, show: false })}
          ></div>
          
          <div className="bg-white w-full max-w-sm rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-gradient-to-b from-blue-600 to-blue-500 p-12 text-center relative">
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <Droplets size={120} className="absolute -left-10 -top-10 rotate-12" />
                <Droplets size={80} className="absolute -right-5 -bottom-5 -rotate-12" />
              </div>
              
              <div className="relative z-10">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 border border-white/30 animate-bounce">
                  <Award className="text-white" size={48} />
                </div>
                <h3 className="text-white text-3xl font-black mb-1">Incrível!</h3>
                <p className="text-blue-100 font-bold uppercase tracking-widest text-sm">Missão Cumprida</p>
              </div>
            </div>
            
            <div className="p-8 text-center space-y-6">
              <div className="flex justify-center space-x-4">
                <div className="bg-blue-50 p-4 rounded-3xl">
                  <p className="text-blue-600 text-2xl font-black">+{successModal.xp}</p>
                  <p className="text-blue-400 text-xs font-bold uppercase">XP Ganho</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-3xl">
                  <p className="text-amber-600 text-2xl font-black">{successModal.level}</p>
                  <p className="text-amber-400 text-xs font-bold uppercase">Nível Atual</p>
                </div>
              </div>
              
              <p className="text-slate-500 font-medium px-4">
                Você está fazendo um excelente trabalho protegendo nosso planeta!
              </p>
              
              <button 
                onClick={() => setSuccessModal({ ...successModal, show: false })}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
              >
                Continuar Jornada
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
