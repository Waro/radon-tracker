// Funzione helper per generare dosimetri
const generateDosimetri = (phaseNum: number, count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    codiceDispositivo1: `DOS-${phaseNum}-${String(i + 1).padStart(3, '0')}`,
    piano: i % 3 === 0 ? 'Piano Terra' : i % 3 === 1 ? 'Primo Piano' : 'Secondo Piano',
    ubicazione: `Locale ${String.fromCharCode(65 + (i % 5))}${i + 1}`,
    foto: []
  }));
};

export const initialCampaigns: any[] = [
  {
    id: '1',
    name: 'Monitoraggio Uffici Comunali Centro',
    location: 'Milano, Via Dante 45',
    startDate: '2025-11-03',
    status: 'fase1',
    riskLevel: 'low',
    commessa: 'COM-2025-001',
    cliente: 'Comune di Milano',
    insegna: 'Uffici Comunali',
    citta: 'Milano',
    provincia: 'MI',
    indirizzo: 'Via Dante 45',
    telefono: '02 1234567',
    mail: 'uffici@comune.milano.it',
    altro: 'Edificio storico del XIX secolo',
    dosimetriPrevisti: '10',
    phase1: {
      dataInizio: '2025-11-03',
      dataFine: '',
      tecnicoNome: 'Marco',
      tecnicoCognome: 'Rossi',
      tecnicoFirma: 'M.Rossi',
      referenteNome: 'Laura',
      referenteCognome: 'Bianchi',
      referenteRuolo: 'Responsabile Sicurezza',
      referenteFirma: 'L.Bianchi',
      dosimetri: generateDosimetri(1, 10)
    }
  },
  {
    id: '2',
    name: 'Controllo Scuola Secondaria Leonardo Da Vinci',
    location: 'Roma, Via Tiburtina 123',
    startDate: '2025-01-13',
    status: 'fase2',
    riskLevel: 'low',
    commessa: 'SCU-2025-002',
    cliente: 'Istituto Comprensivo Leonardo Da Vinci',
    insegna: 'Scuola Secondaria',
    citta: 'Roma',
    provincia: 'RM',
    indirizzo: 'Via Tiburtina 123',
    telefono: '06 9876543',
    mail: 'segreteria@icleonardo.it',
    altro: 'Edificio scolastico su 3 piani, monitoraggio aule e laboratori',
    dosimetriPrevisti: '10',
    phase1: {
      dataInizio: '2025-01-13',
      dataFine: '2025-06-18',
      tecnicoNome: 'Giuseppe',
      tecnicoCognome: 'Verdi',
      tecnicoFirma: 'G.Verdi',
      referenteNome: 'Maria',
      referenteCognome: 'Neri',
      referenteRuolo: 'Dirigente Scolastico',
      referenteFirma: 'M.Neri',
      dosimetri: generateDosimetri(1, 10)
    },
    phase2: {
      dataInizio: '2025-06-18',
      dataFine: '',
      tecnicoNome: 'Giuseppe',
      tecnicoCognome: 'Verdi',
      tecnicoFirma: 'G.Verdi',
      referenteNome: 'Maria',
      referenteCognome: 'Neri',
      referenteRuolo: 'Dirigente Scolastico',
      referenteFirma: 'M.Neri',
      dosimetri: generateDosimetri(2, 10)
    }
  }
];

// Funzione per inizializzare le campagne in localStorage
export const initializeCampaigns = () => {
  localStorage.setItem('radon_campaigns', JSON.stringify(initialCampaigns));
  console.log('✅ Campagne inizializzate:', initialCampaigns.length);
  return initialCampaigns;
};
