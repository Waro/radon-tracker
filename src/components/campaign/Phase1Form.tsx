import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";

interface Phase1Data {
  dataFase1: string;
  tecnicoNome: string;
  tecnicoCognome: string;
  tecnicoFirma: string;
  referenteNome: string;
  referenteCognome: string;
  referenteRuolo: string;
  referenteFirma: string;
}

interface Dosimetro {
  id: number;
  codiceDispositivo1: string;
  codiceDispositivo2: string;
  piano: string;
  ubicazione: string;
}

interface Phase1FormProps {
  data: Phase1Data;
  onChange: (field: keyof Phase1Data, value: string) => void;
  onBack: () => void;
  onSave: (dosimetri: Dosimetro[]) => void;
}

export const Phase1Form = ({ data, onChange, onBack, onSave }: Phase1FormProps) => {
  const [dosimetri, setDosimetri] = useState<Dosimetro[]>([
    { id: 1, codiceDispositivo1: '', codiceDispositivo2: '', piano: '', ubicazione: '' }
  ]);

  const handleDosimetroChange = (id: number, field: keyof Dosimetro, value: string) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(dosimetri);
  };

  return (
    <div className="space-y-6">
      {/* Scheda Posizionamento Fase 1 */}
      <Card className="max-w-4xl mx-auto p-8">
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
                value={data.dataFase1}
                onChange={(e) => onChange('dataFase1', e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Tecnico Proj.Eco</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tecnicoNome">Nome</Label>
                  <Input
                    id="tecnicoNome"
                    value={data.tecnicoNome}
                    onChange={(e) => onChange('tecnicoNome', e.target.value)}
                    placeholder="Nome"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tecnicoCognome">Cognome</Label>
                  <Input
                    id="tecnicoCognome"
                    value={data.tecnicoCognome}
                    onChange={(e) => onChange('tecnicoCognome', e.target.value)}
                    placeholder="Cognome"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tecnicoFirma">Firma</Label>
                  <Input
                    id="tecnicoFirma"
                    value={data.tecnicoFirma}
                    onChange={(e) => onChange('tecnicoFirma', e.target.value)}
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
                    value={data.referenteNome}
                    onChange={(e) => onChange('referenteNome', e.target.value)}
                    placeholder="Nome"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referenteCognome">Cognome</Label>
                  <Input
                    id="referenteCognome"
                    value={data.referenteCognome}
                    onChange={(e) => onChange('referenteCognome', e.target.value)}
                    placeholder="Cognome"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referenteRuolo">Ruolo</Label>
                  <Input
                    id="referenteRuolo"
                    value={data.referenteRuolo}
                    onChange={(e) => onChange('referenteRuolo', e.target.value)}
                    placeholder="Ruolo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referenteFirma">Firma</Label>
                  <Input
                    id="referenteFirma"
                    value={data.referenteFirma}
                    onChange={(e) => onChange('referenteFirma', e.target.value)}
                    placeholder="Firma"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Scheda Dosimetri */}
      <Card className="max-w-4xl mx-auto p-8">
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
            {dosimetri.map((dosimetro) => (
              <Card key={dosimetro.id} className="p-4 border-2">
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
      </Card>

      {/* Bottoni azione */}
      <Card className="max-w-4xl mx-auto p-6">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Indietro
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
    </div>
  );
};