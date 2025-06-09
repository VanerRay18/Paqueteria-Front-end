import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-endpoint',
  templateUrl: './endpoint.component.html',
  styleUrls: ['./endpoint.component.css']
})
export class EndpointComponent implements OnInit{
  userForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      url: ['', Validators.required],
      metodo: ['', Validators.required],
      obj: ['', Validators.required],
      heders: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.userForm.valid) {
      console.log(this.userForm.value);
      // Aquí puedes llamar a tu servicio para guardar el usuario
    }
  }
}
