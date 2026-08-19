import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataForm } from "./data-form/data-form";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DataForm],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Ejercicio_1B');
}
