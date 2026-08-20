import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  AbstractControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { IForm } from '../models/i-form';

@Component({
  selector: 'app-data-form',
  imports: [ReactiveFormsModule],
  templateUrl: './data-form.html',
  styleUrl: './data-form.scss',
})
export class DataForm implements OnInit {
  formData: IForm[] = [];
  Form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const savedData = localStorage.getItem('formData');
    this.formData = savedData ? JSON.parse(savedData) : [];

    this.Form = this.fb.group(
      {
        fname: new FormControl('', [Validators.required, Validators.minLength(3)]),
        lname: new FormControl('', [Validators.required, Validators.minLength(3)]),
        age: new FormControl('', [Validators.required, Validators.min(5)]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9]).+$/),
        ]),
        vpassword: new FormControl('', [Validators.required]),
      },
      {
        validators: this.passwordVerification,
      },
    );
  }

  private passwordVerification(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const vpassword = control.get('vpassword')?.value;

    return password === vpassword ? null : { passwordError: true };
  }

  submitForm(): void {
    const fname = this.Form.value.fname.trim();
    const lname = this.Form.value.lname.trim();
    const age = this.Form.value.age;
    const email = this.Form.value.email.trim();
    const password = this.Form.value.password.trim();
    const vpassword = this.Form.value.vpassword.trim();

    if (!fname || !lname || !age || !email || !password || !vpassword) {
      console.log('Faltan datos por completar');
      return;
    } else if (password !== vpassword) {
      console.log('Contraseñas distintas');
      return;
    }

    const data: IForm = { fname, lname, age, email, password, vpassword };
    this.formData.push(data);
    this.saveData();
    console.log('Enviado');
    this.Form.reset();
  }

  private saveData(): void {
    localStorage.setItem('formData', JSON.stringify(this.formData));
  }


  deleteUser(event: Event, index: number): void {
    event.preventDefault();
    this.formData.splice(index, 1);
    this.saveData();
  }

  searchUser(event: Event){
    
  }
}
