import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Download, MapPin, CalendarDays, AlertTriangle, Activity, Package, FileText, MousePointerClick } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Phase1Form } from "@/components/campaign/Phase1Form";
import { Phase2Form } from "@/components/campaign/Phase2Form";
import { CampaignCompletionDialog } from "@/components/campaign/CampaignCompletionDialog";

// Mock data for campaign details with dosimeters
const mockCampaignDetails = {
  '1': {
    id: '1',
    name: 'Monitoraggio Centro Storico 2024',
    location: 'Roma, Centro Storico',
    startDate: '2024-01-15',
    endDate: '2024-03-15',
    status: 'active' as const,
    averageLevel: 120,
    riskLevel: 'medium' as const,
    currentPhase: 'phase2',
    phases: {
      positioning: {
        name: 'Posizionamento Dosimetri',
        status: 'completed',
        startDate: '2024-01-15',
        endDate: '2024-01-20',
        description: 'Installazione dei dosimetri presso le abitazioni'
      },
      monitoring: {
        name: 'Monitoraggio',
        status: 'active',
        startDate: '2024-01-21',
        description: 'Periodo di monitoraggio - Fase 1 e Fase 2',
        phase1EndDate: '2024-07-15',
        phase2EndDate: '2025-01-15'
      },
      pickup: {
        name: 'Ritiro',
        status: 'planned',
        startDate: '2025-01-16',
        endDate: '2025-01-20',
        description: 'Ritiro dei dosimetri'
      },
      analysis: {
        name: 'Analisi e Risultati',
        status: 'planned',
        startDate: '2025-01-21',
        endDate: '2025-02-15',
        description: 'Analisi dei dosimetri e report finale'
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
  const [showPhase1Form, setShowPhase1Form] = useState(false);
  const [showPhase2Form, setShowPhase2Form] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [phase1Data, setPhase1Data] = useState<any>(null);
  const [phase2Data, setPhase2Data] = useState<any>(null);
  const [showPhase1Dosimeters, setShowPhase1Dosimeters] = useState(true);

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

  const handlePhaseClick = (phaseKey: string, phaseStatus: string) => {
    if (campaign.status !== 'active') return;
    
    if (phaseKey === 'phase2' && phaseStatus === 'active') {
      // Fase 2 in corso - apri il form appropriato
      if (!phase1Data) {
        setShowPhase1Form(true);
      } else {
        setShowPhase2Form(true);
      }
    } else if (phaseKey === 'phase3' && phaseStatus === 'planned') {
      // Fase 3 pianificata - apri dialog conclusione
      setShowCompletionDialog(true);
    }
  };

  const handlePhase1Save = (data: any) => {
    setPhase1Data(data);
    setShowPhase1Form(false);
    toast({
      title: "Fase 1 completata",
      description: "I dati della Fase 1 sono stati salvati. Puoi ora procedere con la Fase 2."
    });
    setShowPhase2Form(true);
  };

  const handlePhase2Save = (data: any) => {
    setPhase2Data(data);
    setShowPhase2Form(false);
    toast({
      title: "Fase 2 completata",
      description: "La campagna è stata conclusa con successo"
    });
  };

  const handleCampaignCompletion = (dosimeterLevels: { [key: string]: number }) => {
    console.log("Livelli dosimetri:", dosimeterLevels);
    // Qui andrà la logica per salvare i dati e aggiornare lo stato della campagna
    toast({
      title: "Campagna conclusa",
      description: "Gli esiti sono stati salvati con successo"
    });
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
          {/* Dati Campagna */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Dati Campagna
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Commessa:</span>
                  <span className="ml-1 font-medium">COM-2024-001</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Cliente:</span>
                  <span className="ml-1 font-medium">Comune di Roma</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Città:</span>
                  <span className="ml-1 font-medium">{campaign.location}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Provincia:</span>
                  <span className="ml-1 font-medium">RM</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Indirizzo:</span>
                  <span className="ml-1">Via del Centro Storico</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <span className="ml-1">info@comune.roma.it</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3 text-sm">Date Campagna</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    <div>
                      <span className="text-muted-foreground">Data Inizio:</span>
                      <span className="ml-2 font-medium">{new Date(campaign.startDate).toLocaleDateString('it-IT')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    <div>
                      <span className="text-muted-foreground">Data Fine:</span>
                      <span className="ml-2 font-medium">
                        {new Date(new Date(campaign.startDate).setFullYear(new Date(campaign.startDate).getFullYear() + 1)).toLocaleDateString('it-IT')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fasi Campagna */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Fasi della Campagna
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(campaign.phases).map(([phaseKey, phase]) => {
                const isClickable = campaign.status === 'active' && 
                  ((phaseKey === 'monitoring' && phase.status === 'active') || 
                   (phaseKey === 'analysis' && phase.status === 'planned'));
                
                return (
                  <div
                    key={phaseKey}
                    onClick={() => isClickable && handlePhaseClick(phaseKey, phase.status)}
                    className={`p-4 rounded-lg border transition-all ${
                      campaign.currentPhase === phaseKey ? 'border-primary bg-primary/5' : 'border-border'
                    } ${isClickable ? 'cursor-pointer hover:border-primary hover:shadow-md' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{phase.name}</h3>
                        {isClickable && <MousePointerClick className="h-4 w-4 text-primary" />}
                      </div>
                      <Badge className={statusColors[phase.status]}>
                        {statusLabels[phase.status]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{phase.description}</p>
                    
                    {phaseKey === 'monitoring' ? (
                      <div className="mt-3 grid grid-cols-2 gap-4">
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <h4 className="font-medium text-sm mb-2">Fase 1</h4>
                          <div className="space-y-1 text-xs">
                            <div>
                              <span className="text-muted-foreground">Inizio:</span>
                              <span className="ml-1">{new Date(phase.startDate).toLocaleDateString('it-IT')}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Fine:</span>
                              <span className="ml-1">{new Date(campaign.phases.monitoring.phase1EndDate).toLocaleDateString('it-IT')}</span>
                            </div>
                            <div className="pt-1 text-muted-foreground">
                              Durata: 6 mesi
                            </div>
                          </div>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <h4 className="font-medium text-sm mb-2">Fase 2</h4>
                          <div className="space-y-1 text-xs">
                            <div>
                              <span className="text-muted-foreground">Inizio:</span>
                              <span className="ml-1">{new Date(campaign.phases.monitoring.phase1EndDate).toLocaleDateString('it-IT')}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Fine:</span>
                              <span className="ml-1">{new Date(campaign.phases.monitoring.phase2EndDate).toLocaleDateString('it-IT')}</span>
                            </div>
                            <div className="pt-1 text-muted-foreground">
                              Durata: 6 mesi
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 text-sm mt-2">
                        <span>
                          <span className="text-muted-foreground">Inizio:</span> {new Date(phase.startDate).toLocaleDateString('it-IT')}
                        </span>
                        {phaseKey !== 'positioning' && 'endDate' in phase && phase.endDate && (
                          <span>
                            <span className="text-muted-foreground">Fine:</span> {new Date(phase.endDate).toLocaleDateString('it-IT')}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Dosimetri Installati */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Dosimetri Installati
                </div>
                <div className="flex items-center gap-3">
                  <Label htmlFor="phase-toggle" className={!showPhase1Dosimeters ? "text-muted-foreground" : ""}>
                    Fase 1
                  </Label>
                  <Switch
                    id="phase-toggle"
                    checked={!showPhase1Dosimeters}
                    onCheckedChange={(checked) => setShowPhase1Dosimeters(!checked)}
                  />
                  <Label htmlFor="phase-toggle" className={showPhase1Dosimeters ? "text-muted-foreground" : ""}>
                    Fase 2
                  </Label>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pb-4 border-b">
                  <div>
                    <span className="text-muted-foreground">Data Inizio:</span>
                    <span className="ml-1 font-medium">
                      {showPhase1Dosimeters 
                        ? new Date(campaign.startDate).toLocaleDateString('it-IT')
                        : new Date(campaign.phases.monitoring.phase1EndDate).toLocaleDateString('it-IT')
                      }
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Data Fine:</span>
                    <span className="ml-1 font-medium">
                      {showPhase1Dosimeters
                        ? new Date(campaign.phases.monitoring.phase1EndDate).toLocaleDateString('it-IT')
                        : new Date(campaign.phases.monitoring.phase2EndDate).toLocaleDateString('it-IT')
                      }
                    </span>
                  </div>
                </div>

                {/* Tecnici */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4 border-b">
                  <div>
                    <h4 className="font-medium mb-3">Tecnico Proj.Eco</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">Nome:</span> Marco Rossi</p>
                      <p><span className="text-muted-foreground">Cognome:</span> Rossi</p>
                      <p><span className="text-muted-foreground">Firma:</span> M.Rossi</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Referente Cliente</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">Nome:</span> Anna Bianchi</p>
                      <p><span className="text-muted-foreground">Cognome:</span> Bianchi</p>
                      <p><span className="text-muted-foreground">Ruolo:</span> Responsabile Tecnico</p>
                      <p><span className="text-muted-foreground">Firma:</span> A.Bianchi</p>
                    </div>
                  </div>
                </div>

                {/* Dosimetri */}
                <div>
                  <h4 className="font-medium mb-3">
                    Dosimetri {showPhase1Dosimeters ? 'Fase 1' : 'Fase 2'} ({campaign.dosimeters.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {campaign.dosimeters.map((dosimeter, index) => (
                      <div key={dosimeter.id} className="p-4 border rounded-lg bg-muted/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-sm font-semibold">R{index + 1}</span>
                          <span className="text-xs text-muted-foreground">Dispositivo 1</span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p><span className="text-muted-foreground">Codice:</span> {dosimeter.id}</p>
                          <p><span className="text-muted-foreground">Piano:</span> Piano Terra</p>
                          <p><span className="text-muted-foreground">Ubicazione:</span> {dosimeter.room}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </main>

      {/* Dialog per Fase 1 */}
      <Dialog open={showPhase1Form} onOpenChange={setShowPhase1Form}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Fase 1 - Posizionamento Dosimetri</DialogTitle>
          </DialogHeader>
          <Phase1Form
            data={phase1Data || {
              dataInizio: '',
              dataFine: '',
              tecnicoNome: '',
              tecnicoCognome: '',
              tecnicoFirma: '',
              clienteNome: '',
              clienteCognome: '',
              clienteRuolo: '',
              clienteFirma: ''
            }}
            onChange={setPhase1Data}
            onBack={() => setShowPhase1Form(false)}
            onNext={handlePhase1Save}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog per Fase 2 */}
      <Dialog open={showPhase2Form} onOpenChange={setShowPhase2Form}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Fase 2 - Ritiro Dosimetri</DialogTitle>
          </DialogHeader>
          <Phase2Form
            data={phase2Data || {
              dataInizio: '',
              dataFine: '',
              tecnicoNome: '',
              tecnicoCognome: '',
              tecnicoFirma: '',
              referenteNome: '',
              referenteCognome: '',
              referenteRuolo: '',
              referenteFirma: ''
            }}
            phase1Dosimetri={phase1Data?.dosimetri || []}
            onChange={(field, value) => setPhase2Data(prev => ({ ...prev, [field]: value }))}
            onBack={() => setShowPhase2Form(false)}
            onSave={handlePhase2Save}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog per Conclusione Campagna */}
      <CampaignCompletionDialog
        open={showCompletionDialog}
        onOpenChange={setShowCompletionDialog}
        dosimeters={campaign.dosimeters}
        onComplete={handleCampaignCompletion}
      />
    </div>
  );
};

export default CampaignDetail;