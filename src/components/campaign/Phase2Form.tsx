import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";

interface Phase2Data {
  dataInizio: string;
  dataFine: string;
  tecnicoNome: string;
  tecnicoCognome: string;
  tecnicoFirma: string;
  referenteNome: string;
  referenteCognome: string;
  referenteRuolo: string;
  referenteFirma: string;
}

interface Dosimetro2 {
  id: number;
  codiceDispositivo2: string;
  piano: string;
  ubicazione: string;
  foto: File[];
}

interface Phase2FormProps {
  data: Phase2Data;
  onChange: (field: keyof Phase2Data, value: string) => void;
  onBack: () => void;
  onSave: (dosimetri: Dosimetro2[]) => void;
  phase1Dosimetri: Array<{
    id: number;
    codiceDispositivo1: string;
    piano: string;
    ubicazione: string;
    foto: File[];
  }>;
}

export const Phase2Form = ({ data, onChange, onBack, onSave, phase1Dosimetri }: Phase2FormProps) => {
  const [dosimetri, setDosimetri] = useState<Dosimetro2[]>(
    phase1Dosimetri.map(d => ({
      id: d.id,
      codiceDispositivo2: '',
      piano: d.piano,
      ubicazione: d.ubicazione,
      foto: []
    }))
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleDosimetroChange = (id: number, field: keyof Dosimetro2, value: string) => {
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
      codiceDispositivo2: '', 
      piano: '',
      ubicazione: '',
      foto: []
    }]);
  };

  const removeDosimetro = (id: number) => {
    if (dosimetri.length > 1) {
      setDosimetri(prev => prev.filter(d => d.id !== id));
    }
  };

  const handleFotoChange = (id: number, files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      if (fileArray.length > 3) {
        setErrors(prev => ({ ...prev, [`foto_${id}`]: 'Massimo 3 foto per dosimetro' }));
        return;
      }
      setErrors(prev => ({ ...prev, [`foto_${id}`]: '' }));
      setDosimetri(prev => 
        prev.map(dosimetro => 
          dosimetro.id === id ? { ...dosimetro, foto: fileArray } : dosimetro
        )
      );
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validazione dosimetri
    dosimetri.forEach(dosimetro => {
      if (!dosimetro.codiceDispositivo2) {
        newErrors[`codice_${dosimetro.id}`] = 'Campo obbligatorio';
      }
      if (dosimetro.foto.length === 0) {
        newErrors[`foto_${dosimetro.id}`] = 'Almeno una foto è obbligatoria';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    // Auto-compila data fine con data odierna
    const today = new Date().toISOString().split('T')[0];
    onChange('dataFine', today);
    
    onSave(dosimetri);
  };

  return (
    <div className="space-y-6">
      {/* Scheda Posizionamento Fase 2 */}
      <Card className="max-w-4xl mx-auto p-8">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">
            Posizionamento Fase 2
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataInizio">Data Inizio</Label>
                <Input
                  id="dataInizio"
                  type="date"
                  value={data.dataInizio}
                  onChange={(e) => onChange('dataInizio', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataFine">Data Fine</Label>
                <Input
                  id="dataFine"
                  type="date"
                  value={data.dataFine}
                  onChange={(e) => onChange('dataFine', e.target.value)}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">Si compila automaticamente</p>
              </div>
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
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Codice Dispositivo 2 *</Label>
                      <Input
                        value={dosimetro.codiceDispositivo2}
                        onChange={(e) => handleDosimetroChange(dosimetro.id, 'codiceDispositivo2', e.target.value)}
                        placeholder="Codice dispositivo"
                        className={errors[`codice_${dosimetro.id}`] ? 'border-destructive' : ''}
                      />
                      {errors[`codice_${dosimetro.id}`] && (
                        <p className="text-sm text-destructive">{errors[`codice_${dosimetro.id}`]}</p>
                      )}
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
                  
                  <div className="space-y-2">
                    <Label>Foto (1-3 foto) *</Label>
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFotoChange(dosimetro.id, e.target.files)}
                      className={errors[`foto_${dosimetro.id}`] ? 'border-destructive' : ''}
                    />
                    {errors[`foto_${dosimetro.id}`] && (
                      <p className="text-sm text-destructive">{errors[`foto_${dosimetro.id}`]}</p>
                    )}
                    {dosimetro.foto.length > 0 && (
                      <div className="text-sm text-muted-foreground">
                        {dosimetro.foto.length} foto selezionate: {dosimetro.foto.map(f => f.name).join(', ')}
                      </div>
                    )}
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
              Concludi Campagna
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};