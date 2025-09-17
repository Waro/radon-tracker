import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, MapPin, CalendarDays, Users, AlertTriangle, Activity, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Mock data for campaign details with dosimeters
const mockCampaignDetails = {
  '1': {
    id: '1',
    name: 'Monitoraggio Centro Storico 2024',
    location: 'Roma, Centro Storico',
    startDate: '2024-01-15',
    endDate: '2024-03-15',
    participantCount: 45,
    status: 'active' as const,
    averageLevel: 120,
    riskLevel: 'medium' as const,
    currentPhase: 'phase1',
    phases: {
      phase1: {
        name: 'Posizionamento Dosimetri',
        status: 'completed',
        startDate: '2024-01-15',
        endDate: '2024-01-20',
        description: 'Installazione dei dosimetri presso le abitazioni'
      },
      phase2: {
        name: 'Monitoraggio',
        status: 'active',
        startDate: '2024-01-21',
        endDate: '2024-07-15',
        description: 'Periodo di monitoraggio di 6 mesi'
      },
      phase3: {
        name: 'Ritiro e Analisi',
        status: 'planned',
        startDate: '2024-07-16',
        endDate: '2024-08-15',
        description: 'Ritiro dosimetri e analisi dei risultati'
      }
    },
    dosimeters: [
      {
        id: 'DOS001',
        address: 'Via del Corso 123',
        installDate: '2024-01-15',
        status: 'active',
        participantName: 'Mario Rossi',
        room: 'Soggiorno',
        level: 95
      },
      {
        id: 'DOS002',
        address: 'Via Nazionale 45',
        installDate: '2024-01-16',
        status: 'active',
        participantName: 'Giulia Bianchi',
        room: 'Camera da letto',
        level: 132
      },
      {
        id: 'DOS003',
        address: 'Piazza Venezia 12',
        installDate: '2024-01-17',
        status: 'active',
        participantName: 'Luca Verdi',
        room: 'Studio',
        level: 156
      },
      {
        id: 'DOS004',
        address: 'Via del Tritone 78',
        installDate: '2024-01-18',
        status: 'maintenance',
        participantName: 'Anna Neri',
        room: 'Cucina',
        level: 89
      }
    ]
  }
};

const statusColors = {
  active: 'bg-accent text-accent-foreground',
  completed: 'bg-success text-success-foreground',
  planned: 'bg-primary text-primary-foreground',
  suspended: 'bg-warning text-warning-foreground',
  maintenance: 'bg-orange-500 text-white'
};

const statusLabels = {
  active: 'Attivo',
  completed: 'Completato',
  planned: 'Pianificato',
  suspended: 'Sospeso',
  maintenance: 'Manutenzione'
};

const riskColors = {
  low: 'text-success',
  medium: 'text-warning', 
  high: 'text-destructive'
};

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const campaign = mockCampaignDetails[id as keyof typeof mockCampaignDetails];

  if (!campaign) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Campagna non trovata</h1>
          <Button onClick={() => navigate('/')}>Torna alla home</Button>
        </div>
      </div>
    );
  }

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const element = document.getElementById('campaign-report');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`campagna-${campaign.name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
      
      toast({
        title: "PDF generato",
        description: "Il report della campagna è stato scaricato con successo"
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Errore nella generazione del PDF",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const calculatePickupDate = (startDate: string) => {
    const start = new Date(startDate);
    const pickup = new Date(start);
    pickup.setMonth(pickup.getMonth() + 6);
    return pickup.toLocaleDateString('it-IT');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Indietro
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{campaign.name}</h1>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>{campaign.location}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={statusColors[campaign.status]}>
                {statusLabels[campaign.status]}
              </Badge>
              <Button
                onClick={generatePDF}
                disabled={isGeneratingPDF}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {isGeneratingPDF ? 'Generando...' : 'Scarica PDF'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div id="campaign-report">
          {/* Campaign Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Data Inizio</p>
                    <p className="font-semibold">{new Date(campaign.startDate).toLocaleDateString('it-IT')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-warning" />
                  <div>
                    <p className="text-sm text-muted-foreground">Data Ritiro</p>
                    <p className="font-semibold">{calculatePickupDate(campaign.startDate)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground">Partecipanti</p>
                    <p className="font-semibold">{campaign.participantCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`h-5 w-5 ${riskColors[campaign.riskLevel]}`} />
                  <div>
                    <p className="text-sm text-muted-foreground">Livello Medio</p>
                    <p className={`font-semibold ${riskColors[campaign.riskLevel]}`}>
                      {campaign.averageLevel} Bq/m³
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="phases" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="phases">Fasi della Campagna</TabsTrigger>
              <TabsTrigger value="dosimeters">Dosimetri Installati</TabsTrigger>
            </TabsList>

            <TabsContent value="phases" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Fasi della Campagna
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(campaign.phases).map(([phaseKey, phase]) => (
                    <div
                      key={phaseKey}
                      className={`p-4 rounded-lg border ${
                        campaign.currentPhase === phaseKey ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{phase.name}</h3>
                        <Badge className={statusColors[phase.status]}>
                          {statusLabels[phase.status]}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{phase.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span>
                          <span className="text-muted-foreground">Inizio:</span> {new Date(phase.startDate).toLocaleDateString('it-IT')}
                        </span>
                        <span>
                          <span className="text-muted-foreground">Fine:</span> {new Date(phase.endDate).toLocaleDateString('it-IT')}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="dosimeters" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Dosimetri Installati ({campaign.dosimeters.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {campaign.dosimeters.map((dosimeter) => (
                      <div key={dosimeter.id} className="p-4 border rounded-lg bg-card">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-mono text-sm font-semibold">{dosimeter.id}</span>
                          <Badge className={statusColors[dosimeter.status]}>
                            {statusLabels[dosimeter.status]}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Partecipante:</span>
                            <span className="ml-1 font-medium">{dosimeter.participantName}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Indirizzo:</span>
                            <span className="ml-1">{dosimeter.address}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Stanza:</span>
                            <span className="ml-1">{dosimeter.room}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Installato:</span>
                            <span className="ml-1">{new Date(dosimeter.installDate).toLocaleDateString('it-IT')}</span>
                          </div>
                          {dosimeter.level && (
                            <div className="pt-2 border-t">
                              <span className="text-muted-foreground">Livello attuale:</span>
                              <span className="ml-1 font-semibold">{dosimeter.level} Bq/m³</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default CampaignDetail;