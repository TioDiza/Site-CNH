import React from 'react';
import { Shield, Banknote, Moon, Accessibility } from 'lucide-react';

const LoginHeader: React.FC = () => (
  <header className="bg-white border-b border-gray-200">
    <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
      <img 
        src="/Gov.br_logo.svg.png" 
        alt="gov.br" 
        className="h-8"
      />
      <div className="flex items-center gap-4 text-blue-700">
        <button className="p-1 hover:bg-gray-100 rounded-full"><Moon size={20} /></button>
        <button className="p-1 hover:bg-gray-100 rounded-full"><Accessibility size={20} /></button>
      </div>
    </div>
  </header>
);

const CnhLogo: React.FC = () => (
    <div className="flex items-center justify-center my-8">
        <div className="inline-block">
            <div className="flex items-end">
                <span className="text-6xl font-extrabold text-[#0033a0]">CNH</span>
                <div className="w-0 h-0
                    border-b-[40px] border-b-transparent
                    border-l-[40px] border-l-yellow-400
                    border-t-[40px] border-t-transparent
                    -ml-2">
                </div>
            </div>
            <div className="bg-[#009739] text-white font-bold text-center text-lg -mt-5 py-0.5 tracking-wider">
                DO BRASIL
            </div>
        </div>
    </div>
);

const LoginPage: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Em um app real, aqui iria a lógica de login.
    // Por enquanto, apenas previne o envio do formulário.
    alert("Funcionalidade de login simulada.");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <LoginHeader />
      <main className="max-w-sm mx-auto px-4 py-8">
        <CnhLogo />
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-lg font-semibold text-gray-800 mb-1">Identifique-se no gov.br com:</h1>
          <div className="flex items-center gap-2 mb-6">
            <Shield size={18} className="text-blue-600" />
            <p className="text-sm text-gray-600">
              Digite seu CPF para <strong>criar</strong> ou <strong>acessar</strong> sua conta gov.br
            </p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="cpf" className="block text-sm font-bold text-gray-700 mb-1">CPF</label>
              <input 
                type="text" 
                id="cpf"
                placeholder="Digite seu CPF"
                className="w-full p-3 border border-gray-400 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-[#0d6efd] text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors"
            >
              Continuar
            </button>
          </form>

          <div className="mt-8">
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Outras opções de identificação:</span>
              </div>
            </div>
            <button className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <Banknote size={20} className="text-green-600" />
                <span className="font-semibold text-green-700">Login com seu banco</span>
              </div>
              <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">SUA CONTA SERÁ PRATA</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;