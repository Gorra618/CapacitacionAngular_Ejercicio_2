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
  filteredFormData: IForm[] = [];
  Form!: FormGroup;
  editingUser: IForm | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const savedData = localStorage.getItem('formData');
    this.formData = savedData ? JSON.parse(savedData) : [];
    this.filteredFormData = [...this.formData];

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
    const data: IForm = {
      fname: this.Form.value.fname.trim(),
      lname: this.Form.value.lname.trim(),
      age: this.Form.value.age,
      email: this.Form.value.email.trim(),
      password: this.Form.value.password.trim(),
      vpassword: this.Form.value.vpassword.trim(),
    };

    if (this.editingUser) {
      const index = this.formData.indexOf(this.editingUser);

      if (index !== -1) {
        this.formData[index] = data;
      }

      this.editingUser = null;
    } else {
      this.formData.push(data);
    }

    this.filteredFormData = [...this.formData];
    this.saveData();
    this.Form.reset();
  }

  editUser(user: IForm): void {
    this.editingUser = user;

    this.Form.patchValue({
      fname: user.fname,
      lname: user.lname,
      age: user.age,
      email: user.email,
      password: user.password,
      vpassword: user.vpassword,
    });
  }

  cancelEdit(): void {
    this.editingUser = null;
    this.Form.reset();
  }

  private saveData(): void {
    localStorage.setItem('formData', JSON.stringify(this.formData));
  }

  deleteUser(event: Event, index: number): void {
    event.preventDefault();
    const user = this.filteredFormData[index];
    this.formData = this.formData.filter((item) => item !== user);
    this.filteredFormData = this.filteredFormData.filter((item) => item !== user);
    this.saveData();
  }

  searchUser(event: Event): void {
    const search = (event.target as HTMLInputElement).value.toLowerCase().trim();

    this.filteredFormData = this.formData.filter((user) =>
      `${user.fname} ${user.lname} ${user.email}`.toLowerCase().includes(search),
    );
  }
}
