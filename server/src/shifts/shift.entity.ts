import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne } from 'typeorm';
import { CrudEntity } from '../crud/crud.entity';
import { ShopEntity } from '../shop/shop.entity';

@Entity({ name: 'shifts' })
export class ShiftEntity extends CrudEntity {
  @ManyToOne(() => ShopEntity, (shop) => shop.shifts)
  shop: ShopEntity;
  @Column()
  name: string;
  @Column()
  startTime: string;
  @Column()
  endTime: string;
  @Column({ default: 30 })
  slotDuration: number;
  @Column({ type: 'simple-array', nullable: true })
  slots: string[];

  @BeforeInsert()
  @BeforeUpdate()
  /**
   * Generates time slots based on the start time, end time, and slot duration.
   */
  async generateSlots() {
    const [startHour, startMinute] = this.startTime.split(':').map(Number);
    const [endHour, endMinute] = this.endTime.split(':').map(Number);

    const startTimeInMinutes = startHour * 60 + startMinute;
    const endTimeInMinutes = endHour * 60 + endMinute;

    // Get slotDuration from the shop
    const slotDuration = this.slotDuration;
    console.log('slotDuration', slotDuration);

    const slots = [];

    for (let i = startTimeInMinutes; i < endTimeInMinutes; i += slotDuration) {
      const hour = Math.floor(i / 60);
      const minute = i % 60;
      const slot = `${hour.toString().padStart(2, '0')}:${minute
        .toString()
        .padStart(2, '0')}`;
      slots.push(slot);
    }

    this.slots = slots;

    console.log('slots', slots);
  }
}
