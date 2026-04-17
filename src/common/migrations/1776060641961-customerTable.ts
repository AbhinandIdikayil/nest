import { MigrationInterface, QueryRunner } from 'typeorm';

export class CustomerTable1776060641961 implements MigrationInterface {
  name = 'CustomerTable1776060641961';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "customers" (
        "id" varchar NOT NULL,
        "first_name" varchar NOT NULL,
        "last_name" varchar NOT NULL,
        "email" varchar NOT NULL,
        "phone" varchar NOT NULL,
        CONSTRAINT "PK_user_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_CUSTOMER_EMAIL" ON "customers" ("email")
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_CUSTOMER_PHONE" ON "customers" ("phone")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_CUSTOMER_PHONE"`);
    await queryRunner.query(`DROP INDEX "IDX_CUSTOMER_EMAIL"`);
    await queryRunner.query(`DROP TABLE "customers"`);
  }
}
