import React from 'react';
import { Lightbulb, CheckCircle, Droplets, Heart, Info } from 'lucide-react';

/**
 * COMPONENTE DE DICAS DE SAÚDE E SUSTENTABILIDADE
 * Exibe cards informativos sobre como economizar água e se manter saudável.
 */
const DicasSaude = () => {
  // Lista de dicas pré-definidas para o jogo
  const dicas = [
    {
      titulo: "Reduza o tempo no banho",
      descricao: "Diminuir 5 minutos do banho pode economizar até 60 litros de água.",
      categoria: "Economia",
      icon: Droplets,
      color: "blue"
    },
    {
      titulo: "Beba água regularmente",
      descricao: "Manter-se hidratado ajuda na concentração e no funcionamento do metabolismo.",
      categoria: "Saúde",
      icon: Heart,
      color: "rose"
    },
    {
      titulo: "Reaproveite água da máquina",
      descricao: "A água do enxágue da máquina de lavar pode ser usada para lavar o quintal.",
      categoria: "Sustentabilidade",
      icon: Lightbulb,
      color: "amber"
    },
    {
      titulo: "Verifique vazamentos",
      descricao: "Um gotejamento simples pode desperdiçar mais de 40 litros por dia.",
      categoria: "Manutenção",
      icon: Info,
      color: "indigo"
    }
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-12">
        <h2 className="text-3xl font-black text-slate-800 flex items-center">
          <Lightbulb className="mr-3 text-amber-500" size={32} /> Dicas de Saúde e Sustentabilidade
        </h2>
        <p className="text-slate-500 mt-2">Pequenas mudanças geram grandes impactos no mundo e na sua vida.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dicas.map((dica, idx) => (
          <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-${dica.color}-50 text-${dica.color}-500 group-hover:scale-110 transition-transform`}>
              <dica.icon size={28} />
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-${dica.color}-50 text-${dica.color}-600`}>
              {dica.categoria}
            </span>
            <h3 className="text-xl font-bold text-slate-800 mt-4 mb-2">{dica.titulo}</h3>
            <p className="text-slate-500 leading-relaxed">{dica.descricao}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-blue-600 rounded-3xl p-8 text-white flex items-center justify-between overflow-hidden relative">
        <div className="relative z-10 max-w-md">
          <h3 className="text-2xl font-bold mb-2">Seja um Eco-Mestre!</h3>
          <p className="opacity-90 mb-6">Continue registrando suas faturas e suba no ranking enquanto ajuda o planeta.</p>
          <div className="flex items-center space-x-2 text-blue-100 font-bold">
            <CheckCircle size={20} />
            <span>Mais de 1.200 litros economizados este mês</span>
          </div>
        </div>
        <Droplets size={120} className="absolute -right-8 -bottom-8 opacity-20 rotate-12" />
      </div>
    </div>
  );
};

export default DicasSaude;
