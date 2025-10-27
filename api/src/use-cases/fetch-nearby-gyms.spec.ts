import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';

// Unit Test - testes unitarios 

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase // system under test

describe('Fetch Nearby Gyms Use Case', () => {

    beforeEach(async () => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new FetchNearbyGymsUseCase(gymsRepository)
    })

    // Teste para validar que o usuario pode fazer check-in
    it('should be able to fetch nearby gyms', async () => {

        await gymsRepository.create({
            title: 'Near Gym',
            description: 'Some description',
            phone: '11999999999',
            latitude: -9.406466,
            longitude: -36.629427,
        })
        await gymsRepository.create({
            title: 'Far Gym',
            description: 'Some description',
            phone: '11999999999',
            latitude: -9.353117474579369, 
            longitude: -36.4697031249944,
        })

        const { gyms } = await sut.execute({
            userLatitude: -9.416485,
            userLongitude: -36.623660
        })
        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Near Gym' })

        ])

    })

   
})