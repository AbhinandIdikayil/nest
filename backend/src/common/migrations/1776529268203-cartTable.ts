import { MigrationInterface, QueryRunner } from 'typeorm';

export class CartTable1776529268203 implements MigrationInterface {
  name = 'CartTable1776529268203';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // CARTS
    await queryRunner.query(`
            CREATE TABLE "carts" (
                "id" VARCHAR PRIMARY KEY,
                "customer_id" VARCHAR REFERENCES "customers"("id") ON DELETE SET NULL,
                "created_at" TIMESTAMP DEFAULT now(),
                "completed_at" TIMESTAMP,
                "updated_at" TIMESTAMP DEFAULT now()
            )
        `);

    // CART ITEMS
    await queryRunner.query(`
            CREATE TABLE "cart_items" (
                "id" VARCHAR PRIMARY KEY,
                "product_title" VARCHAR NOT NULL,
                "product_description" VARCHAR NOT NULL,
                "cart_id" VARCHAR REFERENCES "carts"("id") ON DELETE CASCADE,
                "variant_id" VARCHAR REFERENCES "variants"("id"),
                "quantity" INT NOT NULL,
                "unit_price" NUMERIC NOT NULL,
                "created_at" TIMESTAMP DEFAULT now()
            )
        `);

    // INDEXES 🔥
    await queryRunner.query(`
            CREATE INDEX "IDX_CART_CUSTOMER" ON "carts" ("customer_id")
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_CART_ITEM_CART" ON "cart_items" ("cart_id")
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_CART_ITEM_VARIANT" ON "cart_items" ("variant_id")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_CART_ITEM_VARIANT"`);
    await queryRunner.query(`DROP INDEX "IDX_CART_ITEM_CART"`);
    await queryRunner.query(`DROP INDEX "IDX_CART_CUSTOMER"`);

    await queryRunner.query(`DROP TABLE "cart_items"`);
    await queryRunner.query(`DROP TABLE "carts"`);
  }
}
