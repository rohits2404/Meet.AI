import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { generateAvatarUri } from "@/lib/avatar";
import { DefaultVideoPlaceholder, StreamVideoParticipant, ToggleAudioPreviewButton, ToggleVideoPreviewButton, useCallStateHooks, VideoPreview } from "@stream-io/video-react-sdk";
import { LogInIcon } from "lucide-react";
import Link from "next/link";

interface Props {
    onJoin: () => void;
}

const DisabeledVideoPreview = () => {
    const { data } = authClient.useSession();
    return(
        <DefaultVideoPlaceholder
        participant={
            {
                name: data?.user.name ?? "",
                image: data?.user.image ?? generateAvatarUri({ seed: data?.user.name ?? "", variant: "initials" })
            } as StreamVideoParticipant
        }
        />
    )
}

const AllowedBrowserPermission = () => {
    return(
        <p className="text-sm">
            Please Grant Your Browser a Permission to Access your Camera and Microphone.
        </p>
    )
}

export const CallLobby = ({ onJoin }: Props) => {

    const { useCameraState, useMicrophoneState } = useCallStateHooks();

    const { hasBrowserPermission: hasMicPermission } = useMicrophoneState();
    const { hasBrowserPermission: hasCameraPermission } = useCameraState();

    const hasBrowserMediaPermission = hasCameraPermission && hasMicPermission;

    return(
        <div className="flex flex-col items-center justify-center h-full bg-radial from-sidebar-accent to-sidebar">
            <div className="py-4 px-8 flex flex-1 items-center justify-center">
                <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm">
                    <div className="flex flex-col gap-y-2 text-center">
                        <h6 className="text-lg font-medium">Ready To Join ?</h6>
                        <p className="text-sm">Set Up Your Call before Joining</p>
                    </div>
                    <VideoPreview
                    DisabledVideoPreview={
                        hasBrowserMediaPermission ? DisabeledVideoPreview : AllowedBrowserPermission
                    }
                    />
                    <div className="flex gap-x-2">
                        <ToggleAudioPreviewButton/>
                        <ToggleVideoPreviewButton/>
                    </div>
                    <div className="flex gap-x-2 justify-between w-full">
                        <Button asChild variant={"ghost"}>
                            <Link href={"/meetings"}>Cancel</Link>
                        </Button>
                        <Button
                        onClick={onJoin}
                        >
                            <LogInIcon/>
                            Join Call
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
} 