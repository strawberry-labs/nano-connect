import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1762604210888 implements MigrationInterface {
    name = 'InitialSchema1762604210888'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "registered_apps" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "domains" text array NOT NULL, "client_id" character varying NOT NULL, "client_secret" character varying NOT NULL, "logo_url" character varying, "status" character varying NOT NULL DEFAULT 'active', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c6040a7ceaafb39c98dfe07bda2" UNIQUE ("name"), CONSTRAINT "UQ_9799dee17a3ed59bcd44d82cca1" UNIQUE ("client_id"), CONSTRAINT "PK_23130b9c078f9da3f3c46ff7c0a" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "registered_apps"`);
    }

}
