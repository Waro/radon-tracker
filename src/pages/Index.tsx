import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, LogOut, User } from "lucide-react";
import { RadonCampaignCard, type RadonCampaign } from "@/components/RadonCampaignCard";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Mock data - in a real app this would come from a database
const mockCampaigns: RadonCampaign[] = [
  {
    id: '1',
    name: 'Monitoraggio Centro Storico 2024',
    location: 'Roma, Centro Storico',
    startDate: '2024-01-15',
    endDate: '2024-03-15',
    status: 'active',
    averageLevel: 120,
    riskLevel: 'medium'
  },
  {
    id: '2',
    name: 'Indagine Scuole Elementari',
    location: 'Milano, Zona Porta Garibaldi',
    startDate: '2024-02-01',
    status: 'completed',
    averageLevel: 85,
    riskLevel: 'low'
  },
  {
    id: '3',
    name: 'Campagna Quartiere Residenziale',
    location: 'Torino, San Salvario',
    startDate: '2024-03-10',
    status: 'planned',
    riskLevel: 'low'
  },
  {
    id: '4',
    name: 'Monitoraggio Zona Industriale',
    location: 'Napoli, Area Industriale',
    startDate: '2023-12-01',
    endDate: '2024-01-31',
    status: 'completed',
    averageLevel: 180,
    riskLevel: 'high'
  }
];

const Index = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [campaigns] = useState<RadonCampaign[]>(mockCampaigns);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout effettuato",
      description: "Sei stato disconnesso con successo"
    });
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCampaignClick = (campaign: RadonCampaign) => {
    navigate(`/campaign/${campaign.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Campagne Radon</h1>
              <p className="text-muted-foreground mt-1">
                Gestisci le tue campagne di monitoraggio del radon
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Benvenuto, {user?.name}</span>
              </div>
              <Button 
                onClick={() => navigate('/create-campaign')}
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                style={{ background: 'var(--gradient-primary)' }}
              >
                <Plus className="h-4 w-4" />
                Nuova Campagna
              </Button>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca campagne..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtri
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card p-4 rounded-lg border border-border" style={{ boxShadow: 'var(--shadow-card)' }}>
            <p className="text-sm text-muted-foreground">Totale Campagne</p>
            <p className="text-2xl font-bold text-card-foreground">{campaigns.length}</p>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border" style={{ boxShadow: 'var(--shadow-card)' }}>
            <p className="text-sm text-muted-foreground">In Corso</p>
            <p className="text-2xl font-bold text-accent">
              {campaigns.filter(c => c.status === 'active').length}
            </p>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border" style={{ boxShadow: 'var(--shadow-card)' }}>
            <p className="text-sm text-muted-foreground">Completate</p>
            <p className="text-2xl font-bold text-success">
              {campaigns.filter(c => c.status === 'completed').length}
            </p>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border" style={{ boxShadow: 'var(--shadow-card)' }}>
            <p className="text-sm text-muted-foreground">Dosimetri Attivi</p>
            <p className="text-2xl font-bold text-card-foreground">
              {campaigns.filter(c => c.status === 'active').length * 12}
            </p>
          </div>
        </div>

        {/* Campaigns Grid */}
        {filteredCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map(campaign => (
              <RadonCampaignCard
                key={campaign.id}
                campaign={campaign}
                onClick={() => handleCampaignClick(campaign)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Nessuna campagna trovata</p>
            <Button 
              onClick={() => navigate('/create-campaign')}
              className="mt-4 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Crea la tua prima campagna
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
