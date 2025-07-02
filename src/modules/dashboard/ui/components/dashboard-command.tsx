import { CommandResponsiveDialog, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Dispatch, SetStateAction } from "react";

interface Props {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DashboardCommand = ({ open, setOpen }: Props) => {
    return(
        <CommandResponsiveDialog open={open} onOpenChange={setOpen}>
            <CommandInput
            placeholder="Find A Meeting or Agent"
            />
            <CommandList>
                <CommandItem>Test</CommandItem>
                <CommandItem>Test2</CommandItem>
            </CommandList>
        </CommandResponsiveDialog>
    )
}