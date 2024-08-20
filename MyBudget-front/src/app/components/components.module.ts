import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NewAccountDialogComponent } from './new-account-dialog/new-account-dialog.component';
import { NewTransactionDialogComponent } from './new-transaction-dialog/new-transaction-dialog.component';
import { AppMaterialModule } from '../app-material/app-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DeleteConfirmationDialogComponent } from './delete-confirmation-dialog/delete-confirmation-dialog.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    NewAccountDialogComponent,
    NewTransactionDialogComponent,
    DeleteConfirmationDialogComponent,
  ],
  imports: [CommonModule, AppMaterialModule, ReactiveFormsModule],
  exports: [
    HeaderComponent,
    FooterComponent,
    NewAccountDialogComponent,
    NewTransactionDialogComponent,
  ],
})
export class ComponentsModule {}
