import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsPageComponent } from './accounts-page/accounts-page.component';
import { TransactionsPageComponent } from './transactions-page/transactions-page.component';
import { SettingsPageComponent } from './settings-page/settings-page.component';

const routes: Routes = [
  {
    path: 'accounts',
    component: AccountsPageComponent,
  },
  {
    path: 'transactions',
    component: TransactionsPageComponent,
  },
  {
    path: 'settings',
    component: SettingsPageComponent,
  },
  {
    path: '**',
    redirectTo: 'accounts',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
