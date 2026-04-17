import { Entity, Column, PrimaryColumn, Index } from 'typeorm';

@Entity('customers')
@Index('IDX_CUSTOMER_EMAIL', ['email'], { unique: true })
@Index('IDX_CUSTOMER_PHONE', ['phone'], { unique: true })
export class Customer {
  @PrimaryColumn({ type: 'varchar' }) // 👈 matches migration
  id!: string;

  @Column({ name: 'first_name', type: 'varchar' })
  firstName!: string;

  @Column({ name: 'last_name', type: 'varchar' })
  lastName!: string;

  @Column({ type: 'varchar' })
  email!: string;

  @Column({ type: 'varchar' })
  phone!: string;
}