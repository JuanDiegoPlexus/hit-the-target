import { Component, OnDestroy, Inject, PLATFORM_ID, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Bird1Component } from "../../components/targets/bird1/bird1.component";
import { Router } from '@angular/router';
import { HealthComponent } from "../../components/interactive/health/health.component";

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [Bird1Component, CommonModule, HealthComponent],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnDestroy {
  @ViewChild(HealthComponent) healthComponent!: HealthComponent; // Referencia al componente de salud
  @ViewChildren(Bird1Component) birdComponents!: QueryList<Bird1Component>; // Referencia a los componentes Bird1

  birds: { id: number }[] = []; // Array de objetos con identificadores únicos
  private birdInterval: any;
  private nextId = 0; // Contador para generar identificadores únicos
  private birdsLost = 0;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router // Inyecta el Router aquí
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.startBirdGeneration();
    }
  }

  private startBirdGeneration(): void {
    this.birdInterval = setInterval(() => {
      this.birds.push({ id: this.nextId++ }); // Agrega un nuevo pájaro con un identificador único
    }, 1000);
  }

  onBirdDestroyed(id: number): void {
    this.birds = this.birds.filter(bird => bird.id !== id); // Elimina el pájaro por su identificador
    this.birdsLost++; // Incrementa el contador de pájaros perdidos
    this.healthComponent.damage();
    if (this.birdsLost >= 6) {
      alert('¡Has perdido!'); // Muestra un mensaje de alerta al perder
      this.router.navigate(['/']); // Redirige a la página de bienvenida
    }
  }

  onBirdDestroyedByClick(id: number): void {
    // Encuentra el componente Bird1 correspondiente
    const birdComponent = this.birdComponents.find(bird => bird.id === id);
    if (birdComponent) {
      birdComponent.triggerExplosion(); // Llama al método del componente hijo
    }

    // Elimina el pájaro del array después de un retraso
    //setTimeout(() => {
      this.birds = this.birds.filter(bird => bird.id !== id);
    //}, 500); // Retraso para mostrar la explosión
  }

  ngOnDestroy(): void {
    if (this.birdInterval) {
      clearInterval(this.birdInterval);
    }
  }
}
