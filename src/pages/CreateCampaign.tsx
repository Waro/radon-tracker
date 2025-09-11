import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const CreateCampaign = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    startDate: '',
    endDate: '',
    participantCount: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.location || !formData.startDate) {
      toast({
        title: "Errore",
        description: "Compila i campi obbligatori",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically save to a database
    // For now, we'll just show a success message and navigate back
    toast({
      title: "Successo",
      description: "Campagna creata con successo"
    });
    
    navigate('/');
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
        <Card className="max-w-2xl mx-auto p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Campagna *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="es. Monitoraggio Radon Centro Storico 2024"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Località *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="es. Roma, Quartiere Testaccio"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Data Inizio *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Data Fine</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="participantCount">Numero Partecipanti Previsti</Label>
              <Input
                id="participantCount"
                type="number"
                value={formData.participantCount}
                onChange={(e) => handleChange('participantCount', e.target.value)}
                placeholder="es. 50"
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Note</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Note aggiuntive sulla campagna..."
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
                className="flex-1"
              >
                Annulla
              </Button>
              <Button 
                type="submit" 
                className="flex-1 flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Crea Campagna
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default CreateCampaign;