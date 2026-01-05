import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../integrations/supabase/client';
import { LogOut, ShieldCheck, Users, DollarSign, Percent, Loader2, AlertTriangle } from 'lucide-react';

interface Lead {
    id: string;
    name: string;
    email: string;
    phone: string;
    created_at: string;
}

interface Transaction {
    id: string;
    amount: number;
    status: string;
    provider: string;
    created_at: string;
    leads: {
        name: string;
        email: string;
    } | null;
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType }> = ({ title, value, icon: Icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
        <div className="bg-blue-100 p-3 rounded-full">
            <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const AdminDashboardPage: React.FC = () => {
    const { user, signOut } = useAuth();
    const [stats, setStats] = useState({ totalLeads: 0, totalRevenue: 0, paidTransactions: 0 });
    const [leads, setLeads] = useState<Lead[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const { data: leadsData, error: leadsError } = await supabase
                    .from('leads')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(100);
                if (leadsError) throw leadsError;
                setLeads(leadsData || []);

                const { data: transactionsData, error: transactionsError } = await supabase
                    .from('transactions')
                    .select('*, leads(name, email)')
                    .order('created_at', { ascending: false })
                    .limit(100);
                if (transactionsError) throw transactionsError;
                setTransactions(transactionsData as Transaction[] || []);

                const paidTransactions = (transactionsData || []).filter(t => t.status === 'paid');
                const totalRevenue = paidTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);

                setStats({
                    totalLeads: leadsData?.length || 0,
                    totalRevenue: totalRevenue,
                    paidTransactions: paidTransactions.length,
                });

            } catch (err: any) {
                console.error("Erro ao buscar dados do painel:", err);
                setError("Não foi possível carregar os dados. Verifique o console para mais detalhes.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('pt-BR');
    };
    
    const conversionRate = stats.totalLeads > 0 ? ((stats.paidTransactions / stats.totalLeads) * 100).toFixed(2) : '0.00';

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/Gov.br_logo.svg.png" alt="gov.br" className="h-8" />
                        <h1 className="text-xl font-bold text-gray-800">Painel Administrativo</h1>
                    </div>
                    <div className="flex items-center gap-4">
                         <div className="flex items-center gap-2 text-green-600">
                            <ShieldCheck size={20} />
                            <span className="font-semibold hidden sm:inline">{user?.email}</span>
                        </div>
                        <button 
                            onClick={signOut}
                            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-600 transition-colors"
                        >
                            <LogOut size={18} />
                            Sair
                        </button>
                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                    </div>
                ) : error ? (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-center gap-3">
                        <AlertTriangle size={20} />
                        <p>{error}</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            <StatCard title="Total de Leads" value={stats.totalLeads.toString()} icon={Users} />
                            <StatCard title="Receita Total" value={formatCurrency(stats.totalRevenue)} icon={DollarSign} />
                            <StatCard title="Taxa de Conversão" value={`${conversionRate}%`} icon={Percent} />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Transações Recentes</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left text-gray-500">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-4 py-3">Cliente</th>
                                                <th scope="col" className="px-4 py-3">Valor</th>
                                                <th scope="col" className="px-4 py-3">Status</th>
                                                <th scope="col" className="px-4 py-3">Data</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions.map(t => (
                                                <tr key={t.id} className="bg-white border-b hover:bg-gray-50">
                                                    <td className="px-4 py-4 font-medium text-gray-900">{t.leads?.name || 'N/A'}</td>
                                                    <td className="px-4 py-4">{formatCurrency(t.amount)}</td>
                                                    <td className="px-4 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${t.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                            {t.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4">{formatDate(t.created_at)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Leads Recentes</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left text-gray-500">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-4 py-3">Nome</th>
                                                <th scope="col" className="px-4 py-3">Email</th>
                                                <th scope="col" className="px-4 py-3">Data</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {leads.map(lead => (
                                                <tr key={lead.id} className="bg-white border-b hover:bg-gray-50">
                                                    <td className="px-4 py-4 font-medium text-gray-900">{lead.name}</td>
                                                    <td className="px-4 py-4">{lead.email}</td>
                                                    <td className="px-4 py-4">{formatDate(lead.created_at)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default AdminDashboardPage;