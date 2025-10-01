import { RadonCampaign, RadonCampaignCard } from "@/components/RadonCampaignCard";
import { Card } from "@/components/ui/card";

interface KanbanBoardProps {
  campaigns: RadonCampaign[];
  onCampaignClick: (campaign: RadonCampaign) => void;
}

const columns = [
  { id: 'planned', title: 'Da iniziare', status: 'planned' as const },
  { id: 'phase1', title: 'Fase 1', status: 'active' as const },
  { id: 'phase2', title: 'Fase 2', status: 'phase2' as const },
  { id: 'completed', title: 'Terminate', status: 'completed' as const }
];

export const KanbanBoard = ({ campaigns, onCampaignClick }: KanbanBoardProps) => {
  const getCampaignsByStatus = (status: string) => {
    return campaigns.filter(campaign => {
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
      return campaign.status === status;
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {columns.map(column => {
        const columnCampaigns = getCampaignsByStatus(column.status);
        return (
          <div key={column.id} className="flex flex-col">
            <Card className="bg-muted/30 border-border mb-4">
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
              {columnCampaigns.map(campaign => (
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
            </div>
          </div>
        );
      })}
    </div>
  );
};
