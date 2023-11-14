import { Injectable } from '@nestjs/common';
import { CrudService } from '../crud/crud.service';
import { AppointmentEntity } from './appointment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ShiftsService } from '../shifts/shifts.service';

@Injectable()
export class AppointmentService extends CrudService<AppointmentEntity> {
  constructor(
    @InjectRepository(AppointmentEntity)
    protected repo: Repository<AppointmentEntity>,
    protected eventEmmiter: EventEmitter2,
    private shiftService: ShiftsService,
  ) {
    super(repo, eventEmmiter);
  }

  //   async freeSlotsByEmployee(shopId, employeeId, date) {
  //     const busySlots = await this.repo
  //       .createQueryBuilder('app')
  //       .select(['app.slot'])
  //       .where('app.shopId = :shopId', { shopId })
  //       .andWhere('app.employeeId = :employeeId', { employeeId })
  //       .andWhere('app.date = :date', { date })
  //       .getMany();

  //     const listOfBusySlots = [];

  //     busySlots.map((item) => listOfBusySlots.push(item.slot));

  //     const allSlots = await this.generatAllSlots(9, 15);

  //     console.log('all', allSlots);
  //     console.log('busy', listOfBusySlots);

  //     const freeSlots = allSlots.filter(
  //       (slot) => !listOfBusySlots.includes(slot),
  //     );

  //     return freeSlots;
  //   }
  async freeSlotsByEmployee(shopId, employeeId, date) {
    const freeSlots = await this.repo
      .createQueryBuilder('app')
      .select(['app.slot', 'app.id'])
      .where('app.shopId = :shopId', { shopId })
      .andWhere('app.employeeId = :employeeId', { employeeId })
      .andWhere('app.date = :date', { date })
      .andWhere('app.status = :status', { status: 'AVAILABLE' })
      .getMany();

    return freeSlots;
  }
  async freeSlotsByTime(shopId, slot, date) {
    const freeSlots = await this.repo
      .createQueryBuilder('app')
      .select(['app.slot', 'app.id', 'app.employeeId'])
      .where('app.shopId = :shopId', { shopId })
      .andWhere('app.slot = :slot', { slot })
      .andWhere('app.date = :date', { date })
      .andWhere('app.status = :status', { status: 'AVAILABLE' })
      .getMany();

    return freeSlots;
  }
  async bookedSlotsByEmployee(shopId, employeeId, date) {
    const freeSlots = await this.repo
      .createQueryBuilder('app')
      .select(['app.slot', 'app.id'])
      .where('app.shopId = :shopId', { shopId })
      .andWhere('app.employeeId = :employeeId', { employeeId })
      .andWhere('app.date = :date', { date })
      .andWhere('app.status = :status', { status: 'BOOKED' })
      .getMany();

    return freeSlots;
  }

  //   async generatAllSlots(startHoure, endHoure) {
  //     const allSlots = [];
  //     for (let i = startHoure; i < endHoure; i++) {
  //       const newHoureSlots = [`${i}:00`, `${i}:30`];
  //       allSlots.push(...newHoureSlots);
  //     }

  //     return allSlots;
  //   }

  async generateAllSlots(schedule) {
    const { shopId, dates } = schedule;
    const shifts = await this.shiftService.getShiftsByShop(shopId);

    const slots = [];
    dates.map((item) => {
      const date = item.date;
      item.shifts.map((shift) => {
        const employeeId = shift.employeeId;
        const currentShift = shifts.find((s) => s.id === shift.shiftId);
        currentShift.slots.map((slot) =>
          slots.push({ slot, shopId, date, employeeId }),
        );
      });
    });
    return await this.repo.save(slots);
  }
}
