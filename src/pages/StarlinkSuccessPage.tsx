import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

const StarlinkSuccessPage: React.FC = () => {
    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center py-12 px-4">
            <main className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Compra Realizada com Sucesso!</h1>
                <p className="text-gray-600 leading-relaxed mb-6">
                    Obrigado por adquirir a sua antena Starlink! Preparamos tudo para você.
                </p>
                <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg text-left">
                    <h2 className="font-bold text-lg text-blue-800 mb-2">Próximos Passos</h2>
                    <p className="text-gray-700">
                        Sua antena será entregue no endereço fornecido. Nossa equipe de assistência técnica entrará em contato para agendar a instalação em até <strong>7 dias úteis</strong>.
                    </p>
                </div>
                <Link 
                    to="/"
                    className="mt-8 w-full bg-gray-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                    Voltar ao Início
                    <ArrowRight size={20} />
                </Link>
            </main>
        </div>
    );
};

export default StarlinkSuccessPage;