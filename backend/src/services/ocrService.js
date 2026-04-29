/**
 * SERVIÇO DE OCR (Optical Character Recognition)
 * Responsável por ler arquivos PDF e extrair dados relevantes usando padrões de texto.
 */
let pdf = require('pdf-parse');
if (typeof pdf !== 'function') {
  console.log('pdf-parse import is not a function, keys:', Object.keys(pdf));
  if (pdf.default) pdf = pdf.default;
  else if (pdf.PDFParse) {
    // Caso seja a versão que exporta a classe, criamos uma instância e mapeamos a função parse
    const pdfInstance = new pdf.PDFParse();
    pdf = (buffer) => pdfInstance.parse(buffer);
  }
}
const fs = require('fs');

class OCRService {
  /**
   * Processa um arquivo PDF da Sabesp e retorna os dados extraídos.
   * @param {string} filePath - Caminho do arquivo no servidor.
   */
  async processSabespPDF(filePath) {
    try {
      // Lê o arquivo do disco como um buffer de memória
      const dataBuffer = fs.readFileSync(filePath);
      
      // Converte o PDF em texto bruto
      const data = await pdf(dataBuffer);
      const text = data.text;
      
      console.log('--- TEXTO EXTRAÍDO DO PDF ---');
      console.log(text);
      console.log('----------------------------');

      // Delega a extração dos campos específicos para o método extractSabespData
      return this.extractSabespData(text);
    } catch (error) {
      console.error('Erro no OCR:', error);
      throw new Error('Falha ao processar PDF da Sabesp');
    }
  }

  /**
   * Usa expressões regulares (Regex) para encontrar dados dentro do texto bruto do PDF.
   * @param {string} text - O texto extraído do PDF.
   */
  extractSabespData(text) {
    // 1. Mês de Referência: Tenta encontrar o campo "DATA EMISSÃO" e extrai o MM/AAAA
    const dataEmissaoRegex = /DATA\s*EMISSÃO\s*(\d{2}\/\d{2}\/\d{4})/i;
    const emissaoMatch = text.match(dataEmissaoRegex);
    let mesRef = 'Não encontrado';
    if (emissaoMatch) {
      const parts = emissaoMatch[1].split('/');
      mesRef = `${parts[1]}/${parts[2]}`; // Retorna formato MM/AAAA
    }

    // 2. Consumo (m³): Procura pelo cabeçalho "Consumo (M3)" e pega o primeiro número que aparece depois
    const consumoRegex = /Consumo\s*\(M3\)[^]*?(\d+)/i;
    const consumoMatch = text.match(consumoRegex);
    
    // 3. Valor Total (R$): Procura pelo símbolo R$ seguido de qualquer caractere (incluindo *) até o valor numérico
    const valorRegex = /R\$\s*[\s\*]*([\d,.]+)/i;
    const valorMatch = text.match(valorRegex);

    return {
      mes_referencia: mesRef,
      quantidade_m3: consumoMatch ? parseFloat(consumoMatch[1]) : 10, // Se não achar, assume 10 (mínimo)
      valor: valorMatch ? parseFloat(valorMatch[1].replace('.', '').replace(',', '.')) : 0,
      raw_text: text.substring(0, 500) // Guarda uma amostra do texto para depuração se necessário
    };
  }
}

module.exports = new OCRService();
