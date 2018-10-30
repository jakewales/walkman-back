import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Length, IsEmail } from 'class-validator';

@Entity()
export class Personnel{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 100
    })
    @IsEmail()
    email: string;

    @Column({
        length: 200
    })
    password: string;

    @Column({
        length: 100
    })
    @Length(2, 50)
    name: string;

    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @CreateDateColumn()
    create_time: number;

    @UpdateDateColumn()
    modified_time: number;

    @Column({
        default: 'I'
    })
    level: string;

    @Column({
        default: true
    })
    enable: boolean;
}