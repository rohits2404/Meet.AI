import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AgentForm } from "./agent-form";

interface NewAgentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const NewAgentDialog = ({ open, onOpenChange }: NewAgentDialogProps) => {
    return(
        <ResponsiveDialog
        title="New Agent"
        description="Create a New Agent"
        open={open}
        onOpenChange={onOpenChange}
        >
            <AgentForm
            onCancel={() => onOpenChange(false)}
            onSuccess={() => onOpenChange(false)}
            />
        </ResponsiveDialog>
    )
}