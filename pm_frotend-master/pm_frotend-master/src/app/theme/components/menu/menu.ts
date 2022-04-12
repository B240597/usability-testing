import { Menu } from './menu.model';

export const verticalMenuItems = [
    // new Menu(1, 'Dashboard', '/instanttransport/dashboard', null, 'dashboard', null, false, 0, "white"),
]

export const horizontalMenuItems = [
    // new Menu(1, 'Dashboard', '/instanttransport/dashboard', null, 'dashboard', null, false, 0, "white"),
]

export const adminMenuItems = [

    new Menu(1, 'Dashboard', '/me/dashboard', null, 'dashboard', null, false, 0, "white", true),
    new Menu(2, 'Clients', '/me/clients', null, 'groups', null, false, 0, "white", true),
    new Menu(3, 'Projects', '/me/projects', null, 'business_center', null, false, 0, "white", true),
    new Menu(4, 'Job Management', '/me/job-management', null, 'reorder', null, false, 0, "white", true),
    new Menu(5, 'Devices', '/me/devices', null, 'dns', null, false, 0, "white", true),
    new Menu(6, 'Admin', '/me/admin', null, 'admin_panel_settings', null, true, 0, "white", true),
    new Menu(7, 'Users', '/me/admin/users', null, 'people', null, false, 6, "white", true),
    new Menu(8, 'Settings', '/me/admin/settings', null, 'settings', null, false, 6, "white", true),
    new Menu(9, 'Lookup Options', '/me/admin/lookup', null, 'search', null, false, 6, "white", true),

]
