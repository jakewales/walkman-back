import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Length } from 'class-validator';


@Entity()
export class Audio {
    @PrimaryGeneratedColumn()
    id: number;

    // 曲名
    @Column({
        length: 100
    })
    name: string;

    // CD
    @Column({
        type: 'text',
        nullable: true
    })
    disk: string;

    // 艺术家
    @Column({
        length: 100,
        nullable: true
    })
    artists: string;

    // 持续时间
    @Column({
        nullable: true
    })
    duration: number;
    
    // 专辑
    @Column({
        length: 100,
        nullable: true
    })
    album: string;

    // 类型
    @Column({
        nullable: true
    })
    genre: string;

    // 音频类型
    @Column({
        nullable: true
    })
    data_formate: string;

    // 比特率
    @Column({
        nullable: true
    })
    bitrate: number;

    // 采样频率
    @Column({
        nullable: true
    })
    sample_rate: number;

    // 声道数量
    @Column({
        nullable: true
    })
    number_of_channerls: number;

    // 是否无损
    @Column({
        nullable: true
    })
    lossless: boolean;

    // 年代
    @Column({
        nullable: true
    })
    year: number

    // 存储链接
    @Column()
    url: string;

    @CreateDateColumn()
    create_time: number;

    @UpdateDateColumn()
    modify_time: number;
}