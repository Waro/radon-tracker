import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft } from "lucide-react";
import { RadonCampaignCard, type RadonCampaign } from "@/components/RadonCampaignCard";

// Mock data - in a real app this would come from a database
const mockCompletedCampaigns: RadonCampaign[] = [
  {
    id: '2',
    name: 'Indagine Scuole Elementari',
    location: 'Milano, Zona Porta Garibaldi',
    startDate: '2024-02-01',
    endDate: '2024-08-15',
    status: 'completed',
    averageLevel: 85,
    riskLevel: 'low'
  },
  {
    id: '4',
    name: 'Monitoraggio Zona Industriale',
    location: 'Napoli, Area Industriale',
    startDate: '2023-12-01',
    endDate: '2024-06-01',
    status: 'completed',
    averageLevel: 180,
    riskLevel: 'high'
  },
  {
    id: '6',
    name: 'Campagna Completata 2025',
    location: 'Bologna, Zona Universitaria',
    startDate: '2024-10-01',
    endDate: '2025-04-15',
    status: 'completed',
    averageLevel: 150,
    riskLevel: 'medium'
  }
];

const CompletedCampaigns = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCampaigns = mockCompletedCampaigns.filter(campaign =>
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
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="mb-2 -ml-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Torna alle campagne
              </Button>
              <h1 className="text-3xl font-bold text-foreground">Campagne Terminate</h1>
              <p className="text-muted-foreground mt-1">
                Storico delle campagne completate
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca campagne terminate..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card p-4 rounded-lg border border-border" style={{ boxShadow: 'var(--shadow-card)' }}>
            <p className="text-sm text-muted-foreground">Totale Completate</p>
            <p className="text-2xl font-bold text-card-foreground">{mockCompletedCampaigns.length}</p>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border" style={{ boxShadow: 'var(--shadow-card)' }}>
            <p className="text-sm text-muted-foreground">Livello Medio</p>
            <p className="text-2xl font-bold text-card-foreground">
              {Math.round(mockCompletedCampaigns.reduce((acc, c) => acc + (c.averageLevel || 0), 0) / mockCompletedCampaigns.length)} Bq/m³
            </p>
          </div>
          <div className="bg-card p-4 rounded-lg border border-border" style={{ boxShadow: 'var(--shadow-card)' }}>
            <p className="text-sm text-muted-foreground">Alto Rischio</p>
            <p className="text-2xl font-bold text-destructive">
              {mockCompletedCampaigns.filter(c => c.riskLevel === 'high').length}
            </p>
          </div>
        </div>

        {/* Campaigns Grid */}
        {filteredCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign) => (
              <RadonCampaignCard
                key={campaign.id}
                campaign={campaign}
                onClick={() => handleCampaignClick(campaign)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Nessuna campagna terminata trovata</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CompletedCampaigns;
