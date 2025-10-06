import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { CampaignDataForm } from "@/components/campaign/CampaignDataForm";
import { Phase1Form } from "@/components/campaign/Phase1Form";
import { Phase2Form } from "@/components/campaign/Phase2Form";

const CreateCampaign = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  
  const [campaignData, setCampaignData] = useState({
    commessa: '',
    cliente: '',
    insegna: '',
    citta: '',
    provincia: '',
    indirizzo: '',
    telefono: '',
    mail: '',
    altro: '',
    dosimetriPrevisti: ''
  });

  const [phase1Data, setPhase1Data] = useState({
    dataInizio: '',
    dataFine: '',
    tecnicoNome: '',
    tecnicoCognome: '',
    tecnicoFirma: '',
    referenteNome: '',
    referenteCognome: '',
    referenteRuolo: '',
    referenteFirma: ''
  });

  const [phase2Data, setPhase2Data] = useState({
    dataInizio: '',
    dataFine: '',
    tecnicoNome: '',
    tecnicoCognome: '',
    tecnicoFirma: '',
    referenteNome: '',
    referenteCognome: '',
    referenteRuolo: '',
    referenteFirma: ''
  });

  const [phase1Dosimetri, setPhase1Dosimetri] = useState<any[]>([]);
  const [campaignId, setCampaignId] = useState<string>('');

  const handleCampaignDataChange = (field: keyof typeof campaignData, value: string) => {
    setCampaignData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhase1DataChange = (field: keyof typeof phase1Data, value: string) => {
    setPhase1Data(prev => ({ ...prev, [field]: value }));
  };

  const handlePhase2DataChange = (field: keyof typeof phase2Data, value: string) => {
    setPhase2Data(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    // Crea la campagna quando si passa allo step 2 (dopo aver compilato i dati base)
    const newCampaignId = Date.now().toString();
    setCampaignId(newCampaignId);
    
    const newCampaign = {
      id: newCampaignId,
      name: campaignData.commessa || 'Campagna senza nome',
      location: `${campaignData.citta}, ${campaignData.indirizzo}`,
      startDate: new Date().toISOString().split('T')[0],
      status: 'fase1' as const,
      riskLevel: 'low' as const,
      commessa: campaignData.commessa,
      cliente: campaignData.cliente,
      insegna: campaignData.insegna,
      citta: campaignData.citta,
      provincia: campaignData.provincia,
      indirizzo: campaignData.indirizzo,
      telefono: campaignData.telefono,
      mail: campaignData.mail,
      altro: campaignData.altro,
      dosimetriPrevisti: campaignData.dosimetriPrevisti
    };
    
    // Salva in localStorage
    const stored = localStorage.getItem('radon_campaigns');
    const campaigns = stored ? JSON.parse(stored) : [];
    campaigns.push(newCampaign);
    localStorage.setItem('radon_campaigns', JSON.stringify(campaigns));
    
    console.log('✅ Campagna creata (step 1):', newCampaign);
    console.log('📊 Totale campagne:', campaigns.length);
    
    // Notifica l'aggiornamento
    window.dispatchEvent(new Event('campaign-updated'));
    
    toast({
      title: "Campagna creata",
      description: "La campagna è stata creata e salvata"
    });
    
    setCurrentStep(2);
  };

  const handleBackStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setCurrentStep(2);
    }
  };

  const handlePhase1Complete = (dosimetri: any[]) => {
    setPhase1Dosimetri(dosimetri);
    
    // Aggiorna la campagna esistente con i dati Phase1
    const stored = localStorage.getItem('radon_campaigns');
    const campaigns = stored ? JSON.parse(stored) : [];
    
    const campaignIndex = campaigns.findIndex((c: any) => c.id === campaignId);
    
    if (campaignIndex !== -1) {
      campaigns[campaignIndex] = {
        ...campaigns[campaignIndex],
        phase1: {
          ...phase1Data,
          dosimetri: dosimetri
        }
      };
      
      localStorage.setItem('radon_campaigns', JSON.stringify(campaigns));
      
      console.log('✅ Campagna aggiornata con Phase1:', campaigns[campaignIndex]);
      console.log('📊 Dosimetri installati:', dosimetri.length);
      
      // Notifica l'aggiornamento
      window.dispatchEvent(new Event('campaign-updated'));
      
      // Notifica l'installazione dei dosimetri
      const event = new CustomEvent('dosimeter-installation', {
        detail: {
          campaignName: campaignData.commessa || 'Campagna senza nome',
          dosimeterCount: dosimetri.length
        }
      });
      window.dispatchEvent(event);
      
      toast({
        title: "Successo",
        description: "Fase 1 completata con successo"
      });
      
      // Piccolo ritardo per permettere all'evento di essere processato
      setTimeout(() => {
        navigate('/');
      }, 100);
    }
  };

  const handleSaveCampaign = (dosimetri2: any[]) => {
    // Here you would typically save to a database
    const fullCampaignData = {
      ...campaignData,
      phase1: {
        ...phase1Data,
        dosimetri: phase1Dosimetri
      },
      phase2: {
        ...phase2Data,
        dosimetri: dosimetri2
      }
    };
    
    console.log('Saving campaign:', fullCampaignData);

    // Calcola il totale dei dosimetri installati (Phase 1 + Phase 2)
    const totalDosimeters = phase1Dosimetri.length + dosimetri2.length;
    
    // Notifica l'installazione dei dosimetri
    const event = new CustomEvent('dosimeter-installation', {
      detail: {
        campaignName: campaignData.commessa || 'Campagna senza nome',
        dosimeterCount: totalDosimeters
      }
    });
    window.dispatchEvent(event);
    
    toast({
      title: "Successo",
      description: "Campagna completata con successo"
    });
    
    navigate('/');
  };

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
              <h1 className="text-2xl font-bold text-foreground">Nuova Campagna Radon</h1>
              <p className="text-muted-foreground">Crea una nuova campagna di indagine</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {currentStep === 1 && (
          <CampaignDataForm
            data={campaignData}
            onChange={handleCampaignDataChange}
            onNext={handleNextStep}
            onCancel={() => navigate('/')}
          />
        )}
        
        {currentStep === 2 && (
          <Phase1Form
            data={phase1Data}
            onChange={handlePhase1DataChange}
            onBack={handleBackStep}
            onNext={handlePhase1Complete}
          />
        )}
        
        {currentStep === 3 && (
          <Phase2Form
            data={phase2Data}
            onChange={handlePhase2DataChange}
            onBack={handleBackStep}
            onSave={handleSaveCampaign}
            phase1Dosimetri={phase1Dosimetri}
          />
        )}
      </main>
    </div>
  );
};

export default CreateCampaign;