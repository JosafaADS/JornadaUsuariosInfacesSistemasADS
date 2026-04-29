import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, TrendingUp } from 'lucide-react';
import axios from 'axios';

/**
 * COMPONENTE DE RANKING
 * Exibe a lista global de usuários ordenada por XP (Gamificação).
 */
const Ranking = () => {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    // Busca os top 10 usuários com maior XP no servidor
    const fetchRanking = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/ranking');
        setRanking(res.data);
      } catch (err) {
        console.error('Erro ao buscar ranking');
      }
    };
    fetchRanking();
  }, []);

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return <Crown className="text-amber-400" size={32} />;
      case 1: return <Medal className="text-slate-400" size={32} />;
      case 2: return <Medal className="text-amber-700" size={32} />;
      default: return <span className="text-slate-400 font-bold text-xl">{index + 1}</span>;
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex p-4 bg-amber-50 rounded-3xl mb-4">
          <Trophy className="text-amber-500" size={48} />
        </div>
        <h2 className="text-4xl font-black text-slate-800">Ranking Global</h2>
        <p className="text-slate-500 mt-2">Veja quem são os maiores defensores da água!</p>
      </div>

      <div className="space-y-4">
        {ranking.map((user, idx) => (
          <div 
            key={idx} 
            className={`flex items-center justify-between p-6 rounded-3xl transition-all ${
              idx === 0 ? 'bg-gradient-to-r from-amber-50 to-white border-2 border-amber-100 shadow-lg shadow-amber-50' : 
              'bg-white border border-slate-100 shadow-sm'
            }`}
          >
            <div className="flex items-center space-x-6">
              <div className="w-12 flex justify-center">
                {getRankIcon(idx)}
              </div>
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-bold text-xl">
                {user.nome.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">{user.nome}</h3>
                <div className="flex items-center space-x-3 text-sm">
                  <span className="text-slate-400 font-medium">Nível {user.level}</span>
                  <span className="text-orange-500 font-bold flex items-center">
                    <TrendingUp size={14} className="mr-1" /> {user.streak} dias
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-blue-600">{user.xp}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pontos XP</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ranking;
