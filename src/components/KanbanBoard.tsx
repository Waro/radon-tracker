import { RadonCampaign, RadonCampaignCard } from "@/components/RadonCampaignCard";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface KanbanBoardProps {
  campaigns: RadonCampaign[];
  onCampaignClick: (campaign: RadonCampaign) => void;
}

const columns = [
  { id: 'planned', title: 'Da iniziare', status: 'planned' as const },
  { id: 'phase1', title: 'Fase 1', status: 'active' as const },
  { id: 'phase2', title: 'Fase 2', status: 'phase2' as const },
  { id: 'awaiting', title: 'Attesa esiti', status: 'awaiting_results' as const }
];

export const KanbanBoard = ({ campaigns, onCampaignClick }: KanbanBoardProps) => {
  const navigate = useNavigate();

  const getCampaignsByStatus = (status: string) => {
    const filtered = campaigns.filter(campaign => {
      if (status === 'phase2') {
        // Fase 2: campagne attive da più di 6 mesi (ritiro dosimetri)
        if (campaign.status === 'active') {
          const startDate = new Date(campaign.startDate);
          const sixMonthsLater = new Date(startDate);
          sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
          return new Date() >= sixMonthsLater;
        }
        return false;
      }
      if (status === 'active') {
        // Fase 1: solo campagne attive da meno di 6 mesi
        if (campaign.status === 'active') {
          const startDate = new Date(campaign.startDate);
          const sixMonthsLater = new Date(startDate);
          sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
          return new Date() < sixMonthsLater;
        }
        return false;
      }
      if (status === 'awaiting_results') {
        return campaign.status === 'awaiting_results';
      }
      return campaign.status === status;
    });

    // Ordina per data di scadenza o inizio più vicino
    const sorted = filtered.sort((a, b) => {
      if (status === 'planned' || status === 'unplanned') {
        // Per le campagne da iniziare, ordina per data di inizio più vicina
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      } else {
        // Per le campagne attive, ordina per scadenza (data inizio + 6 mesi)
        const aDeadline = new Date(a.startDate);
        aDeadline.setMonth(aDeadline.getMonth() + 6);
        const bDeadline = new Date(b.startDate);
        bDeadline.setMonth(bDeadline.getMonth() + 6);
        return aDeadline.getTime() - bDeadline.getTime();
      }
    });

    return sorted;
  };

  const handleColumnClick = (columnId: string) => {
    navigate(`/campaigns/${columnId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {columns.map(column => {
        const columnCampaigns = getCampaignsByStatus(column.status);
        const displayedCampaigns = columnCampaigns.slice(0, 2);
        const hasMore = columnCampaigns.length > 2;
        return (
          <div key={column.id} className="flex flex-col">
            <Card 
              className="bg-muted/30 border-border mb-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleColumnClick(column.id)}
            >
              <div className="p-4">
                <h3 className="font-semibold text-foreground flex items-center justify-between">
                  {column.title}
                  <span className="text-sm font-normal text-muted-foreground bg-background px-2 py-1 rounded">
                    {columnCampaigns.length}
                  </span>
                </h3>
              </div>
            </Card>
            <div className="space-y-4 flex-1">
              {displayedCampaigns.map(campaign => (
                <RadonCampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  onClick={() => onCampaignClick(campaign)}
                />
              ))}
              {columnCampaigns.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">Nessuna campagna</p>
                </div>
              )}
              {hasMore && (
                <div className="text-center py-2">
                  <button 
                    onClick={() => handleColumnClick(column.id)}
                    className="text-sm text-primary hover:text-primary/80 hover:underline"
                  >
                    Vedi altre {columnCampaigns.length - 2} →
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
