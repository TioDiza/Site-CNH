import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, User, Globe, AppWindow, MoreVertical } from 'lucide-react';

const ConfirmationHeader: React.FC = () => (
    <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
            <div className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <img 
                        src="/Gov.br_logo.svg.png" 
                        alt="gov.br" 
                        className="h-8 md:h-10"
                    />
                    <button className="text-gray-600 p-2 hover:bg-gray-100 rounded-full">
                        <MoreVertical size={20} />
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"><Globe size={20} /></button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"><AppWindow size={20} /></button>
                    <button className="flex items-center gap-2 bg-[#004381] text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-900 transition-colors">
                        <User size={18} />
                        <span>Entrar</span>
                    </button>
                </div>
            </div>
            <div className="py-3 flex items-center justify-between border-t border-gray-200">
                 <div className="flex items-center gap-4">
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                        <Menu size={20} />
                    </button>
                    <span className="text-gray-700 font-medium">Programa CNH do Brasil</span>
                 </div>
                 <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                    <Search size={20} />
                </button>
            </div>
        </div>
    </header>
);


const ConfirmationPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');

    useEffect(() => {
        if (location.state && location.state.name) {
            setFullName(location.state.name);
        } else {
            // Se não houver dados, redireciona de volta para o login
            navigate('/login');
        }
    }, [location, navigate]);

    const handleConfirm = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Cadastro confirmado para: ${fullName}`);
        // Aqui você pode adicionar a lógica para o próximo passo
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <ConfirmationHeader />
            <main className="max-w-xl mx-auto px-4 py-12">
                <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-800 mb-8">
                        Confirme seus dados para o cadastro no Programa CNH do Brasil
                    </h1>
                    
                    <form onSubmit={handleConfirm} className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-[#004381] text-white flex items-center justify-center font-bold text-lg shrink-0 mt-1">
                                1
                            </div>
                            <div className="flex-1">
                                <label htmlFor="fullName" className="block text-lg font-semibold text-gray-700 mb-2">
                                    Digite seu nome completo
                                </label>
                                <input 
                                    type="text" 
                                    id="fullName"
                                    placeholder="Digite seu nome completo"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="pl-12">
                             <button 
                                type="submit"
                                className="bg-[#0d6efd] text-white px-12 py-3 rounded-full font-bold text-lg hover:bg-blue-700 transition-colors"
                            >
                                Confirmar
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default ConfirmationPage;