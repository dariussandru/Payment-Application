import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PaymentDetailService } from '../shared/payment-detail.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styles: [],
})
export class PopUpComponent implements OnInit {
  constructor(
    private ref: MatDialogRef<PopUpComponent>,
    private toastr: ToastrService,
    public service: PaymentDetailService
  ) {}

  otpGenerated: string | undefined;
  ngOnInit(): void {
    this.service.getOTP().subscribe({
      next: (otpGenerated: string) => {
        this.otpGenerated = otpGenerated;
        this.toastr.info(otpGenerated, 'One time passward');
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onSubmitOTP(formOTP: NgForm) {
    let otpValueInput = (
      document.querySelector(
        'input[name="OTPinputFromUser"]'
      ) as HTMLInputElement
    ).value;

    if (otpValueInput == this.otpGenerated) this.ref.close('success');
    else {
      this.toastr.error('Please try again', 'Invalid OTP');
      this.service.getOTP().subscribe({
        next: (otpGenerated: string) => {
          this.otpGenerated = otpGenerated;
          this.toastr.info(otpGenerated, 'One time passward');
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  close() {
    this.ref.close();
  }
}
