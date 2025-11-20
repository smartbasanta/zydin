export interface DropdownParent {
    name: string;
    path: string;
    children?: NavLink[]
}

export interface NavLink {
    name: string;
    path: string;
}