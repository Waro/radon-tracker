import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, LogOut, User, Settings, Moon, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type RadonCampaign } from "@/components/RadonCampaignCard";
import { ActiveDosimetersDialog } from "@/components/ActiveDosimetersDialog";
import { AvailableDosimetersDialog } from "@/components/AvailableDosimetersDialog";
import { KanbanBoard } from "@/components/KanbanBoard";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Mock data - in a real app this would come from a database
const mockCampaigns: RadonCampaign[] = [
  {
    id: '1',
    name: 'Monitoraggio Scuola Elementare G. Verdi',
    location: 'Milano, Via Larga 12',
    startDate: '2025-09-15',
    status: 'fase1',
    riskLevel: 'low'
  },
  {
    id: '2',
    name: 'Controllo Uffici Comunali',
    location: 'Torino, Corso Francia 89',
    startDate: '2025-07-20',
    status: 'fase2',
    averageLevel: 95,
    riskLevel: 'low'
  },
  {
    id: '3',
    name: 'Indagine Palazzo Storico',
    location: 'Roma, Via dei Fori Imperiali 45',
    startDate: '2025-03-10',
    endDate: '2025-09-12',
    status: 'awaiting',
    averageLevel: 165,
    riskLevel: 'medium'
  },
  {
    id: '4',
    name: 'Monitoraggio Complesso Residenziale',
    location: 'Bologna, Via Zamboni 33',
    startDate: '2024-11-01',
    endDate: '2025-05-15',
    status: 'completed',
    averageLevel: 220,
    riskLevel: 'high'
  }
];

const Index = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [campaigns, setCampaigns] = useState<RadonCampaign[]>([]);
  const [activeDosimetersDialogOpen, setActiveDosimetersDialogOpen] = useState(false);
  const [availableDosimetersDialogOpen, setAvailableDosimetersDialogOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Carica le campagne da localStorage all'avvio
  useEffect(() => {
    const loadCampaigns = () => {
      const stored = localStorage.getItem('radon_campaigns');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCampaigns(parsed);
        } catch (error) {
          console.error('Errore nel caricamento delle campagne:', error);
          setCampaigns(mockCampaigns);
        }
      } else {
        // Se non ci sono campagne salvate, usa i dati di esempio
        setCampaigns(mockCampaigns);
        localStorage.setItem('radon_campaigns', JSON.stringify(mockCampaigns));
      }
    };

    loadCampaigns();

    // Ascolta gli eventi di creazione/modifica campagne
    const handleCampaignUpdate = () => {
      loadCampaigns();
    };

    window.addEventListener('campaign-updated', handleCampaignUpdate);
    return () => window.removeEventListener('campaign-updated', handleCampaignUpdate);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
    toast({
      title: "Tema modificato",
      description: `Tema ${newTheme === 'dark' ? 'scuro' : 'chiaro'} attivato`
    });
  };

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
              <Button 
                onClick={() => navigate('/create-campaign')}
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                style={{ background: 'var(--gradient-primary)' }}
              >
                <Plus className="h-4 w-4" />
                Nuova Campagna
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card border-border z-50">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name || 'Utente'}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email || 'email@example.com'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
                    {theme === 'light' ? (
                      <Moon className="mr-2 h-4 w-4" />
                    ) : (
                      <Sun className="mr-2 h-4 w-4" />
                    )}
                    <span>Cambia tema</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
          <div 
            className="bg-card p-4 rounded-lg border border-border cursor-pointer hover:bg-accent/5 transition-colors" 
            style={{ boxShadow: 'var(--shadow-card)' }}
            onClick={() => setActiveDosimetersDialogOpen(true)}
          >
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
          <div 
            className="bg-card p-4 rounded-lg border border-border cursor-pointer hover:bg-accent/5 transition-colors" 
            style={{ boxShadow: 'var(--shadow-card)' }}
            onClick={() => setAvailableDosimetersDialogOpen(true)}
          >
            <p className="text-sm text-muted-foreground">Dosimetri Disponibili</p>
            <p className="text-2xl font-bold text-card-foreground">
              {250 - campaigns.filter(c => c.status === 'active').length * 12}
            </p>
          </div>
        </div>

        {/* Kanban Board */}
        {filteredCampaigns.length > 0 ? (
          <KanbanBoard 
            campaigns={filteredCampaigns}
            onCampaignClick={handleCampaignClick}
          />
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

        {/* Link to Completed Campaigns */}
        <div className="flex justify-end mt-8">
          <Button 
            variant="link" 
            onClick={() => navigate('/completed-campaigns')}
            className="text-primary hover:text-primary/80"
          >
            Campagne terminate →
          </Button>
        </div>
      </main>

      {/* Dosimeters Dialogs */}
      <ActiveDosimetersDialog
        open={activeDosimetersDialogOpen}
        onOpenChange={setActiveDosimetersDialogOpen}
        campaigns={campaigns}
      />
      <AvailableDosimetersDialog
        open={availableDosimetersDialogOpen}
        onOpenChange={setAvailableDosimetersDialogOpen}
        campaigns={campaigns}
      />
    </div>
  );
};

export default Index;
