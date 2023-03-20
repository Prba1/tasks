import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Task } from './task.model';
import { TaskService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  tasks$: Observable<Task[]>;
  completedTasks$: Observable<Task[]>;
  updating = false;
  error = '';
  creating = false;

  @ViewChild('cancelButton') cancelButton: ElementRef<any>;
  @ViewChild('nuevaTarea') nuevaTarea: ElementRef<HTMLTextAreaElement>;
  constructor(private taskService: TaskService,private elementRef: ElementRef) {
    this.tasks$ = this.taskService.getAllTasks();
    this.completedTasks$ = this.tasks$.pipe(
      map(tasks => tasks.filter(task => task.estado === 1))
    );
    this.cancelButton = elementRef.nativeElement.querySelector('#cancelButton');
    this.nuevaTarea = elementRef.nativeElement.querySelector('#nuevaTarea');
  }

  ngOnInit() {
    this.tasks$ = this.taskService.getAllTasks();
    this.completedTasks$ = this.tasks$.pipe(
      map(tasks => tasks.filter(task => task.estado === 1))
    );
  }


  handleUpdateError(error: any) {
    console.error('Error updating task:', error);
    // Aquí podrías mostrar una alerta o notificación para el usuario indicando que ha ocurrido un error al actualizar la tarea
  }

  updateTaskStatus(task: Task, newStatus: 0 | 1) {
    if (this.updating) {
      return; // Si ya se está actualizando otra tarea, se evita realizar otra solicitud
    }
    task.estado = newStatus;
    this.updating = true;
    this.taskService.updateTask(task).pipe(take(1)).subscribe(
      (updatedTask) => {
        console.log(`Tarea ${updatedTask} actualizada`);

        this.updating = false;
        this.tasks$ = this.taskService.getAllTasks(); // Actualizar la lista de tareas manualmente
        this.completedTasks$ = this.tasks$.pipe(
          map(tasks => tasks.filter(task => task.estado === 1))
        );
      },
      (error) => {
        console.log(`Error actualizando tarea ${task.id}`, error);
        this.handleUpdateError(error);
        this.updating = false;
      }
    );
  }

  updateTask(task: Task, bodyTask: string) {
    if (this.updating) {
      return; // Si ya se está actualizando otra tarea, se evita realizar otra solicitud
    }
    task.nota = bodyTask;
    this.updating = true;
    this.taskService.updateTask(task).pipe(take(1)).subscribe(
      (updatedTask) => {
        console.log(`Tarea ${updatedTask} actualizada`);
        this.updating = false;
        this.tasks$ = this.taskService.getAllTasks(); // Actualizar la lista de tareas manualmente
        this.completedTasks$ = this.tasks$.pipe(
          map(tasks => tasks.filter(task => task.estado === 1))
        );
      },
      (error) => {
        console.log(`Error actualizando tarea ${task.id}`, error);
        this.handleUpdateError(error);
        this.updating = false;

      }
    );
  }

  createTask(nuevaTarea: string) {
    // Validación: si la entrada de texto está vacía o contiene solo espacios en blanco
    if (!nuevaTarea.trim()) {
      this.error = 'Por favor, ingrese una tarea válida';
      return;
    }

    const task: Task = {
      id: null,
      nota: nuevaTarea,
      estado: 0 // Por defecto, la nueva tarea se crea con estado "pendiente" (0)
    };

    this.creating = true; // Indicar que se está creando una tarea

    this.taskService.createTask(task).subscribe(
      (createdTask) => {
        console.log('Tarea creada:', createdTask);
        this.tasks$ = this.taskService.getAllTasks(); // Actualizar la lista de tareas manualmente
        this.completedTasks$ = this.tasks$.pipe(
          map(tasks => tasks.filter(task => task.estado === 1))
        );

        this.error = ''; // Resetear el mensaje de error si la tarea se crea correctamente
        this.creating = false; // Indicar que la tarea se ha creado correctamente

        // Cerrar el modal si se ha creado la tarea correctamente

        this.cancelButton.nativeElement.click();
        this.nuevaTarea.nativeElement.value = '';

      },
      (error) => {
        console.log('Error creando tarea:', error);
        this.error = 'Error creando tarea'; // Mostrar mensaje de error si falla la creación de la tarea
        this.creating = false; // Indicar que ha ocurrido un error al crear la tarea

        // Mantener el modal abierto si ha ocurrido un error al crear la tarea
      }
    );
  }




  deleteTask(task: Task) {
    if (this.updating) {
      return; // Si ya se está actualizando otra tarea, se evita realizar otra solicitud
    }

    this.updating = true;
    this.taskService.deleteTask(task).pipe(take(1)).subscribe(
      (deletedTask) => {
        console.log(`Tarea ${deletedTask} eliminada`);

        this.updating = false;
        this.tasks$ = this.taskService.getAllTasks(); // Actualizar la lista de tareas manualmente
        this.completedTasks$ = this.tasks$.pipe(
          map(tasks => tasks.filter(task => task.estado === 1))
        );
      },
      (error) => {
        console.log(`Error actualizando tarea ${task.id}`, error);
        this.handleUpdateError(error);
        this.updating = false;
      }
    );
  }


}
