import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface Request {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ date, provider_id }: Request): Promise<Appointment> {
    const appointmentsrepository = getCustomRepository(AppointmentsRepository);

    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await appointmentsrepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked', 400);
    }

    const appointment = appointmentsrepository.create({
      provider_id,
      date: appointmentDate,
    });

    await appointmentsrepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
