import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const CreateCampaign = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    commessa: '',
    cliente: '',
    insegna: '',
    citta: '',
    provincia: '',
    indirizzo: '',
    telefono: '',
    mail: '',
    altro: '',
    // Posizionamento Fase 1
    dataFase1: '',
    tecnicoNome: '',
    tecnicoCognome: '',
    tecnicoFirma: '',
    referenteNome: '',
    referenteCognome: '',
    referenteRuolo: '',
    referenteFirma: ''
  });

  const [dosimetri, setDosimetri] = useState([
    { id: 1, codiceDispositivo1: '', codiceDispositivo2: '', piano: '', ubicazione: '' }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.commessa || !formData.cliente || !formData.citta) {
      toast({
        title: "Errore",
        description: "Compila i campi obbligatori",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically save to a database
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

  const handleDosimetroChange = (id: number, field: string, value: string) => {
    setDosimetri(prev => 
      prev.map(dosimetro => 
        dosimetro.id === id ? { ...dosimetro, [field]: value } : dosimetro
      )
    );
  };

  const addDosimetro = () => {
    const newId = Math.max(...dosimetri.map(d => d.id)) + 1;
    setDosimetri(prev => [...prev, { 
      id: newId, 
      codiceDispositivo1: '', 
      codiceDispositivo2: '', 
      piano: '',
      ubicazione: ''
    }]);
  };

  const removeDosimetro = (id: number) => {
    if (dosimetri.length > 1) {
      setDosimetri(prev => prev.filter(d => d.id !== id));
    }
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
        <Card className="max-w-4xl mx-auto p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Dati Campagna */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">
                Dati Campagna
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="commessa">Commessa *</Label>
                  <Input
                    id="commessa"
                    value={formData.commessa}
                    onChange={(e) => handleChange('commessa', e.target.value)}
                    placeholder="Numero commessa"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cliente">Cliente *</Label>
                  <Input
                    id="cliente"
                    value={formData.cliente}
                    onChange={(e) => handleChange('cliente', e.target.value)}
                    placeholder="Nome cliente"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="insegna">Insegna</Label>
                  <Input
                    id="insegna"
                    value={formData.insegna}
                    onChange={(e) => handleChange('insegna', e.target.value)}
                    placeholder="Insegna"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="citta">Città *</Label>
                  <Input
                    id="citta"
                    value={formData.citta}
                    onChange={(e) => handleChange('citta', e.target.value)}
                    placeholder="Città"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provincia">Provincia</Label>
                  <Input
                    id="provincia"
                    value={formData.provincia}
                    onChange={(e) => handleChange('provincia', e.target.value)}
                    placeholder="Provincia"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono">Telefono</Label>
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => handleChange('telefono', e.target.value)}
                    placeholder="Numero di telefono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="indirizzo">Indirizzo</Label>
                <Input
                  id="indirizzo"
                  value={formData.indirizzo}
                  onChange={(e) => handleChange('indirizzo', e.target.value)}
                  placeholder="Indirizzo completo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mail">Email</Label>
                <Input
                  id="mail"
                  type="email"
                  value={formData.mail}
                  onChange={(e) => handleChange('mail', e.target.value)}
                  placeholder="Email di contatto"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="altro">Altro</Label>
                <Textarea
                  id="altro"
                  value={formData.altro}
                  onChange={(e) => handleChange('altro', e.target.value)}
                  placeholder="Note aggiuntive..."
                  rows={3}
                />
              </div>
            </div>

            {/* Posizionamento Fase 1 */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">
                Posizionamento Fase 1
              </h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dataFase1">Data</Label>
                  <Input
                    id="dataFase1"
                    type="date"
                    value={formData.dataFase1}
                    onChange={(e) => handleChange('dataFase1', e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">Tecnico Proj.Eco</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tecnicoNome">Nome</Label>
                      <Input
                        id="tecnicoNome"
                        value={formData.tecnicoNome}
                        onChange={(e) => handleChange('tecnicoNome', e.target.value)}
                        placeholder="Nome"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tecnicoCognome">Cognome</Label>
                      <Input
                        id="tecnicoCognome"
                        value={formData.tecnicoCognome}
                        onChange={(e) => handleChange('tecnicoCognome', e.target.value)}
                        placeholder="Cognome"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tecnicoFirma">Firma</Label>
                      <Input
                        id="tecnicoFirma"
                        value={formData.tecnicoFirma}
                        onChange={(e) => handleChange('tecnicoFirma', e.target.value)}
                        placeholder="Firma"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">Referente Cliente</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="referenteNome">Nome</Label>
                      <Input
                        id="referenteNome"
                        value={formData.referenteNome}
                        onChange={(e) => handleChange('referenteNome', e.target.value)}
                        placeholder="Nome"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="referenteCognome">Cognome</Label>
                      <Input
                        id="referenteCognome"
                        value={formData.referenteCognome}
                        onChange={(e) => handleChange('referenteCognome', e.target.value)}
                        placeholder="Cognome"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="referenteRuolo">Ruolo</Label>
                      <Input
                        id="referenteRuolo"
                        value={formData.referenteRuolo}
                        onChange={(e) => handleChange('referenteRuolo', e.target.value)}
                        placeholder="Ruolo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="referenteFirma">Firma</Label>
                      <Input
                        id="referenteFirma"
                        value={formData.referenteFirma}
                        onChange={(e) => handleChange('referenteFirma', e.target.value)}
                        placeholder="Firma"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dosimetri */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2 flex-1">
                  Dosimetri Radon
                </h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addDosimetro}
                  className="ml-4"
                >
                  <Plus className="h-4 w-4" />
                  Aggiungi Dosimetro
                </Button>
              </div>

              <div className="space-y-4">
                {dosimetri.map((dosimetro, index) => (
                  <Card key={dosimetro.id} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-foreground">
                        R{dosimetro.id}
                      </h3>
                      {dosimetri.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDosimetro(dosimetro.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>Codice Dispositivo 1</Label>
                        <Input
                          value={dosimetro.codiceDispositivo1}
                          onChange={(e) => handleDosimetroChange(dosimetro.id, 'codiceDispositivo1', e.target.value)}
                          placeholder="Codice dispositivo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Codice Dispositivo 2</Label>
                        <Input
                          value={dosimetro.codiceDispositivo2}
                          onChange={(e) => handleDosimetroChange(dosimetro.id, 'codiceDispositivo2', e.target.value)}
                          placeholder="Codice dispositivo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Piano</Label>
                        <Input
                          value={dosimetro.piano}
                          onChange={(e) => handleDosimetroChange(dosimetro.id, 'piano', e.target.value)}
                          placeholder="Piano"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Ubicazione</Label>
                        <Input
                          value={dosimetro.ubicazione}
                          onChange={(e) => handleDosimetroChange(dosimetro.id, 'ubicazione', e.target.value)}
                          placeholder="Ubicazione"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-6">
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