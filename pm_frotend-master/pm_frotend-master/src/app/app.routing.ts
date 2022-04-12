import { Routes, RouterModule, PreloadAllModules } from "@angular/router";
import { ModuleWithProviders } from "@angular/core";
import { LayoutComponent } from "./layout/layout.component";
import { NotFoundComponent } from "./me/not-found/not-found.component";
import { DashboardComponent } from "./me/dashboard/dashboard.component";
import { MessageCenterComponent } from "./message-center/message-center.component";
import { JobManagementComponent } from "./me/job-management/job-management.component";
import { OHGuard } from "./optima-heat.guard";

export const routes: Routes = [

  { path: "", loadChildren: './login/login.module#LoginModule', data: { breadcrumb: "Login" } },
  {
    path: "admin",
    component: LayoutComponent,
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
      { path: "dashboard", loadChildren: './me/dashboard/dashboard.module#DashboardModule', data: { breadcrumb: 'Dashboard' } },
      {
        path: "job-management",
        component: JobManagementComponent,
        data: { breadcrumb: "Jobs Managment" }
      },
      { path: 'jobs', loadChildren: './me/clients/clients.module#ClientsModule', data: { breadcrumb: 'Jobs' } },
      { path: 'projects', loadChildren: './me/projects/projects.module#ProjectsModule', data: { breadcrumb: 'Projects'} },
      { path: 'admin', loadChildren: './me/admin/admin.module#AdminModule', data: { breadcrumb: 'Carriers' } },
      { path: "message-center", component: MessageCenterComponent, data: { breadcrumb: "Message Center" } },

    ],
  },

  {
    path: "**",
    component: NotFoundComponent,
    data: { breadcrumb: "Not found" },
  },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {
  //  preloadingStrategy: PreloadAllModules, 
  // useHash: true
});
