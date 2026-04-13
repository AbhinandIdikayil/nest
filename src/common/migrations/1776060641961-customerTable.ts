import { MigrationInterface, QueryRunner } from "typeorm";

export class CustomerTable1776060641961 implements MigrationInterface {
  name = 'CustomerTable1776060641961'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user" (
        "id" varchar NOT NULL,
        "first_name" varchar NOT NULL,
        "last_name" varchar NOT NULL,
        "email" varchar NOT NULL,
        "phone" varchar NOT NULL,
        CONSTRAINT "PK_user_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_user_email" UNIQUE ("email"),
        CONSTRAINT "UQ_user_phone" UNIQUE ("phone")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}