import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const DropDown = ({ menuItem, label, open }: { menuItem: string[], label: string, open: boolean }) => {
    return (
        <DropdownMenu open={open}>
            <DropdownMenuTrigger className="hover:text-[#DBC166] transition-colors duration-300 cursor-pointer transform hover:scale-105">
                <button className="">{label}</button>
            </DropdownMenuTrigger>
            {open && (
                <DropdownMenuContent>
                    <DropdownMenuLabel>{label}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {menuItem.map((item, index) => (
                        <DropdownMenuItem key={index}>{item}</DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            )}
        </DropdownMenu>
    );
};

export default DropDown