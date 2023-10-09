
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Topic } from 'src/app/interfaces/interface';
import { TopicService } from 'src/app/services/topic.service';
import { UsersService } from 'src/app/services/users.service';


@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.css']
})
export class TopicsComponent implements OnInit {

  mostrarModal = false; 

  topics: Topic[] = [];


  menuAbierto: boolean[] = [];
  menuActualmenteAbierto: number = -1; 


  changeStatus: Topic = {
    id: 0,
    title: '',
    message: '',
    solved: false,
    created_at: '', 
    user: {
      id: 0,
      username: '',
    },
    course: {
      id: 0,
      name: '',
    }
  };



  userId: number | null = null;

  constructor(private topicService: TopicService,
    private datePipe: DatePipe,
    private usersService: UsersService,
    private router: Router) { }

  ngOnInit(): void {
    this.topicService.getTopics().subscribe(
      (data: Topic[]) => { 
        this.topics = data;
        this.topics.forEach(topic => {
          if (topic.created_at !== null) {
            topic.created_at = this.datePipe.transform(topic.created_at, 'yyyy-MM-dd HH:mm:ss') ?? ''; 
          } else {
            topic.created_at = ''; 
          }
        });

        console.log(this.topics);
      },
      (error) => {
        console.error('Error al obtener los temas:', error);
      }
    );

    this.usersService.getCurrentUserId().subscribe((userId: number | null) => {
      this.userId = userId;
    });

    this.topics.forEach(() => this.menuAbierto.push(false));
  }

  isCurrentUserAuthor(topic: Topic): boolean {
    return this.userId !== null && topic.user.id === this.userId;
  }


  markTopicAsSolved(topic: Topic): void {
    topic.solved = true;

    if (this.userId !== null) {
      this.changeStatus.user.id = this.userId;

      this.topicService.changeStatus(topic.id).subscribe(
        (data: Topic) => {
          console.log('Tema marcado como resuelto:', data);
        },
        (error) => {
          console.error('Error al marcar el tema como resuelto:', error);
          topic.solved = false;
        }
      );
    } else {
      console.error('No se pudo obtener el ID del usuario.');
    }
  }



  abrirCerrarMenu(index: number): void {
    if (this.menuActualmenteAbierto === index) {
      this.menuAbierto[index] = false;
      this.menuActualmenteAbierto = -1; 
    } else {
      if (this.menuActualmenteAbierto !== -1) {
        this.menuAbierto[this.menuActualmenteAbierto] = false;
      }
      this.menuAbierto[index] = true;
      this.menuActualmenteAbierto = index;
    }
  }

  editarTopico(): void { }




  eliminarTopico(topicId: number, index: number): void {
    if (topicId) {
      this.topicService.deleteTopic(topicId).subscribe(
        () => {
          console.log('Tema eliminado exitosamente.');
          this.menuAbierto[index] = false;
          this.menuActualmenteAbierto = -1;
          this.topics = this.topics.filter(topic => topic.id !== topicId);
        },
        (error) => {
          console.error('Error al eliminar el tema:', error);
        }
      );
    } else {
      console.error('ID del tema no válido.');
    }
  }


  navigateToAnswer(topic: Topic): void {
    const formattedTitle = topic.title
      .toLowerCase() 
      .replace(/ /g, '-') 
      .replace(/[^a-z0-9-]/g, ''); 

    this.router.navigate(['/answers', formattedTitle, topic.id,]);
  }



}
