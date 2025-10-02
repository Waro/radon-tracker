import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft } from "lucide-react";
import { RadonCampaignCard, type RadonCampaign } from "@/components/RadonCampaignCard";

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
    id: '3',
    name: 'Campagna Quartiere Residenziale',
    location: 'Torino, San Salvario',
    startDate: '2024-03-10',
    status: 'planned',
    riskLevel: 'low'
  },
  {
    id: '5',
    name: 'Campagna Fase 1 Attiva',
    location: 'Firenze, Centro',
    startDate: '2025-08-01',
    status: 'active',
    averageLevel: 95,
    riskLevel: 'low'
  },
];

const columnTitles: Record<string, string> = {
  planned: 'Da iniziare',
  phase1: 'Fase 1',
  phase2: 'Fase 2',
  awaiting: 'Attesa esiti'
};

const ColumnCampaigns = () => {
  const navigate = useNavigate();
  const { columnId } = useParams<{ columnId: string }>();
  const [searchTerm, setSearchTerm] = useState('');

  const getCampaignsByStatus = (status: string) => {
    const filtered = mockCampaigns.filter(campaign => {
      if (status === 'phase2') {
        if (campaign.status === 'active') {
          const startDate = new Date(campaign.startDate);
          const sixMonthsLater = new Date(startDate);
          sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
          return new Date() >= sixMonthsLater;
        }
        return false;
      }
      if (status === 'phase1') {
        if (campaign.status === 'active') {
          const startDate = new Date(campaign.startDate);
          const sixMonthsLater = new Date(startDate);
          sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
          return new Date() < sixMonthsLater;
        }
        return false;
      }
      if (status === 'awaiting') {
        return campaign.status === 'awaiting_results';
      }
      return campaign.status === status;
    });

    return filtered.sort((a, b) => {
      if (status === 'planned' || status === 'unplanned') {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      } else {
        const aDeadline = new Date(a.startDate);
        aDeadline.setMonth(aDeadline.getMonth() + 6);
        const bDeadline = new Date(b.startDate);
        bDeadline.setMonth(bDeadline.getMonth() + 6);
        return aDeadline.getTime() - bDeadline.getTime();
      }
    });
  };

  const campaigns = columnId ? getCampaignsByStatus(columnId) : [];
  const title = columnId ? columnTitles[columnId] || 'Campagne' : 'Campagne';

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
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="mb-2 -ml-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Torna alle campagne
              </Button>
              <h1 className="text-3xl font-bold text-foreground">{title}</h1>
              <p className="text-muted-foreground mt-1">
                Tutte le campagne in questa categoria
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
              placeholder="Cerca campagne..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-card p-4 rounded-lg border border-border mb-8" style={{ boxShadow: 'var(--shadow-card)' }}>
          <p className="text-sm text-muted-foreground">Totale Campagne</p>
          <p className="text-2xl font-bold text-card-foreground">{campaigns.length}</p>
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
            <p className="text-muted-foreground text-lg">Nessuna campagna trovata</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ColumnCampaigns;
