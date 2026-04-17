import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProductTable1776439386552 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // UUID extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // PRODUCTS
    await queryRunner.query(`
            CREATE TABLE "products" (
                "id" VARCHAR PRIMARY KEY,
                "name" VARCHAR NOT NULL,
                "description" TEXT,
                "thumbnail" TEXT,
                "created_at" TIMESTAMP DEFAULT now()
            )
        `);

    // PRODUCT IMAGES
    await queryRunner.query(`
            CREATE TABLE "product_images" (
                "id" VARCHAR PRIMARY KEY,
                "product_id" VARCHAR REFERENCES "products"("id") ON DELETE CASCADE,
                "url" TEXT NOT NULL
            )
        `);

    // PRODUCT OPTIONS
    await queryRunner.query(`
            CREATE TABLE "product_options" (
                "id" VARCHAR PRIMARY KEY,
                "product_id" VARCHAR REFERENCES "products"("id") ON DELETE CASCADE,
                "name" VARCHAR NOT NULL
            )
        `);

    // PRODUCT OPTION VALUES
    await queryRunner.query(`
            CREATE TABLE "product_option_values" (
                "id" VARCHAR PRIMARY KEY,
                "option_id" VARCHAR REFERENCES "product_options"("id") ON DELETE CASCADE,
                "value" VARCHAR NOT NULL
            )
        `);

    // VARIANTS
    await queryRunner.query(`
            CREATE TABLE "variants" (
                "id" VARCHAR PRIMARY KEY,
                "product_id" VARCHAR REFERENCES "products"("id") ON DELETE CASCADE,
                "title" VARCHAR,
                "price" NUMERIC NOT NULL,
                "discounted_price" NUMERIC,
                "quantity" INT DEFAULT 0,
                "weight" NUMERIC
            )
        `);

    // VARIANT OPTION VALUES
    await queryRunner.query(`
            CREATE TABLE "variant_option_values" (
                "id" VARCHAR PRIMARY KEY,
                "variant_id" VARCHAR REFERENCES "variants"("id") ON DELETE CASCADE,
                "option_value_id" VARCHAR REFERENCES "product_option_values"("id") ON DELETE CASCADE
            )
        `);

    // INDEXES 🔥
    await queryRunner.query(
      `CREATE INDEX "IDX_PRODUCTS_NAME" ON "products" ("name")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_VARIANTS_PRODUCT" ON "variants" ("product_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_OPTIONS_PRODUCT" ON "product_options" ("product_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_OPTION_VALUES_OPTION" ON "product_option_values" ("option_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_VARIANT_OPTION_VARIANT" ON "variant_option_values" ("variant_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_VARIANT_OPTION_VARIANT"`);
    await queryRunner.query(`DROP INDEX "IDX_OPTION_VALUES_OPTION"`);
    await queryRunner.query(`DROP INDEX "IDX_OPTIONS_PRODUCT"`);
    await queryRunner.query(`DROP INDEX "IDX_VARIANTS_PRODUCT"`);
    await queryRunner.query(`DROP INDEX "IDX_PRODUCTS_NAME"`);

    await queryRunner.query(`DROP TABLE "variant_option_values"`);
    await queryRunner.query(`DROP TABLE "variants"`);
    await queryRunner.query(`DROP TABLE "product_option_values"`);
    await queryRunner.query(`DROP TABLE "product_options"`);
    await queryRunner.query(`DROP TABLE "product_images"`);
    await queryRunner.query(`DROP TABLE "products"`);
  }
}
