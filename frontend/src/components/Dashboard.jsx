import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { Trophy, Droplets, TrendingDown, Calendar, Upload, Award } from 'lucide-react';
import axios from 'axios';

/**
 * DASHBOARD PRINCIPAL
 * Exibe as estatísticas do usuário, progresso de XP e o gráfico de consumo.
 */
const Dashboard = ({ userInitial, onStartOCR }) => {
  // Estado local que sincroniza com os dados vindos do backend
  const [user, setUser] = useState(userInitial || { xp: 0, level: 1, streak: 0, nome: 'Carregando...' });
  
  // Dados para o gráfico de linha (mês a mês)
  const [consumoData, setConsumoData] = useState([]);
  
  // Lista de jogadores para o ranking lateral
  const [ranking, setRanking] = useState([]);

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/user/${userInitial.id}`);
      setUser(res.data.user);
      setConsumoData(res.data.consumos);
    } catch (err) {
      console.log('Erro ao buscar dados do usuário, usando fallback');
      setConsumoData([
        { mes_referencia: 'JAN/26', quantidade_m3: 12 },
        { mes_referencia: 'FEV/26', quantidade_m3: 15 },
        { mes_referencia: 'MAR/26', quantidade_m3: 10 },
      ]);
    }
  };

  const fetchRanking = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/ranking');
      setRanking(res.data);
    } catch (err) {
      console.log('Backend ainda não rodando, usando dados fake');
      setRanking([
        { nome: 'Ana', xp: 2500, level: 3 },
        { nome: 'Pedro', xp: 1800, level: 2 },
        { nome: 'Você', xp: 500, level: 1 },
      ]);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchRanking();
  }, []);

  const progress = (user.xp % 1000) / 10; // Supondo 1000 XP por level

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-slate-50 min-h-screen">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Olá, {user.nome}! 🌊</h1>
          <p className="text-slate-500">Sua jornada de economia de água continua.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-white p-3 rounded-2xl shadow-sm flex items-center space-x-3">
            <Calendar className="text-blue-500" size={24} />
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Streak</p>
              <p className="text-lg font-bold text-slate-800">{user.streak} dias</p>
            </div>
          </div>
          <div className="bg-white p-3 rounded-2xl shadow-sm flex items-center space-x-3">
            <Award className="text-amber-500" size={24} />
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Nível</p>
              <p className="text-lg font-bold text-slate-800">{user.level}</p>
            </div>
          </div>
        </div>
      </header>

      {/* XP Progress Bar */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-slate-700">Progresso de XP</span>
          <span className="text-slate-500">{user.xp} / {(user.level) * 1000} XP</span>
        </div>
        <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
            <TrendingDown className="mr-2 text-green-500" /> Consumo Mensal (m³)
          </h2>
          <div className="h-64 w-full min-h-[256px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={consumoData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="mes_referencia" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="quantidade_m3" 
                  stroke="#3b82f6" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
            <Trophy className="mr-2 text-amber-500" /> Ranking Global
          </h2>
          <div className="space-y-4">
            {ranking.map((player, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    idx === 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-bold text-slate-700">{player.nome}</p>
                    <p className="text-xs text-slate-400">Nível {player.level}</p>
                  </div>
                </div>
                <span className="font-bold text-blue-600">{player.xp} XP</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions / Achievements Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-400 p-8 rounded-3xl shadow-lg text-white flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold mb-2">Upload de Fatura</h3>
            <p className="opacity-90 mb-4">Escaneie seu PDF da Sabesp para ganhar XP bônus!</p>
            <button 
              onClick={onStartOCR}
              className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-bold flex items-center hover:bg-blue-50 transition-colors"
            >
              <Upload className="mr-2" size={20} /> Iniciar OCR
            </button>
          </div>
          <Droplets size={80} className="opacity-20" />
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Últimas Conquistas</h3>
          <div className="flex space-x-4">
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
              <Trophy size={32} />
            </div>
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
              <Droplets size={32} />
            </div>
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300">
              <Award size={32} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
