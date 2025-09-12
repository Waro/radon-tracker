import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { CampaignDataForm } from "@/components/campaign/CampaignDataForm";
import { Phase1Form } from "@/components/campaign/Phase1Form";

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
    altro: ''
  });

  const [phase1Data, setPhase1Data] = useState({
    dataFase1: '',
    tecnicoNome: '',
    tecnicoCognome: '',
    tecnicoFirma: '',
    referenteNome: '',
    referenteCognome: '',
    referenteRuolo: '',
    referenteFirma: ''
  });

  const handleCampaignDataChange = (field: keyof typeof campaignData, value: string) => {
    setCampaignData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhase1DataChange = (field: keyof typeof phase1Data, value: string) => {
    setPhase1Data(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    setCurrentStep(2);
  };

  const handleBackStep = () => {
    setCurrentStep(1);
  };

  const handleSaveCampaign = (dosimetri: any[]) => {
    // Here you would typically save to a database
    const fullCampaignData = {
      ...campaignData,
      ...phase1Data,
      dosimetri
    };
    
    console.log('Saving campaign:', fullCampaignData);
    
    toast({
      title: "Successo",
      description: "Campagna creata con successo"
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
            onSave={handleSaveCampaign}
          />
        )}
      </main>
    </div>
  );
};

export default CreateCampaign;