import { BeforeInsert, Column, Entity, ManyToOne } from 'typeorm';
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
  @Column()
  slotDuration: number;
  @Column({ type: 'simple-array' })
  slots: string[];

  @BeforeInsert()
  async generateSlots() {
    const startTime = this.startTime.split(':');
    const endTime = this.endTime.split(':');
    const startHoure = parseInt(startTime[0]);
    const startMinute = parseInt(startTime[1]);
    const endHoure = parseInt(endTime[0]);
    const endMinute = parseInt(endTime[1]);
    const startTimeAsDate = new Date(2023, 1, 1, startHoure, startMinute, 0);
    const endTimeAsDate = new Date(2023, 1, 1, endHoure, endMinute, 0);

    const slots = [];

    slots.push(this.startTime);

    for (let i = startTimeAsDate; i < endTimeAsDate; ) {
      i = new Date(i.getTime() + this.slotDuration * 60000);
      if (i < endTimeAsDate) {
        let houre;
        let minute;
        i.getHours() < 10
          ? (houre = `0${i.getHours()}`)
          : (houre = i.getHours());
        i.getMinutes() < 10
          ? (minute = `0${i.getMinutes()}`)
          : (minute = i.getMinutes());
        const slot = `${houre}:${minute}`;

        slots.push(slot);
      }
    }

    this.slots = slots;
  }
}
