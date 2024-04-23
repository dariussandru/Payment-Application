import { Component } from '@angular/core';
import { PaymentDetailService } from 'src/app/shared/payment-detail.service';
import { NgForm } from '@angular/forms';
import { PaymentDetail } from 'src/app/shared/payment-detail.model';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { PopUpComponent } from 'src/app/pop-up/pop-up.component';

@Component({
  selector: 'app-payment-detail-form',
  templateUrl: './payment-detail-form.component.html',
  styles: [],
})
export class PaymentDetailFormComponent {
  constructor(
    public service: PaymentDetailService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  onSubmit(form: NgForm) {
    let cardOwnerName = this.service.formData.cardOwnerName;
    let cardNumber = this.service.formData.cardNumber;
    let securityCode = this.service.formData.cardNumber;
    let expirationDate = this.service.formData.expirationDate;

    if (cardOwnerName == '') this.toastr.error('Input cannot be empty.');
    else if (cardNumber == '') this.toastr.error('Input cannot be empty.');
    else if (securityCode == '') this.toastr.error('Input cannot be empty.');
    else if (expirationDate == '') this.toastr.error('Input cannot be empty.');

    this.service.formSubmitted = true;
    if (form.valid) {
      if (this.service.formData.paymentDetailId == 0) {
        let dialogRef = this.dialog.open(PopUpComponent, {
          width: '40%',
          height: '300px',
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result === 'success') {
            this.insertRecord(form);
          }
        });
      } else this.updateRecord(form);
    } else {
      this.toastr.error('One input is invalid');
    }
  }

  insertRecord(form: NgForm) {
    this.service.postPaymentDetail().subscribe({
      next: (res) => {
        this.service.list = res as PaymentDetail[];
        this.service.resetForm(form);
        this.toastr.success('Inserted successfully', 'Payment Detail Register');
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  updateRecord(form: NgForm) {
    this.service.putPaymentDetail().subscribe({
      next: (res) => {
        this.service.list = res as PaymentDetail[];
        this.service.resetForm(form);
        this.toastr.info('Updated successfully', 'Payment Detail Register');
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
