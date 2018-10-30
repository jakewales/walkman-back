import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Length } from 'class-validator';


@Entity()
export class Audio {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 100
    })
    name: string;

    @Length(100)
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

    @Column()
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