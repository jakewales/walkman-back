import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Length } from 'class-validator';


@Entity()
export class Audio {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 100
    })
    name: string;

    @Column({
        type: 'text',
        nullable: true
    })
    desc: string;
    
    @Column({
        length: 100,
        nullable: true
    })
    singer: string;

    @Column({
        nullable: true
    })
    timeLength: number;

    @Column()
    url: string;

    @Column({
        length: 100,
        nullable: true
    })
    album: string;

    @CreateDateColumn()
    create_time: number;

    @UpdateDateColumn()
    modify_time: number;
}