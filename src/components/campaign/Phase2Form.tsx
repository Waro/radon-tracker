import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Save, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BarcodeScanner } from "../BarcodeScanner";

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
  const [replacedDosimeters, setReplacedDosimeters] = useState<Set<number>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleDosimetroChange = (id: number, field: keyof Dosimetro2, value: string) => {
    setDosimetri(prev => 
      prev.map(dosimetro => 
        dosimetro.id === id ? { ...dosimetro, [field]: value } : dosimetro
      )
    );
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

  const handleReplaceDosimeter = (id: number) => {
    setReplacedDosimeters(prev => new Set([...prev, id]));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validazione dosimetri sostituiti
    dosimetri.forEach(dosimetro => {
      if (replacedDosimeters.has(dosimetro.id)) {
        if (!dosimetro.codiceDispositivo2) {
          newErrors[`codice_${dosimetro.id}`] = 'Campo obbligatorio';
        }
        if (dosimetro.foto.length === 0) {
          newErrors[`foto_${dosimetro.id}`] = 'Almeno una foto è obbligatoria';
        }
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
            Fase 2 - Posizionamento Dosimetri
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
          <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">
            Dosimetri Radon - Sostituzione
          </h2>
          <p className="text-sm text-muted-foreground">
            I dosimetri della Fase 1 sono stati rimossi. Per ogni punto di misurazione, sostituisci con un nuovo dosimetro per la Fase 2.
          </p>

          <div className="space-y-4">
            {phase1Dosimetri.map((dosimetro, index) => {
              const isReplaced = replacedDosimeters.has(dosimetro.id);
              const dosimetro2 = dosimetri.find(d => d.id === dosimetro.id);
              
              return (
                <Card key={dosimetro.id} className="p-4 border-2">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-foreground">
                      R{dosimetro.id}
                    </h3>
                    {isReplaced && (
                      <Badge variant="secondary" className="ml-2">
                        Sostituito
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    {/* Dosimetro Fase 1 - Bloccato */}
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="text-sm font-medium mb-3 text-muted-foreground">Dosimetro Fase 1 (Rimosso)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Codice Dispositivo 1</Label>
                          <Input
                            value={dosimetro.codiceDispositivo1}
                            disabled
                            className="bg-muted"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Piano</Label>
                          <Input
                            value={dosimetro.piano}
                            disabled
                            className="bg-muted"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Ubicazione</Label>
                          <Input
                            value={dosimetro.ubicazione}
                            disabled
                            className="bg-muted"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Dosimetro Fase 2 - Sostituito */}
                    {!isReplaced ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleReplaceDosimeter(dosimetro.id)}
                        className="w-full"
                      >
                        <Package className="h-4 w-4 mr-2" />
                        Sostituisci Dosimetro
                      </Button>
                    ) : (
                      <div className="p-3 border-2 border-primary rounded-lg">
                        <h4 className="text-sm font-medium mb-3">Nuovo Dosimetro Fase 2</h4>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label>Codice Dispositivo 2 *</Label>
                              <div className="flex gap-2">
                                <Input
                                  value={dosimetro2?.codiceDispositivo2 || ''}
                                  onChange={(e) => handleDosimetroChange(dosimetro.id, 'codiceDispositivo2', e.target.value)}
                                  placeholder="Codice dispositivo"
                                  className={errors[`codice_${dosimetro.id}`] ? 'border-destructive' : ''}
                                />
                                <BarcodeScanner 
                                  onScan={(code) => handleDosimetroChange(dosimetro.id, 'codiceDispositivo2', code)}
                                />
                              </div>
                              {errors[`codice_${dosimetro.id}`] && (
                                <p className="text-sm text-destructive">{errors[`codice_${dosimetro.id}`]}</p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label>Piano</Label>
                              <Input
                                value={dosimetro2?.piano || dosimetro.piano}
                                onChange={(e) => handleDosimetroChange(dosimetro.id, 'piano', e.target.value)}
                                placeholder="Piano"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Ubicazione</Label>
                              <Input
                                value={dosimetro2?.ubicazione || dosimetro.ubicazione}
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
                            {dosimetro2 && dosimetro2.foto.length > 0 && (
                              <div className="text-sm text-muted-foreground">
                                {dosimetro2.foto.length} foto selezionate: {dosimetro2.foto.map(f => f.name).join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
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
              Salva Posizionamento Fase 2
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};