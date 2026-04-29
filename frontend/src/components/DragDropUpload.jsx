import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

/**
 * COMPONENTE DE UPLOAD (Drag & Drop)
 * Permite ao usuário enviar o PDF da fatura arrastando o arquivo ou selecionando manualmente.
 */
const DragDropUpload = ({ onConfirm }) => {
  // Estados para controle do comportamento de arraste, arquivo e status do OCR
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle (aguardando), processing (lendo), success (sucesso), error (erro)
  const [extractedData, setExtractedData] = useState(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const processFile = async (selectedFile) => {
    if (selectedFile.type !== 'application/pdf') {
      alert('Apenas arquivos PDF são aceitos.');
      return;
    }

    setFile(selectedFile);
    setStatus('processing');

    const formData = new FormData();
    formData.append('fatura', selectedFile);

    try {
      const response = await axios.post('http://localhost:3001/api/fatura/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('Dados recebidos do OCR:', response.data.data);
      setExtractedData(response.data.data);
      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div 
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-3xl p-12 transition-all duration-200 text-center ${
          isDragging ? 'border-blue-500 bg-blue-50 scale-[1.02]' : 'border-slate-300 bg-white hover:border-blue-400'
        }`}
      >
        {status === 'idle' && (
          <>
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              onChange={(e) => e.target.files[0] && processFile(e.target.files[0])}
              accept=".pdf"
            />
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <Upload size={32} />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-800">Arraste seu PDF aqui</p>
                <p className="text-slate-500">ou clique para selecionar o arquivo</p>
              </div>
              <p className="text-xs text-slate-400 font-medium">Formato suportado: PDF da Sabesp</p>
            </div>
          </>
        )}

        {status === 'processing' && (
          <div className="space-y-4 py-4">
            <Loader2 className="mx-auto text-blue-500 animate-spin" size={48} />
            <p className="text-lg font-medium text-slate-700">Analisando fatura via OCR...</p>
          </div>
        )}

        {status === 'success' && extractedData && (
          <div className="space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Dados Extraídos!</h3>
            
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-xs text-slate-400 font-bold uppercase">Mês Ref.</p>
                <p className="text-lg font-bold text-slate-700">{extractedData.mes_referencia}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-xs text-slate-400 font-bold uppercase">Consumo (m³)</p>
                <p className="text-lg font-bold text-slate-700">{extractedData.quantidade_m3} m³</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl col-span-2">
                <p className="text-xs text-slate-400 font-bold uppercase">Valor Estimado</p>
                <p className="text-lg font-bold text-slate-700">R$ {extractedData.valor.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button 
                onClick={() => setStatus('idle')}
                className="flex-1 px-6 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
              >
                Tentar Novamente
              </button>
              <button 
                onClick={() => onConfirm(extractedData)}
                className="flex-1 px-6 py-3 rounded-2xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
              >
                Confirmar e Ganhar XP
              </button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4 py-4">
            <AlertCircle className="mx-auto text-red-500" size={48} />
            <p className="text-lg font-medium text-slate-700">Erro ao processar arquivo</p>
            <button 
              onClick={() => setStatus('idle')}
              className="mt-4 text-blue-600 font-bold hover:underline"
            >
              Tentar novamente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DragDropUpload;
