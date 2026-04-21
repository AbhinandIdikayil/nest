import { MigrationInterface, QueryRunner } from 'typeorm';

export class Addordercolumnincart1776704897813 implements MigrationInterface {
  name = 'Addordercolumnincart1776704897813';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1️⃣ Create orders table FIRST
    await queryRunner.query(`
      CREATE TABLE "orders" (
        "id" VARCHAR PRIMARY KEY,
        "cart_id" VARCHAR REFERENCES "carts"("id") ON DELETE SET NULL,
        "customer_id" VARCHAR REFERENCES "customers"("id") ON DELETE SET NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    // 2️⃣ Indexes for orders
    await queryRunner.query(`
      CREATE INDEX "IDX_ORDER_CART" ON "orders" ("cart_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_ORDER_CUSTOMER" ON "orders" ("customer_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_ORDER_ID" ON "orders" ("id")
    `);

    // 3️⃣ Now safe to alter carts
    await queryRunner.query(`
      ALTER TABLE "carts"
      ADD COLUMN "order_id" VARCHAR
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_cart_order_id" ON "carts" ("order_id")
    `);

    await queryRunner.query(`
      ALTER TABLE "carts"
      ADD CONSTRAINT "FK_cart_order"
      FOREIGN KEY ("order_id") REFERENCES "orders"("id")
      ON DELETE SET NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // reverse order

    await queryRunner.query(`
      ALTER TABLE "carts" DROP CONSTRAINT "FK_cart_order"
    `);

    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_cart_order_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "carts" DROP COLUMN "order_id"
    `);

    await queryRunner.query(`
      DROP TABLE "orders"
    `);
  }
}
