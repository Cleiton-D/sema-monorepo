import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateStudentService from '@modules/students/services/CreateStudentService';
import ListStudentsService from '@modules/students/services/ListStudentsService';
import ShowStudentService from '@modules/students/services/ShowStudentService';

class StudentsController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const showStudent = container.resolve(ShowStudentService);
    const student = await showStudent.execute({
      studentId: id,
    });

    return response.json(classToClass(student));
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { name, cpf, rg } = request.query;

    const listStudents = container.resolve(ListStudentsService);
    const students = await listStudents.execute({
      name: name as string,
      cpf: cpf as string,
      rg: rg as string,
    });

    return response.json(classToClass(students));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const {
      name,
      mother_name,
      dad_name,
      birth_date,
      gender,
      address,
      contacts,
      cpf,
      rg,
      nis,
      birth_certificate,
      breed,
      identity_document,
      nationality,
      unique_code,
      naturalness,
      naturalness_uf,
    } = request.body;

    const createStudent = container.resolve(CreateStudentService);
    const student = await createStudent.execute({
      name,
      mother_name,
      dad_name,
      birth_date,
      gender,
      address,
      contacts,
      cpf,
      rg,
      nis,
      birth_certificate,
      breed,
      identity_document,
      nationality,
      naturalness,
      unique_code,
      naturalness_uf,
    });

    return response.json(student);
  }
}

export default StudentsController;
