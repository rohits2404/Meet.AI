import { ResponsiveDialog } from "@/components/responsive-dialog";
import { MeetingForm } from "./meetings-form";
import { MeetingGetOne } from "../../types";

interface NewMeetingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialValues: MeetingGetOne;
}

export const UpdateMeetingDialog = ({ open, onOpenChange, initialValues }: NewMeetingDialogProps) => {

    return(
        <ResponsiveDialog
        title="Edit Meeting"
        description="Edit a New Meeting"
        open={open}
        onOpenChange={onOpenChange}
        >
            <MeetingForm
            onSuccess={() => {
                onOpenChange(false);
            }}
            onCancel={() => onOpenChange(false)}
            initialValues={initialValues}
            />
        </ResponsiveDialog>
    )
}