"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { MeetingIdViewHeader } from "../components/meeting-id-view-header";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";
import { UpdateMeetingDialog } from "../components/update-meeting-dialog";
import { useState } from "react";
import { UpcomingState } from "../components/upcoming-state";
import { ActiveState } from "../components/active-state";
import { CancelledState } from "../components/cancelled-state";

interface Props {
    meetingId: string;
}

export const MeetingIdView = ({ meetingId }: Props) => {

    const [UpdateMeetingDialogOpen,setUpdateMeetingDialogOpen] = useState(false);

    const [RemoveConfirmation, confirmRemove] = useConfirm(
        "Are You Sure?",
        "The Following Action Will Remove This Meeting"
    );

    const router = useRouter();

    const queryClient = useQueryClient();

    const trpc = useTRPC();

    const { data } = useSuspenseQuery(trpc.meetings.getOne.queryOptions({
        id: meetingId
    }))

    const removeMeeting = useMutation(trpc.meetings.remove.mutationOptions({
        onSuccess: () => {
            queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
            router.push("/meetings")
        }
    }))

    const handleRemoveMeeting = async () => {
        const ok = await confirmRemove();
        if(!ok) return;
        await removeMeeting.mutateAsync({ id: meetingId })
    }

    const isActive = data.status === "active";
    const isUpcoming = data.status === "upcoming";
    const isCompleted = data.status === "completed";
    const isCancelled = data.status === "cancelled";
    const isProcessing = data.status === "processing";

    return(
        <>
            <RemoveConfirmation/>
            <UpdateMeetingDialog
            open={UpdateMeetingDialogOpen}
            onOpenChange={setUpdateMeetingDialogOpen}
            initialValues={data}
            />
            <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
                <MeetingIdViewHeader
                meetingId={meetingId}
                meetingName={data.name}
                onRemove={handleRemoveMeeting}
                onEdit={() => setUpdateMeetingDialogOpen(true)}
                />
                {isCancelled && <CancelledState/>}
                {isProcessing && <div>Processing</div>}
                {isCompleted && <div>Completed</div>}
                {isUpcoming &&
                    <UpcomingState
                    meetingId={meetingId}
                    onCancelMeeting={() => {}}
                    isCancelling={false}
                    />
                }
                {isActive && <ActiveState meetingId={meetingId}/>}
            </div>
        </>
    )
}

export const MeetingsIdViewLoading = () => {
    return(
        <LoadingState
        title="Loading Meetings"
        description="This May Take a Few Seconds..."
        />
    )
}

export const MeetingsIdViewError = () => {
    return(
        <ErrorState
        title='Error Loading Meetings'
        description='Something Went Wrong...'
        />
    )
}