import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, MoreVertical, Globe, AppWindow } from 'lucide-react';

interface UserData {
    name: string;
}

const CategorySelectionHeader: React.FC<{ userName?: string }> = ({ userName }) => (
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
                        <span>{userName || 'Entrar'}</span>
                    </button>
                </div>
            </div>
        </div>
    </header>
);

const CategoryButton: React.FC<{ category: string; description: string; onClick: () => void }> = ({ category, description, onClick }) => (
    <button 
        onClick={onClick}
        className="w-full text-left p-4 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-4"
    >
        <span className="font-bold text-xl text-[#004381]">{category}</span>
        <span className="text-gray-700">{description}</span>
    </button>
);

const CategorySelectionPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userData = location.state?.userData as UserData | undefined;

    const firstName = userData?.name.split(' ')[0];

    const handleCategorySelect = () => {
        navigate('/thank-you', { state: { userData } });
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <CategorySelectionHeader userName={firstName} />
            <main className="max-w-xl mx-auto px-4 py-8">
                <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        G
                    </div>
                    <div>
                        <p className="font-bold text-gray-800">Atendimento Gov.br</p>
                        <div className="bg-[#004381] text-white p-4 rounded-lg rounded-tl-none mt-1">
                            <p>
                                Para dar continuidade ao seu cadastro no Programa CNH do Brasil, informamos que é necessário selecionar a categoria de CNH pretendida.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <CategoryButton category="A" description="Categoria A - Motocicletas" onClick={handleCategorySelect} />
                    <CategoryButton category="B" description="Categoria B - Carros" onClick={handleCategorySelect} />
                    <CategoryButton category="AB" description="Categoria AB - Motocicletas e Carros" onClick={handleCategorySelect} />
                </div>
            </main>
        </div>
    );
};

export default CategorySelectionPage;