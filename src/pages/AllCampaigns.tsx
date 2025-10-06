import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { RadonCampaignCard, type RadonCampaign } from "@/components/RadonCampaignCard";

const AllCampaigns = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<RadonCampaign[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadCampaigns = () => {
      const stored = localStorage.getItem('radon_campaigns');
      console.log('📂 Caricamento tutte le campagne da localStorage');
      console.log('📊 Dati grezzi:', stored);
      
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          console.log('✅ Campagne parsate:', parsed);
          // Ordina le campagne dalla più recente alla meno recente
          const sorted = parsed.sort((a: RadonCampaign, b: RadonCampaign) => {
            const dateA = new Date(a.startDate).getTime();
            const dateB = new Date(b.startDate).getTime();
            return dateB - dateA; // Più recente prima
          });
          setCampaigns(sorted);
          console.log('🔄 Campagne ordinate:', sorted.length);
        } catch (error) {
          console.error('❌ Errore nel caricamento delle campagne:', error);
          setCampaigns([]);
        }
      } else {
        console.log('⚠️ Nessuna campagna trovata in localStorage');
        setCampaigns([]);
      }
    };

    loadCampaigns();

    // Ascolta gli aggiornamenti
    const handleUpdate = () => {
      console.log('🔔 Evento campaign-updated ricevuto');
      loadCampaigns();
    };

    window.addEventListener('campaign-updated', handleUpdate);
    return () => window.removeEventListener('campaign-updated', handleUpdate);
  }, []);

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Indietro
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Tutte le Campagne</h1>
              <p className="text-muted-foreground">
                {campaigns.length} {campaigns.length === 1 ? 'campagna' : 'campagne'} trovate
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca campagne..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Campaigns Grid */}
        {filteredCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign) => (
              <RadonCampaignCard
                key={campaign.id}
                campaign={campaign}
                onClick={() => navigate(`/campaign/${campaign.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {searchTerm ? 'Nessuna campagna trovata con questi criteri' : 'Nessuna campagna disponibile'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AllCampaigns;
