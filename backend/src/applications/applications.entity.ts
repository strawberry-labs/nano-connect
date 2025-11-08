/* eslint-disable indent */
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'registered_apps' })
export class RegisteredApp {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', unique: true })
    name!: string;

    @Column({ type: 'text', array: true })
    domains!: string[];

    @Column({ type: 'varchar', unique: true })
    client_id!: string;

    @Column({ type: 'varchar' })
    client_secret!: string;

    @Column({ type: 'varchar', nullable: true })
    logo_url!: string | null;

    @Column({ type: 'varchar', default: 'active' })
    status!: string;

    @CreateDateColumn({ name: 'created_at' })
    created_at!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at!: Date;
}
