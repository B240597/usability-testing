import {
    Component
} from '@angular/core';
import {
    ActivatedRoute,
    Router,
    ActivatedRouteSnapshot,
    UrlSegment,
    NavigationEnd
} from "@angular/router";
import {
    Title
} from '@angular/platform-browser';
import {
    AppSettings
} from '../../../app.settings';
import {
    Settings
} from '../../../app.settings.model';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent {

    public pageTitle: string;
    public moduleTitle: string;
    public subTitle: string = "test";
    public test = "sample";
    public description: {};
    public breadcrumbs: {
        name: string;
        url: string
    } [] = [];
    public url:string = "none";

    public settings: Settings;
    constructor(public appSettings: AppSettings,
        public router: Router,
        public activatedRoute: ActivatedRoute,
        public title: Title) {
        this.settings = this.appSettings.settings;
        this.router.events.subscribe((e) => {
            if (e instanceof NavigationEnd) {
              this.url=e.url.toString();
              console.log('bc',this.url);
            }
          });
        this.description = {

            "Analytics": "View analytics in the form of graphs and charts to get an overview of any project",

            "Dashboard": "This screen is used to get an overview on all the task activities",

            "Manage": "This is Manage Screen",
            
            "Grid View": "This is Grid View Screen",
            "Map View": "This is Map View Screen",
            "Contacts": "This is Contacts Screen",


            "Projects": "This screen is used to View,  add and Manage the Projects in the Organization ",
            "Project Dashboard": "A complete overview of any particular project is viewable from this screen ",
            "Scheduling":"This is Scheduling Screen",
            "Activity": "The timeline of the Project updates appears here.",
            
            "Payroll":"This is Payroll Screen",

            "Audit":"This is Audit Screen",
            "Overview":"This is Overview Screen",
            "Checklist":"This is Checklist Screen",

            "Procurement":"This is Procurement Screen",
            "Purchase Orders":"This is Procurement Screen",
            "Quotation Review":"This is Quotation Review Screen",
            "Quotations":"This is Quotations Screen",
            "Requisition":"This is Requisition Screen",
            "Work Orders":"This is Work Orders Screen",

            "Inventory":"This is Inventory Screen",
            "Consignment":"This is Consignment Screen",
            "Gate Passes":"This is Gate Passes Screen",
            "GRN":"This is GRN Screen",
            "Item Type":"This is Item Master Screen",
            "Material Issues":"This is Material Issues Screen",
            "Stock Transfer":"This is Stock Transfer Screen",
            "Stock Disposal":"This is Stock Disposal Screen",
            "Vendor master":"This is Vendor master Screen",


            "Assets":"This is Assets Screen",
            "Assets Master":"This is Assets Master Screen",
            "Assets Maintenance":"This is Assets Maintenance Screen",
            "Assets Transfer":"This is Assets Transfer Screen",

            "Finance":"This is Finance Screen",
            "Billing":"This is Billing Screen",
            "Budgeting":"This is Budgeting Screen",
            "Expenses":"This is Expenses Screen",
            "Payables":"This is Payables Screen",

            "Admin":"This is Admin Screen",
            "Roles":"This is Roles Screen",
            "Users":"This screen is used to Add and Manage the users based with Respective Roles",
            "Master Data":"This screen is used to manage the master data in the application",
            "Kanban":"This is Kanban Screen",
            "Color Codes":"This is Color Codes Screen",
            "Settings":"This screen is used to manage the settings in the application",
            "Lookup Options":"This screen is used to manage the lookup options throughout  the application",
            "Announcements":"This is Announcements Screen",
            "Message Center" : "All messages can be viewed here",
            "Screen":"This is a Screen",
            "Branch" : "This screen is used to manage the branches",
            "Quotation" : "This screen is used to manage the quotations",
            "Material Issue Details" : "Spare parts/Material issued will be captured here",
            "Item Make" : "This is a Item Make Screen",
            "Item Model": "This is a Item Model Screen",

            "Devices": "Add and Manage IoT devices and read real time data pushed by the sensors in the IoT device",
            "Data Field":"This is DataField Screen",

            "Clients":"Add , view and manage your client directory on this screen",
            "Jobs": "This Screen is used to add and manage the tasks for respective projects",
            "Login":"This is login screen",
            "Jobs Managment":"This screen is used to track the engineers work records."
        };
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.breadcrumbs = [];
                this.parseRoute(this.router.routerState.snapshot.root);
                this.pageTitle = "";
                this.breadcrumbs.forEach(breadcrumb => {
                    this.pageTitle = breadcrumb.name;
                })
                this.pageTitle ? null : this.pageTitle = " | Dashboard";

                var temp = this.pageTitle.split(' | ');
                if (temp.length > 4) {
                    this.subTitle = temp.pop();
                    this.moduleTitle = temp[temp.length - 1];
                } else if (temp.length > 3) {
                    this.subTitle = temp.pop();
                    this.moduleTitle = temp[temp.length - 1];
                } else {
                    this.moduleTitle = temp.pop();
                }

                if (this.subTitle === 'Permissions') {
                    this.moduleTitle = "Permissions";
                    this.subTitle = "test";
                }
                this.title.setTitle( this.pageTitle);
            }
        })
    }

    private parseRoute(node: ActivatedRouteSnapshot) {
        if (node.data['breadcrumb']) {
            if (node.url.length) {
                let urlSegments: UrlSegment[] = [];
                node.pathFromRoot.forEach(routerState => {
                    urlSegments = urlSegments.concat(routerState.url);
                });
                let url = urlSegments.map(urlSegment => {
                    return urlSegment.path;
                }).join('/');
                this.breadcrumbs.push({
                    name: node.data['breadcrumb'],
                    url: '/' + url
                })
            }
        }
        if (node.firstChild) {
            this.parseRoute(node.firstChild);
        }
    }

    public closeSubMenus() {
        let menu = document.querySelector(".sidenav-menu-outer");
        if (menu) {
            for (let i = 0; i < menu.children[0].children.length; i++) {
                let child = menu.children[0].children[i];
                if (child) {
                    if (child.children[0].classList.contains('expanded')) {
                        child.children[0].classList.remove('expanded');
                        child.children[1].classList.remove('show');
                    }
                }
            }
        }
    }
}