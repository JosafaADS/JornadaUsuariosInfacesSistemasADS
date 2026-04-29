import React, { useState, useEffect } from 'react';
import { History, Download, Filter, Droplet } from 'lucide-react';
import axios from 'axios';

/**
 * COMPONENTE DE HISTÓRICO
 * Renderiza uma tabela com todos os registros de consumo do usuário logado.
 */
const Historico = ({ userId }) => {
  const [consumos, setConsumos] = useState([]);

  useEffect(() => {
    // Busca a lista de consumos filtrada pelo ID do usuário
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/user/${userId}`);
        setConsumos(res.data.consumos);
      } catch (err) {
        console.error('Erro ao buscar histórico');
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800 flex items-center">
            <History className="mr-3 text-blue-600" size={32} /> Histórico de Consumo
          </h2>
          <p className="text-slate-500">Acompanhe todos os seus registros e economias.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all">
          <Download className="mr-2" size={18} /> Exportar PDF
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Mês Ref.</th>
              <th className="px-6 py-4">Consumo (m³)</th>
              <th className="px-6 py-4">Valor (R$)</th>
              <th className="px-6 py-4">Origem</th>
              <th className="px-6 py-4">Data Registro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {consumos.length > 0 ? (
              consumos.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-700">{c.mes_referencia}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-blue-600 font-bold">
                      <Droplet size={14} className="mr-1" /> {c.quantidade_m3} m³
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">R$ {c.valor.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      c.origem === 'ocr' ? 'bg-purple-100 text-purple-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {c.origem.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-sm">
                    {new Date(c.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium">
                  Nenhum registro encontrado. Comece fazendo o upload de uma fatura!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Historico;
