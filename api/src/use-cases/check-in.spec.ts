import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { CheckInUseCase } from './check-in';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { MaxDistanceError } from './errors/max-distance-error';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-erros';

// Unit Test - testes unitarios 

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase // system under test

describe('Check-in Use Case', () => {

    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository()
        gymsRepository = new InMemoryGymsRepository()
        sut = new CheckInUseCase(checkInsRepository, gymsRepository)

        await gymsRepository.create({
            id: 'gym-01',
            title: 'JavaScript Gym',
            description: '',
            phone: '',
            latitude: -9.416485,
            longitude: -36.623660,
        })
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    // Teste para validar que o usuario pode fazer check-in
    it('should be able to check in', async () => {



        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -9.416485,
            userLongitude: -36.623660
        })
        expect(checkIn.id).toEqual(expect.any(String))

    })

    // Teste para validar que o usuario nao pode fazer check-in duas vezes no mesmo dia
    // TDD: red - green - refactor

    it('should not be able to check in twice in the same day', async () => {

        vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0)) // 20 de janeiro de 2023 as 8:00
        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -9.416485,
            userLongitude: -36.623660
        })
        // -9.4164643,-36.6237278,21z
        await expect(() =>

            sut.execute({
                gymId: 'gym-01',
                userId: 'user-01',
                userLatitude: -9.416485,
                userLongitude: -36.623660
            })
        ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)

    })
    it('should be able to check in twice but in different days', async () => {

        vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0)) // 20 de janeiro de 2023 as 8:00
        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -9.416485,
            userLongitude: -36.623660
        })

        vi.setSystemTime(new Date(2023, 0, 21, 8, 0, 0)) // 20 de janeiro de 2023 as 8:00
        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -9.416485,
            userLongitude: -36.623660
        })

        expect(checkIn.id).toEqual(expect.any(String))

    })

    it('should not be able to check in on distant gym', async () => {

        //-9.406466, -36.629427
        //-9.406307, -36.629162
        gymsRepository.items.push({
            id: 'gym-02',
            title: 'JavaScript Gym',
            description: '',
            phone: '',
            latitude: new Decimal(-9.406466),
            longitude: new Decimal(-36.629427),
        })

        await expect(() =>
            sut.execute({
                gymId: 'gym-02',
                userId: 'user-01',
                userLatitude: -9.4076533,
                userLongitude: -36.6277555,
            }),
        ).rejects.toBeInstanceOf(MaxDistanceError)
    })
})