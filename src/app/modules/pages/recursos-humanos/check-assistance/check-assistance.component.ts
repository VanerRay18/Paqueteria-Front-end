import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-check-assistance',
  templateUrl: './check-assistance.component.html',
  styleUrls: ['./check-assistance.component.css']
})
export class CheckAssistanceComponent {

  constructor(
    private fb: FormBuilder,
    
  ) {

   }

 token: string[] = ['', '', '', '', '', ''];
  tokenArray = new Array(6);

  onInput(event: any, index: number) {
    const input = event.target;
    const value = input.value;

    if (value.length === 1 && index < 5) {
      const next = input.nextElementSibling;
      if (next) next.focus();
    }
  }

  onBackspace(event: any, index: number) {
    const input = event.target;
    if (input.value === '' && index > 0) {
      const prev = input.previousElementSibling;
      if (prev) prev.focus();
    }
  }
}
