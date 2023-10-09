import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Topic } from 'src/app/interfaces/interface';
import { InterfaceCourse } from 'src/app/interfaces/interface-course';
import { NewTopic } from 'src/app/interfaces/newtopic';
import { CourseService } from 'src/app/services/course.service';
import { TopicService } from 'src/app/services/topic.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-registertopics',
  templateUrl: './registertopics.component.html',
  styleUrls: ['./registertopics.component.css']
})
export class RegistertopicsComponent implements OnInit {

  topics: any[] = [];

  @Output() modalClosed = new EventEmitter<void>();

  newTopic: NewTopic = {
    title: '',
    message: '',
    solved: false,
    created_at: '', 
    user: {
      id: 0,
    },
    course: {
      id: 0,
    }
  };

  courses: InterfaceCourse[] = [];

  selectedCourseId: number = 0;

  userId: number | null = null;

  constructor(private topicService: TopicService, private courseService: CourseService, private usersService: UsersService) { }


  ngOnInit(): void {
    this.courseService.getCourses().subscribe(
      (data: InterfaceCourse[]) => {
        console.log('Respuesta del servicio getCourses:', data);
        this.courses = data;
      },
      (error) => {
        if (error.status === 403) {
          console.error('No tienes permiso para acceder a la lista de cursos.');
        } else {
          console.error('Error al obtener la lista de cursos:', error);
        }
      }
    );
    this.usersService.getCurrentUserId().subscribe((userId: number | null) => {
      this.userId = userId;
    });
  }


  closeCreateTopicModal() {
    this.modalClosed.emit();
  }


  createTopic() {
    this.newTopic.course.id = this.selectedCourseId;

    if (this.userId !== null) {
      this.newTopic.user.id = this.userId;

      this.topicService.createTopic(this.newTopic).subscribe(
        (data: Topic) => {
          console.log('Nuevo tema creado:', data);
          this.closeCreateTopicModal();
          window.location.reload();
        },
        (error) => {
          console.error('Error al crear el nuevo tema:', error);
          if (error.error && Array.isArray(error.error)) {
            console.error('Detalles del error:', error.error);
          }
        }
      );
    } else {
      console.error('No se pudo obtener el ID del usuario.');
    }
  }

}
