import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class PlayList {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    audioId: number;

    @CreateDateColumn()
    createTime: number;

    @UpdateDateColumn()
    updateTime: number;
}